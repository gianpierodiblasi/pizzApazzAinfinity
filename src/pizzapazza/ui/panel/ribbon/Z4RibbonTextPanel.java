package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import def.dom.ImageData;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDownMenu;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSpinner;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
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
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.ui.component.Z4DropDown;
import pizzapazza.ui.panel.Z4FontSelectionPanel;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.math.Z4RotationPanel;
import pizzapazza.ui.panel.math.Z4RotationPanelOrientation;
import pizzapazza.util.Z4Font;
import pizzapazza.util.Z4TextInfo;
import pizzapazza.util.Z4TextInfoTextColorFilling;
import pizzapazza.util.Z4TextInfoTextColorOrientation;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Uint8Array;

/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

  private Z4FontSelectionPanel fontSelectionPanel;
  private final Z4RotationPanel rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

  private final JSTextField textText = new JSTextField();
  private final JSCheckBox textEmpty = new JSCheckBox();
  private final Z4GradientColorPanel textColor = new Z4GradientColorPanel();
  private final JSRadioButton textColorFillingUNIFORM = new JSRadioButton();
  private final JSRadioButton textColorFillingSUBGRADIENT = new JSRadioButton();
  private final JSRadioButton textColorFillingGRADIENT = new JSRadioButton();
  private final JSRadioButton textColorOrientationHORIZONTAL = new JSRadioButton();
  private final JSRadioButton textColorOrientationVERTICAL = new JSRadioButton();
  private final JSSpinner textBorder = new JSSpinner();
  private final JSColorChooser textBorderColor = new JSColorChooser();
  private final JSSpinner textShearX = new JSSpinner();
  private final JSSpinner textShearY = new JSSpinner();

  private final JSCheckBox shadow = new JSCheckBox();
  private final JSTextField shadowText = new JSTextField();
  private final JSCheckBox shadowEmpty = new JSCheckBox();
  private final JSCheckBox shadowReflex = new JSCheckBox();
  private final JSColorChooser shadowColor = new JSColorChooser();
  private final JSSpinner shadowOffsetX = new JSSpinner();
  private final JSSpinner shadowOffsetY = new JSSpinner();
  private final JSSpinner shadowShearX = new JSSpinner();
  private final JSSpinner shadowShearY = new JSSpinner();

  private final JSLabel warningMessage = new JSLabel();
  private JSButton applyOnSelectedLayer;
  private JSButton applyOnNewLayer;
  private final JSButton reset = new JSButton();

  private Z4Canvas canvas;
  private boolean fontsChecked;
  private final Z4TextInfo textInfo = new Z4TextInfo();

  /**
   * Creates the object
   */
  public Z4RibbonTextPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");

    this.addRotation(0);
    Z4UI.addVLine(this, new GBC(1, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    int x = 2;
    Z4UI.addLabel(this, Z4Translations.TEXT, new GBC(x, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.textText.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.textText, new GBC(x, 1).w(2).f(GBC.VERTICAL).i(0, 5, 0, 5));

    this.textEmpty.setText(Z4Translations.EMPTY_HIS);
    this.textEmpty.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.textEmpty, new GBC(x, 2).a(GBC.NORTHWEST).i(0, 5, 0, 0));

    this.addTextColor(x + 1);

    this.addDropDown("z4ribbontextpanel-shearing", Z4Translations.SHEARING, this.textShearX, this.textShearY, x + 2, 1, 0, GBC.CENTER, GBC.VERTICAL);

    Z4UI.addLabel(this, Z4Translations.BORDER, new GBC(x + 3, 0).a(GBC.WEST).i(5, 5, 2, 0));

    this.textBorder.cssAddClass("jsspinner_w_4rem");
    this.textBorder.setModel(new SpinnerNumberModel(0, 1, 20, 1));
    this.textBorder.addChangeListener(event -> this.onTextInfoChange(this.textBorder.getValueIsAdjusting()));
    this.add(this.textBorder, new GBC(x + 3, 1).a(GBC.WEST).i(0, 0, 0, 5));

    this.textBorderColor.setCloseOnChange(false);
    this.textBorderColor.cssAddClass("z4ribbontextpanel-editor");
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textBorderColor.addChangeListener(event -> this.onTextInfoChange(this.textBorderColor.getValueIsAdjusting()));
    this.add(this.textBorderColor, new GBC(x + 3, 2).f(GBC.HORIZONTAL).a(GBC.NORTH).i(1, 0, 0, 5));

    Z4UI.addVLine(this, new GBC(x + 4, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    x = 7;
    this.shadow.getStyle().maxHeight = ".1rem";
    this.shadow.setText(Z4Translations.SHADOW);
    this.shadow.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.shadow, new GBC(x, 0).a(GBC.WEST).i(0, 5, 0, 0));

    this.shadowReflex.getStyle().maxHeight = ".1rem";
    this.shadowReflex.setText(Z4Translations.REFLEX);
    this.shadowReflex.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.shadowReflex, new GBC(x + 1, 0).a(GBC.EAST).i(0, 0, 0, 5));

    this.shadowText.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.shadowText, new GBC(x, 1).f(GBC.VERTICAL).w(2).a(GBC.WEST).i(0, 5, 0, 5));

    this.shadowEmpty.setText(Z4Translations.EMPTY_HER);
    this.shadowEmpty.addActionListener(event -> this.onTextInfoChange(false));
    this.add(this.shadowEmpty, new GBC(x, 2).a(GBC.NORTHWEST).i(0, 5, 0, 0));

    this.shadowColor.setCloseOnChange(false);
    this.shadowColor.cssAddClass("z4ribbontextpanel-editor");
    this.shadowColor.setSelectedColor(new Color(0, 0, 0, 128));
    this.shadowColor.addChangeListener(event -> this.onTextInfoChange(this.shadowColor.getValueIsAdjusting()));
    this.add(this.shadowColor, new GBC(x + 1, 2).a(GBC.NORTHEAST).i(1, 0, 0, 5));

    this.addDropDown("z4ribbontextpanel-shearing", Z4Translations.SHEARING, this.shadowShearX, this.shadowShearY, x + 2, 1, 0, GBC.CENTER, GBC.BOTH);
    this.addDropDown("z4ribbontextpanel-offset", Z4Translations.OFFSET, this.shadowOffsetX, this.shadowOffsetY, x + 2, 2, 1, GBC.NORTH, GBC.HORIZONTAL);
    Z4UI.addVLine(this, new GBC(x + 3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    x = 11;
    this.warningMessage.setText(Z4Translations.TEXT_WARNING_MESSAGE);
    this.warningMessage.getStyle().fontSize = "smaller";
    this.add(this.warningMessage, new GBC(x, 0).w(2).a(GBC.WEST).wx(1).i(0, 5, 0, 0));

    this.addApply(x);

    this.reset.setContentAreaFilled(false);
    this.reset.setText(Z4Translations.RESET);
    this.reset.addActionListener(event -> this.onReset());
    this.add(this.reset, new GBC(x, 2).a(GBC.NORTH).f(GBC.HORIZONTAL).i(1, 5, 0, 0));
  }

  private void addFont(int x) {
    Z4DropDown dropDown = new Z4DropDown(".z4ribbontextpanel-font");
    dropDown.cssAddClass("z4ribbontextpanel-editor");

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.FONT_SELECTION);
    dropDown.appendChildInTree("summary", label);

    this.fontSelectionPanel.setAutoSelectFirstFontOnFiltering(true);
    this.fontSelectionPanel.setValue(new Z4Font("Arial", 24, false, false));
    this.fontSelectionPanel.cssAddClass("z4ribbontextpanel-font");
    this.fontSelectionPanel.addChangeListener(event -> this.onTextInfoChange(this.fontSelectionPanel.getValueIsAdjusting()));
    dropDown.appendChild(this.fontSelectionPanel);

    this.add(dropDown, new GBC(x, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 5));
  }

  private void addRotation(int x) {
    Z4DropDown dropDown = new Z4DropDown(".z4rotationpanel");
    dropDown.cssAddClass("z4ribbontextpanel-editor");

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.ROTATION);
    dropDown.appendChildInTree("summary", label);

    this.rotation.addChangeListener(event -> this.onTextInfoChange(this.rotation.getValueIsAdjusting()));
    dropDown.appendChild(this.rotation);

    this.add(dropDown, new GBC(x, 2).f(GBC.HORIZONTAL).a(GBC.NORTH).i(1, 5, 0, 5));
  }

  private void addTextColor(int x) {
    Z4DropDown dropDown = new Z4DropDown(".z4ribbontextpanel-text-color");
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    dropDown.cssAddClass("z4ribbontextpanel-text-color-dropdown");
    int width = 45;
    int height = 12;
    JSComponent colorPreview = new JSComponent(document.createElement("canvas"));
    colorPreview.setProperty("width", "" + width);
    colorPreview.setProperty("height", "" + height);
    dropDown.appendChildInTree("summary", colorPreview);

    $CanvasRenderingContext2D ctx = colorPreview.invoke("getContext('2d')");

    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4ribbontextpanel-text-color");
    panel.setLayout(new GridBagLayout());
    dropDown.appendChild(panel);

    this.textColor.setRippleVisible(false);
    this.textColor.setValue(this.getBlackBiGradientColor());
    this.textColor.addChangeListener(event -> {
      this.putImageData(ctx, width, height);
      this.onTextInfoChange(this.textColor.getValueIsAdjusting());
    });
    panel.add(this.textColor, new GBC(0, 0).h(4).i(0, 0, 0, 5));

    Z4UI.addLabel(panel, Z4Translations.FILLING, new GBC(1, 0).a(GBC.WEST).i(0, 0, 0, 5));
    ButtonGroup group = new ButtonGroup();
    this.textColorFillingUNIFORM.setSelected(true);
    this.textColorFillingUNIFORM.setText(Z4Translations.UNIFORM);
    this.textColorFillingUNIFORM.addActionListener(event -> this.onTextInfoChange(false));
    panel.add(this.textColorFillingUNIFORM, new GBC(1, 1).a(GBC.WEST).i(0, 0, 0, 5));
    group.add(this.textColorFillingUNIFORM);
    this.textColorFillingSUBGRADIENT.setText(Z4Translations.PARTIAL);
    this.textColorFillingSUBGRADIENT.addActionListener(event -> this.onTextInfoChange(false));
    panel.add(this.textColorFillingSUBGRADIENT, new GBC(1, 2).a(GBC.WEST).i(0, 0, 0, 5));
    group.add(this.textColorFillingSUBGRADIENT);
    this.textColorFillingGRADIENT.setText(Z4Translations.TOTAL);
    this.textColorFillingGRADIENT.addActionListener(event -> this.onTextInfoChange(false));
    panel.add(this.textColorFillingGRADIENT, new GBC(1, 3).a(GBC.NORTHWEST).wy(1).i(0, 0, 0, 5));
    group.add(this.textColorFillingGRADIENT);

    Z4UI.addLabel(panel, Z4Translations.ORIENTATION, new GBC(2, 0).a(GBC.WEST));
    group = new ButtonGroup();
    this.textColorOrientationHORIZONTAL.setSelected(true);
    this.textColorOrientationHORIZONTAL.setText(Z4Translations.HORIZONTAL);
    this.textColorOrientationHORIZONTAL.addActionListener(event -> this.onTextInfoChange(false));
    panel.add(this.textColorOrientationHORIZONTAL, new GBC(2, 1).a(GBC.WEST));
    group.add(this.textColorOrientationHORIZONTAL);
    this.textColorOrientationVERTICAL.setText(Z4Translations.VERTICAL);
    this.textColorOrientationVERTICAL.addActionListener(event -> this.onTextInfoChange(false));
    panel.add(this.textColorOrientationVERTICAL, new GBC(2, 2).a(GBC.WEST));
    group.add(this.textColorOrientationVERTICAL);

    this.add(dropDown, new GBC(x, 2).a(GBC.NORTHEAST).i(1, 0, 0, 5));

    this.putImageData(ctx, width, height);
  }

  private void putImageData($CanvasRenderingContext2D ctx, int width, int height) {
    ImageData imageData = ctx.createImageData(width, height);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int x = 0; x < width; x++) {
      Color color = this.textColor.getValue().getColorAt(x / width, false);
      for (int y = 0; y < height; y++) {
        int idx = (y * width + x) * 4;
        data.$set(idx, color.red);
        data.$set(idx + 1, color.green);
        data.$set(idx + 2, color.blue);
        data.$set(idx + 3, color.alpha);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private void addDropDown(String dropDownContentSelector, String title, JSSpinner xSpin, JSSpinner ySpin, int x, int y, int top, int anchor, int fill) {
    Z4DropDown dropDown = new Z4DropDown("." + dropDownContentSelector);
    dropDown.cssAddClass("z4ribbontextpanel-editor");

    JSLabel label = new JSLabel();
    label.setText(title);
    dropDown.appendChildInTree("summary", label);

    JSPanel panel = new JSPanel();
    panel.cssAddClass(dropDownContentSelector);
    panel.setLayout(new GridBagLayout());

    Z4UI.addLabel(panel, Z4Translations.HORIZONTAL, new GBC(0, 0).a(GBC.WEST));
    Z4UI.addLabel(panel, Z4Translations.VERTICAL, new GBC(1, 0).a(GBC.WEST));

    xSpin.cssAddClass("jsspinner_w_4rem");
    xSpin.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    xSpin.addChangeListener(event -> this.onTextInfoChange(xSpin.getValueIsAdjusting()));
    panel.add(xSpin, new GBC(0, 1).a(GBC.WEST).i(0, 0, 0, 5));

    ySpin.cssAddClass("jsspinner_w_4rem");
    ySpin.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    ySpin.addChangeListener(event -> this.onTextInfoChange(ySpin.getValueIsAdjusting()));
    panel.add(ySpin, new GBC(1, 1).a(GBC.WEST));

    dropDown.appendChild(panel);

    this.add(dropDown, new GBC(x, y).a(anchor).f(fill).i(top, 0, 0, 5));
  }

  private void addApply(int x) {
    JSDropDownMenu dropDown = new JSDropDownMenu();
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    dropDown.setLabel(Z4Translations.APPLY_ON);
    this.applyOnSelectedLayer = dropDown.addMenu(Z4Translations.SELECTED_LAYER, event -> this.canvas.drawText(false));
    this.applyOnSelectedLayer.setEnabled(false);
    this.applyOnNewLayer = dropDown.addMenu(Z4Translations.NEW_LAYER, event -> this.canvas.drawText(true));
    this.applyOnNewLayer.setEnabled(false);
    this.add(dropDown, new GBC(x, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 0));
  }

  private void onTextInfoChange(boolean adjusting) {
    document.querySelectorAll(".z4ribbontextpanel .z4ribbontextpanel-editor").forEach(element -> {
      if (adjusting) {
        element.setAttribute("transparent", "true");
      } else {
        element.removeAttribute("transparent");
      }
    });

    this.textInfo.font = this.fontSelectionPanel.getValue();
    this.textInfo.rotation = this.rotation.getValue();

    this.textInfo.textText = this.textText.getText();
    this.fontSelectionPanel.setSampleVisible(!$exists(this.textInfo.textText));
    this.applyOnSelectedLayer.setEnabled($exists(this.textInfo.textText));
    this.applyOnNewLayer.setEnabled($exists(this.textInfo.textText));
    this.textInfo.textEmpty = this.textEmpty.isSelected();
    this.textInfo.textColor = this.textColor.getValue();
    if (this.textColorFillingUNIFORM.isSelected()) {
      this.textInfo.textColorFilling = Z4TextInfoTextColorFilling.UNIFORM;
    } else if (this.textColorFillingSUBGRADIENT.isSelected()) {
      this.textInfo.textColorFilling = Z4TextInfoTextColorFilling.SUBGRADIENT;
    } else if (this.textColorFillingGRADIENT.isSelected()) {
      this.textInfo.textColorFilling = Z4TextInfoTextColorFilling.GRADIENT;
    }
    if (this.textColorOrientationHORIZONTAL.isSelected()) {
      this.textInfo.textColorOrientation = Z4TextInfoTextColorOrientation.HORIZONTAL;
    } else if (this.textColorOrientationVERTICAL.isSelected()) {
      this.textInfo.textColorOrientation = Z4TextInfoTextColorOrientation.VERTICAL;
    }
    this.textInfo.textBorder = parseInt(this.textBorder.getValue());
    this.textInfo.textBorderColor = this.textBorderColor.getSelectedColor();
    this.textInfo.textShearX = parseInt(this.textShearX.getValue());
    this.textInfo.textShearY = parseInt(this.textShearY.getValue());

    this.textInfo.shadow = this.shadow.isSelected();
    this.textInfo.shadowText = this.shadowText.getText();
    this.textInfo.shadowEmpty = this.shadowEmpty.isSelected();
    this.textInfo.shadowReflex = this.shadowReflex.isSelected();
    this.textInfo.shadowColor = this.shadowColor.getSelectedColor();
    this.textInfo.shadowOffsetX = parseInt(this.shadowOffsetX.getValue());
    this.textInfo.shadowOffsetY = parseInt(this.shadowOffsetY.getValue());
    this.textInfo.shadowShearX = parseInt(this.shadowShearX.getValue());
    this.textInfo.shadowShearY = parseInt(this.shadowShearY.getValue());

    this.canvas.setTextInfo(this.textInfo);
  }

  private void onReset() {
    JSOptionPane.showConfirmDialog(Z4Translations.RESET_MESSAGE, Z4Translations.RESET, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.fontSelectionPanel.setValue(new Z4Font("Arial", 24, false, false));
        this.rotation.setValue(new Z4Rotation(
                0,
                new Z4FancifulValue(
                        new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0),
                        new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                        false),
                Z4RotationBehavior.FIXED, false));

        this.textText.setText("");
        this.textEmpty.setSelected(false);
        this.textColor.setValue(this.getBlackBiGradientColor());
        this.textColorFillingUNIFORM.setSelected(true);
        this.textColorOrientationHORIZONTAL.setSelected(true);
        this.textBorder.setValue(0);
        this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
        this.textShearX.setValue(0);
        this.textShearY.setValue(0);

        this.shadow.setSelected(false);
        this.shadowText.setText("");
        this.shadowEmpty.setSelected(false);
        this.shadowReflex.setSelected(false);
        this.shadowColor.setSelectedColor(new Color(0, 0, 0, 128));
        this.shadowOffsetX.setValue(0);
        this.shadowOffsetY.setValue(0);
        this.shadowShearX.setValue(0);
        this.shadowShearY.setValue(0);

        this.onTextInfoChange(false);
      }
    });
  }

  private Z4GradientColor getBlackBiGradientColor() {
    Z4GradientColor black = new Z4GradientColor();
    black.addColor(new Color(0, 0, 0, 255), 0);
    return black;
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
   * Sets the geometric shape
   *
   * @param shape The geometric shape
   */
  public void setGeometricShape(Z4GeometricShape shape) {
    this.textInfo.shape = shape;

    if ($exists(shape)) {
      this.warningMessage.getStyle().display = "none";
    } else {
      this.warningMessage.getStyle().removeProperty("display");
    }

    this.canvas.setTextInfo(this.textInfo);
  }

  /**
   * Checks the available fonts
   */
  public void checkFonts() {
    if (this.fontsChecked) {
      this.onTextInfoChange(false);
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
    } else {
      Z4UI.pleaseWait(this, true, false, false, false, "", () -> Z4Font.getAvailableFontFamilies(false, available -> {
        Array<String> fonts = new Array<>();
        available.forEach((f, key, array) -> fonts.push(f));
        fonts.sort();
        this.fontSelectionPanel = new Z4FontSelectionPanel(fonts);
        this.addFont(0);

        this.fontsChecked = true;
        this.onTextInfoChange(false);
        this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
        Z4UI.pleaseWaitCompleted();
      }));
    }
  }
}
