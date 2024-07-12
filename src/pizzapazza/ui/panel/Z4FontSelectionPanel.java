package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSCheckBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTextField;
import pizzapazza.util.Z4Font;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;

/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
public class Z4FontSelectionPanel extends Z4AbstractValuePanel<Z4Font> {

  private final JSTextField filter = new JSTextField();
  private final Array<JSRadioButton> radios = new Array<>();
  private final JSCheckBox bold = new JSCheckBox();
  private final JSCheckBox italic = new JSCheckBox();
  private final JSLabel sample = new JSLabel();

  private final Array<String> fonts;

  /**
   * Creates the object
   *
   * @param fonts The available fonts
   */
  public Z4FontSelectionPanel(Array<String> fonts) {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fontselectionpanel");

    this.fonts = fonts;

    Z4UI.addLabel(this, Z4Translations.FILTER, new GBC(0, 0).a(GBC.WEST));

    this.filter.addActionListener(event -> {
      String str = this.filter.getText();
      this.radios.forEach((radio, index, array) -> {
        radio.setSelected(false);
        radio.getStyle().display = this.fonts.$get(index).contains(str) ? "flex" : "none";

        this.value = null;
        this.onchange();
      });
    });
    this.add(this.filter, new GBC(0, 1).f(GBC.HORIZONTAL));

    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4fontselectionpanel-fontlist");
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(0, 2));

    ButtonGroup buttonGroup = new ButtonGroup();
    fonts.forEach(font -> this.addFont(font, buttonGroup, panel));
  }

  private void addFont(String font, ButtonGroup buttonGroup, JSPanel panel) {
    JSRadioButton radio = new JSRadioButton();
    radio.setText(font);
    radio.addActionListener(event -> {
//this.value = new Z4Font(font, 0, true, true);
      this.onchange();
    });
    buttonGroup.add(radio);
    panel.add(radio, null);
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
