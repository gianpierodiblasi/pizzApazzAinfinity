package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.GridLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSCheckBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTextField;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.math.Z4SignedValuePanel;
import pizzapazza.ui.panel.math.Z4SignedValuePanelOrientation;
import pizzapazza.util.Z4Font;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
public class Z4FontSelectionPanel extends Z4AbstractValuePanel<Z4Font> {

  private final JSTextField filter = new JSTextField();
  private final Array<JSRadioButton> radios = new Array<>();
  private final Z4SignedValuePanel size = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
  private final JSLabel sample = new JSLabel();
  private final JSCheckBox bold = new JSCheckBox();
  private final JSCheckBox italic = new JSCheckBox();

  private final Array<String> fonts;

  /**
   * Creates the object
   *
   * @param fonts The available fonts
   */
  @SuppressWarnings("IndexOfReplaceableByContains")
  public Z4FontSelectionPanel(Array<String> fonts) {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fontselectionpanel");

    this.fonts = fonts;

    Z4UI.addLabel(this, Z4Translations.FILTER, new GBC(0, 0).a(GBC.WEST));

    this.filter.addActionListener(event -> {
      String str = this.filter.getText().toLowerCase();
      this.radios.forEach((radio, index, array) -> {
        radio.setSelected(false);
        radio.getStyle().display = this.fonts.$get(index).toLowerCase().indexOf(str) != -1 ? "flex" : "none";
      });
      this.onFontChange();
    });
    this.add(this.filter, new GBC(0, 1).f(GBC.HORIZONTAL).i(0, 0, 0, 5));

    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.setSignVisible(false);
    this.size.setRange(7, 400);
    this.size.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 12));
    this.size.addChangeListener(event -> this.onFontChange());
    this.add(this.size, new GBC(1, 0).h(2).a(GBC.WEST).i(0, 0, 0, 5));

    this.bold.setText(Z4Translations.BOLD);
    this.bold.addActionListener(event -> this.onFontChange());
    this.add(this.bold, new GBC(2, 1).i(0, 0, 0, 5));

    this.italic.setText(Z4Translations.ITALIC);
    this.italic.addActionListener(event -> this.onFontChange());
    this.add(this.italic, new GBC(3, 1));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridLayout(parseInt(this.fonts.length / 3) + 1, 3, 0, 0));
    panel.cssAddClass("z4fontselectionpanel-fontlist");
    this.add(panel, new GBC(0, 2).w(5));

    ButtonGroup buttonGroup = new ButtonGroup();
    fonts.forEach(font -> this.addFont(font, buttonGroup, panel));

    this.sample.cssAddClass("z4fontselectionpanel-sample");
    this.add(this.sample, new GBC(0, 3).w(5).i(5, 0, 0, 0));
  }

  private void addFont(String font, ButtonGroup buttonGroup, JSPanel panel) {
    JSRadioButton radio = new JSRadioButton();
    radio.setText(font);
    radio.addActionListener(event -> this.onFontChange());

    this.radios.push(radio);
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

  @SuppressWarnings("StringEquality")
  private void onFontChange() {
    int index = this.radios.findIndex(radio -> radio.isSelected() && radio.getStyle().display != "none");
    if (index != -1) {
      this.value = new Z4Font(this.fonts.$get(index), (int) this.size.getValue().getValue(), this.bold.isSelected(), this.italic.isSelected());
      this.sample.setText(Z4Translations.STRING_EXAMPLE);

      this.sample.getStyle().fontFamily = this.value.family;
      this.sample.getStyle().fontSize = this.value.size + "px";
      this.sample.getStyle().fontStyle = this.value.italic ? "italic" : "normal";
      this.sample.getStyle().fontWeight = this.value.bold ? "bold" : "normal";
    } else {
      this.value = null;
      this.sample.setText("");
    }

    this.onchange();
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setValue(Z4Font value) {
    this.value = value;

    int index = this.fonts.findIndex(font -> font == value.family);
    if (index != -1) {
      this.radios.$get(index).setSelected(true);
    } else {
      this.radios.forEach(radio -> radio.setSelected(false));
    }
  }
}
