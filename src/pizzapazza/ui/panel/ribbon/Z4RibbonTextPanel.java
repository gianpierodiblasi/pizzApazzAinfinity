package pizzapazza.ui.panel.ribbon;

import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSColorChooser;
import javascript.swing.JSOptionPane;
import javascript.swing.JSSpinner;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.ui.panel.Z4FontSelectionPanel;
import pizzapazza.ui.panel.color.Z4BiGradientColorChooser;
import pizzapazza.ui.panel.math.Z4RotationPanel;
import pizzapazza.ui.panel.math.Z4RotationPanelOrientation;
import pizzapazza.util.Z4Font;
import pizzapazza.util.Z4TextInfo;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

  private final JSButton font = new JSButton();
  private final Z4RotationPanel rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

  private final JSTextField textText = new JSTextField();
  private final JSCheckBox textEmpty = new JSCheckBox();
  private final Z4BiGradientColorChooser textColor = new Z4BiGradientColorChooser();
  private final JSSpinner textBorder = new JSSpinner();
  private final JSColorChooser textBorderColor = new JSColorChooser();
  private final JSSpinner textShearX = new JSSpinner();
  private final JSSpinner textShearY = new JSSpinner();

  private final JSCheckBox shadow = new JSCheckBox();
  private final JSTextField shadowText = new JSTextField();
  private final JSCheckBox shadowEmpty = new JSCheckBox();
  private final JSSpinner shadowOffsetX = new JSSpinner();
  private final JSSpinner shadowOffsetY = new JSSpinner();
  private final JSSpinner shadowShearX = new JSSpinner();
  private final JSSpinner shadowShearY = new JSSpinner();

  private final JSButton apply = new JSButton();
  private final JSButton reset = new JSButton();

  private Z4Canvas canvas;
  private boolean fontsChecked;
  private final Array<String> fonts = new Array<>();
  private final Z4TextInfo textInfo = new Z4TextInfo();

  /**
   * Creates the object
   */
  public Z4RibbonTextPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");

    this.textInfo.font = new Z4Font("Arial", 12, false, false);

    this.font.setContentAreaFilled(false);
    this.font.setText(Z4Translations.FONT_SELECTION);
    this.font.addActionListener(event -> {
      Z4FontSelectionPanel fontSelectionPanel = new Z4FontSelectionPanel(this.fonts);
      fontSelectionPanel.setValue(this.textInfo.font);

      JSOptionPane.showInputDialog(fontSelectionPanel, Z4Translations.FONT_SELECTION, listener -> fontSelectionPanel.addChangeListener(listener), () -> $exists(fontSelectionPanel.getValue()), response -> {
        if (response == JSOptionPane.OK_OPTION) {
          this.textInfo.font = fontSelectionPanel.getValue();
          this.onTextInfoChange();
        }
      });
    });
    this.add(this.font, new GBC(0, 2).f(GBC.VERTICAL));
    Z4UI.addVLine(this, new GBC(1, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(this, Z4Translations.TEXT, new GBC(2, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));

    this.textText.addActionListener(event -> this.onTextInfoChange());
    this.add(this.textText, new GBC(2, 2).a(GBC.WEST).f(GBC.VERTICAL).i(0, 0, 0, 5));

    this.textEmpty.setText(Z4Translations.EMPTY);
    this.textEmpty.addActionListener(event -> this.onTextInfoChange());
    this.add(this.textEmpty, new GBC(2, 3).a(GBC.WEST));

    Z4UI.addLabel(this, Z4Translations.COLOR, new GBC(3, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));

    this.textColor.setCloseOnChange(false);
    this.textColor.setSpaceTimeLabelsVisible(false);
    this.textColor.setSelectedColor(this.getBlackBiGradientColor());
    this.add(this.textColor, new GBC(3, 2).h(2).a(GBC.NORTH).i(0, 0, 0, 5));

    Z4UI.addLabel(this, Z4Translations.BORDER, new GBC(5, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));

    this.textBorder.cssAddClass("jsspinner_w_4rem");
    this.textBorder.setModel(new SpinnerNumberModel(0, 1, 20, 1));
    this.textBorder.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.textBorder, new GBC(5, 2).a(GBC.WEST).i(0, 0, 0, 5));

    this.textBorderColor.setCloseOnChange(false);
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textBorderColor.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.textBorderColor, new GBC(5, 3).f(GBC.HORIZONTAL).i(0, 0, 0, 5));

    Z4UI.addLabel(this, Z4Translations.SHEARING, new GBC(6, 0).w(2).a(GBC.WEST).i(5, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.HORIZONTAL, new GBC(6, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    Z4UI.addLabel(this, Z4Translations.VERTICAL, new GBC(7, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";

    this.textShearX.cssAddClass("jsspinner_w_4rem");
    this.textShearX.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.textShearX.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.textShearX, new GBC(6, 2).a(GBC.WEST).i(0, 0, 0, 5));

    this.textShearY.cssAddClass("jsspinner_w_4rem");
    this.textShearY.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.textShearY.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.textShearY, new GBC(7, 2).a(GBC.WEST));

    Z4UI.addVLine(this, new GBC(11, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.shadow.setText(Z4Translations.SHADOW);
    this.shadow.addActionListener(event -> this.onTextInfoChange());
    this.add(this.shadow, new GBC(12, 0).h(2).a(GBC.WEST));

    this.shadowText.addActionListener(event -> this.onTextInfoChange());
    this.add(this.shadowText, new GBC(12, 2).f(GBC.VERTICAL).a(GBC.WEST).i(0, 0, 0, 5));

    this.shadowEmpty.setText(Z4Translations.EMPTY);
    this.shadowEmpty.addActionListener(event -> this.onTextInfoChange());
    this.add(this.shadowEmpty, new GBC(12, 3).a(GBC.WEST));

    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(13, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(14, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));

    this.shadowOffsetX.cssAddClass("jsspinner_w_4rem");
    this.shadowOffsetX.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowOffsetX.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.shadowOffsetX, new GBC(13, 2).a(GBC.WEST).i(0, 0, 0, 5));

    this.shadowOffsetY.cssAddClass("jsspinner_w_4rem");
    this.shadowOffsetY.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowOffsetY.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.shadowOffsetY, new GBC(14, 2).a(GBC.WEST).i(0, 0, 0, 5));

    Z4UI.addLabel(this, Z4Translations.SHEARING, new GBC(15, 0).w(2).a(GBC.WEST).i(5, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.HORIZONTAL, new GBC(15, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    Z4UI.addLabel(this, Z4Translations.VERTICAL, new GBC(16, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";

    this.shadowShearX.cssAddClass("jsspinner_w_4rem");
    this.shadowShearX.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowShearX.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.shadowShearX, new GBC(15, 2).a(GBC.WEST).i(0, 0, 0, 5));

    this.shadowShearY.cssAddClass("jsspinner_w_4rem");
    this.shadowShearY.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowShearY.addChangeListener(event -> this.onTextInfoChange());
    this.add(this.shadowShearY, new GBC(16, 2).a(GBC.WEST));

    Z4UI.addVLine(this, new GBC(21, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.apply.setContentAreaFilled(false);
    this.apply.setText("APPLY");
    this.apply.addActionListener(event -> {
    });
    this.add(this.apply, new GBC(22, 2).i(0, 0, 0, 5));

    this.reset.setContentAreaFilled(false);
    this.reset.setText(Z4Translations.RESET);
    this.reset.addActionListener(event -> this.onReset());
    this.add(this.reset, new GBC(23, 2));
  }

  private void onTextInfoChange() {
    this.textInfo.rotation = this.rotation.getValue();

    this.textInfo.textText = this.textText.getText();
    this.textInfo.textEmpty = this.textEmpty.isSelected();
    this.textInfo.textColor = this.textColor.getSelectedColor();
    this.textInfo.textBorder = parseInt(this.textBorder.getValue());
    this.textInfo.textBorderColor = this.textBorderColor.getSelectedColor();
    this.textInfo.textShearX = parseInt(this.textShearX.getValue());
    this.textInfo.textShearY = parseInt(this.textShearY.getValue());

    this.textInfo.shadow = this.shadow.isSelected();
    this.textInfo.shadowText = this.shadowText.getText();
    this.textInfo.shadowEmpty = this.shadowEmpty.isSelected();
    this.textInfo.shadowOffsetX = parseInt(this.shadowOffsetX.getValue());
    this.textInfo.shadowOffsetY = parseInt(this.shadowOffsetY.getValue());
    this.textInfo.shadowShearX = parseInt(this.shadowShearX.getValue());
    this.textInfo.shadowShearY = parseInt(this.shadowShearY.getValue());
  }

  private void onReset() {
    this.textInfo.font = new Z4Font("Arial", 12, false, false);
    this.rotation.setValue(new Z4Rotation(
            0,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            Z4RotationBehavior.FIXED, false));

    this.textText.setText("");
    this.textEmpty.setSelected(false);
    this.textColor.setSelectedColor(this.getBlackBiGradientColor());
    this.textBorder.setValue(0);
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textShearX.setValue(0);
    this.textShearY.setValue(0);

    this.shadow.setSelected(false);
    this.shadowText.setText("");
    this.shadowEmpty.setSelected(false);
    this.shadowOffsetX.setValue(0);
    this.shadowOffsetY.setValue(0);
    this.shadowShearX.setValue(0);
    this.shadowShearY.setValue(0);

    this.onTextInfoChange();
  }

  private Z4BiGradientColor getBlackBiGradientColor() {
    Z4GradientColor black0 = new Z4GradientColor();
    black0.addColor(new Color(0, 0, 0, 255), 0);

    Z4GradientColor black1 = new Z4GradientColor();
    black1.addColor(new Color(0, 0, 0, 255), 0);

    Z4BiGradientColor biblack = new Z4BiGradientColor();
    biblack.addColor(black0, 0);
    biblack.addColor(black1, 1);
    return biblack;
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Checks the available fonts
   */
  public void checkFonts() {
    if (this.fontsChecked) {
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
    } else {
      Z4UI.pleaseWait(this, true, false, false, false, "", () -> Z4Font.getAvailableFontFamilies(false, available -> {
        available.forEach((font, key, array) -> this.fonts.push(font));
        this.fonts.sort();

        this.fontsChecked = true;
        this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
        Z4UI.pleaseWaitCompleted();
      }));
    }
  }
}
