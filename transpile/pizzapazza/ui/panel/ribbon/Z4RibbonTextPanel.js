/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

   fontSelectionPanel = null;

   rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

   textText = new JSTextField();

   textEmpty = new JSCheckBox();

   textColor = new Z4GradientColorPanel();

   textColorPreview = new JSComponent(document.createElement("canvas"));

   ctxTextColorPreview = this.textColorPreview.invoke("getContext('2d')");

   textColorFillingUNIFORM = new JSRadioButton();

   textColorFillingSUBGRADIENT = new JSRadioButton();

   textColorFillingGRADIENT = new JSRadioButton();

   textColorOrientationHORIZONTAL = new JSRadioButton();

   textColorOrientationVERTICAL = new JSRadioButton();

   textBorder = new JSSpinner();

   textBorderColor = new JSColorChooser();

   textShearX = new JSSpinner();

   textShearY = new JSSpinner();

   shadow = new JSCheckBox();

   shadowText = new JSTextField();

   shadowEmpty = new JSCheckBox();

   shadowReflex = new JSCheckBox();

   shadowColor = new JSColorChooser();

   shadowOffsetX = new JSSpinner();

   shadowOffsetY = new JSSpinner();

   shadowShearX = new JSSpinner();

   shadowShearY = new JSSpinner();

   warningMessage = new JSLabel();

   applyOnSelectedLayer = null;

   applyOnNewLayer = null;

   canvas = null;

   fontsChecked = false;

   selectedControlPoint = 0;

   textInfo = new Z4TextInfo();

   isProd = false;

  static  TEXT_COLOR_PREVIEW_WIDTH = 45;

  static  TEXT_COLOR_PREVIEW_HEIGHT = 12;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");
    this.addRotation(0);
    Z4UI.addVLine(this, new GBC(1, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    let x = 2;
    Z4UI.addLabel(this, Z4Translations.TEXT, new GBC(x, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.textText.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.textText, new GBC(x, 1).w(2).f(GBC.VERTICAL).i(0, 5, 0, 5));
    this.textEmpty.setText(Z4Translations.EMPTY_HIS);
    this.textEmpty.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.textEmpty, new GBC(x, 2).a(GBC.NORTHWEST).i(0, 5, 0, 0));
    this.addTextColor(x + 1);
    this.addDropDown("z4ribbontextpanel-shearing", Z4Translations.SHEARING, this.textShearX, this.textShearY, x + 2, 1, 0, GBC.CENTER, GBC.VERTICAL);
    Z4UI.addLabel(this, Z4Translations.BORDER, new GBC(x + 3, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.textBorder.cssAddClass("jsspinner_w_4rem");
    this.textBorder.setModel(new SpinnerNumberModel(0, 1, 20, 1));
    this.textBorder.addChangeListener(event => this.onTextInfoChange(this.textBorder.getValueIsAdjusting()));
    this.add(this.textBorder, new GBC(x + 3, 1).a(GBC.WEST).i(0, 0, 0, 5));
    this.textBorderColor.setCloseOnChange(false);
    this.textBorderColor.cssAddClass("z4ribbontextpanel-editor");
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textBorderColor.addChangeListener(event => this.onTextInfoChange(this.textBorderColor.getValueIsAdjusting()));
    this.add(this.textBorderColor, new GBC(x + 3, 2).f(GBC.HORIZONTAL).a(GBC.NORTH).i(1, 0, 0, 5));
    Z4UI.addVLine(this, new GBC(x + 4, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    x = 7;
    this.shadow.getStyle().maxHeight = ".1rem";
    this.shadow.setText(Z4Translations.SHADOW);
    this.shadow.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.shadow, new GBC(x, 0).a(GBC.WEST).i(0, 5, 0, 0));
    this.shadowReflex.getStyle().maxHeight = ".1rem";
    this.shadowReflex.setText(Z4Translations.REFLEX);
    this.shadowReflex.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.shadowReflex, new GBC(x + 1, 0).a(GBC.EAST).i(0, 0, 0, 5));
    this.shadowText.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.shadowText, new GBC(x, 1).f(GBC.VERTICAL).w(2).a(GBC.WEST).i(0, 5, 0, 5));
    this.shadowEmpty.setText(Z4Translations.EMPTY_HER);
    this.shadowEmpty.addActionListener(event => this.onTextInfoChange(false));
    this.add(this.shadowEmpty, new GBC(x, 2).a(GBC.NORTHWEST).i(0, 5, 0, 0));
    this.shadowColor.setCloseOnChange(false);
    this.shadowColor.cssAddClass("z4ribbontextpanel-editor");
    this.shadowColor.setSelectedColor(new Color(0, 0, 0, 128));
    this.shadowColor.addChangeListener(event => this.onTextInfoChange(this.shadowColor.getValueIsAdjusting()));
    this.add(this.shadowColor, new GBC(x + 1, 2).a(GBC.NORTHEAST).i(1, 0, 0, 5));
    this.addDropDown("z4ribbontextpanel-shearing", Z4Translations.SHEARING, this.shadowShearX, this.shadowShearY, x + 2, 1, 0, GBC.CENTER, GBC.BOTH);
    this.addDropDown("z4ribbontextpanel-offset", Z4Translations.OFFSET, this.shadowOffsetX, this.shadowOffsetY, x + 2, 2, 1, GBC.NORTH, GBC.HORIZONTAL);
    Z4UI.addVLine(this, new GBC(x + 3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    x = 11;
    this.warningMessage.setText(Z4Translations.TEXT_WARNING_MESSAGE);
    this.warningMessage.getStyle().fontSize = "smaller";
    this.add(this.warningMessage, new GBC(x, 0).w(2).a(GBC.WEST).wx(1).i(0, 5, 0, 0));
    this.addApply(x);
    let reset = new JSButton();
    reset.setContentAreaFilled(false);
    reset.setText(Z4Translations.RESET);
    reset.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.RESET_MESSAGE, Z4Translations.RESET, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onReset();
      }
    }));
    this.add(reset, new GBC(x, 2).a(GBC.NORTH).f(GBC.HORIZONTAL).i(1, 5, 0, 0));
  }

   addFont(x) {
    let dropDown = new Z4DropDown(".z4ribbontextpanel-font");
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    let label = new JSLabel();
    label.setText(Z4Translations.FONT_SELECTION);
    dropDown.appendChildInTree("summary", label);
    this.fontSelectionPanel.setAutoSelectFirstFontOnFiltering(true);
    this.fontSelectionPanel.setValue(new Z4Font("Arial", 24, false, false));
    this.fontSelectionPanel.cssAddClass("z4ribbontextpanel-font");
    this.fontSelectionPanel.addChangeListener(event => this.onTextInfoChange(this.fontSelectionPanel.getValueIsAdjusting()));
    dropDown.appendChild(this.fontSelectionPanel);
    this.add(dropDown, new GBC(x, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 5));
  }

   addRotation(x) {
    let dropDown = new Z4DropDown(".z4rotationpanel");
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    let label = new JSLabel();
    label.setText(Z4Translations.ROTATION);
    dropDown.appendChildInTree("summary", label);
    this.rotation.addChangeListener(event => this.onTextInfoChange(this.rotation.getValueIsAdjusting()));
    dropDown.appendChild(this.rotation);
    this.add(dropDown, new GBC(x, 2).f(GBC.HORIZONTAL).a(GBC.NORTH).i(1, 5, 0, 5));
  }

   addTextColor(x) {
    let dropDown = new Z4DropDown(".z4ribbontextpanel-text-color");
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    dropDown.cssAddClass("z4ribbontextpanel-text-color-dropdown");
    this.textColorPreview.setProperty("width", "" + Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_WIDTH);
    this.textColorPreview.setProperty("height", "" + Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_HEIGHT);
    dropDown.appendChildInTree("summary", this.textColorPreview);
    let panel = new JSPanel();
    panel.cssAddClass("z4ribbontextpanel-text-color");
    panel.setLayout(new GridBagLayout());
    dropDown.appendChild(panel);
    this.textColor.setRippleVisible(false);
    this.textColor.setValue(this.getBlackBiGradientColor());
    this.textColor.addChangeListener(event => {
      this.putImageData();
      this.onTextInfoChange(this.textColor.getValueIsAdjusting());
    });
    panel.add(this.textColor, new GBC(0, 0).h(4).i(0, 0, 0, 5));
    Z4UI.addLabel(panel, Z4Translations.FILLING, new GBC(1, 0).a(GBC.WEST).i(0, 0, 0, 5));
    let group = new ButtonGroup();
    this.textColorFillingUNIFORM.setSelected(true);
    this.textColorFillingUNIFORM.setText(Z4Translations.UNIFORM);
    this.textColorFillingUNIFORM.addActionListener(event => this.onTextInfoChange(false));
    panel.add(this.textColorFillingUNIFORM, new GBC(1, 1).a(GBC.WEST).i(0, 0, 0, 5));
    group.add(this.textColorFillingUNIFORM);
    this.textColorFillingSUBGRADIENT.setText(Z4Translations.PARTIAL);
    this.textColorFillingSUBGRADIENT.addActionListener(event => this.onTextInfoChange(false));
    panel.add(this.textColorFillingSUBGRADIENT, new GBC(1, 2).a(GBC.WEST).i(0, 0, 0, 5));
    group.add(this.textColorFillingSUBGRADIENT);
    this.textColorFillingGRADIENT.setText(Z4Translations.TOTAL);
    this.textColorFillingGRADIENT.addActionListener(event => this.onTextInfoChange(false));
    panel.add(this.textColorFillingGRADIENT, new GBC(1, 3).a(GBC.NORTHWEST).wy(1).i(0, 0, 0, 5));
    group.add(this.textColorFillingGRADIENT);
    Z4UI.addLabel(panel, Z4Translations.ORIENTATION, new GBC(2, 0).a(GBC.WEST));
    group = new ButtonGroup();
    this.textColorOrientationHORIZONTAL.setSelected(true);
    this.textColorOrientationHORIZONTAL.setText(Z4Translations.HORIZONTAL);
    this.textColorOrientationHORIZONTAL.addActionListener(event => this.onTextInfoChange(false));
    panel.add(this.textColorOrientationHORIZONTAL, new GBC(2, 1).a(GBC.WEST));
    group.add(this.textColorOrientationHORIZONTAL);
    this.textColorOrientationVERTICAL.setText(Z4Translations.VERTICAL);
    this.textColorOrientationVERTICAL.addActionListener(event => this.onTextInfoChange(false));
    panel.add(this.textColorOrientationVERTICAL, new GBC(2, 2).a(GBC.WEST));
    group.add(this.textColorOrientationVERTICAL);
    this.add(dropDown, new GBC(x, 2).a(GBC.NORTHEAST).i(1, 0, 0, 5));
    this.putImageData();
  }

   putImageData() {
    let imageData = this.ctxTextColorPreview.createImageData(Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_WIDTH, Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_HEIGHT);
    let data = imageData.data;
    for (let x = 0; x < Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_WIDTH; x++) {
      let color = this.textColor.getValue().getColorAt(x / Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_WIDTH, false);
      for (let y = 0; y < Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_HEIGHT; y++) {
        let idx = (y * Z4RibbonTextPanel.TEXT_COLOR_PREVIEW_WIDTH + x) * 4;
        data[idx] = color.red;
        data[idx + 1] = color.green;
        data[idx + 2] = color.blue;
        data[idx + 3] = color.alpha;
      }
    }
    this.ctxTextColorPreview.putImageData(imageData, 0, 0);
  }

   addDropDown(dropDownContentSelector, title, xSpin, ySpin, x, y, top, anchor, fill) {
    let dropDown = new Z4DropDown("." + dropDownContentSelector);
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    let label = new JSLabel();
    label.setText(title);
    dropDown.appendChildInTree("summary", label);
    let panel = new JSPanel();
    panel.cssAddClass(dropDownContentSelector);
    panel.setLayout(new GridBagLayout());
    Z4UI.addLabel(panel, Z4Translations.HORIZONTAL, new GBC(0, 0).a(GBC.WEST));
    Z4UI.addLabel(panel, Z4Translations.VERTICAL, new GBC(1, 0).a(GBC.WEST));
    xSpin.cssAddClass("jsspinner_w_4rem");
    xSpin.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    xSpin.addChangeListener(event => this.onTextInfoChange(xSpin.getValueIsAdjusting()));
    panel.add(xSpin, new GBC(0, 1).a(GBC.WEST).i(0, 0, 0, 5));
    ySpin.cssAddClass("jsspinner_w_4rem");
    ySpin.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    ySpin.addChangeListener(event => this.onTextInfoChange(ySpin.getValueIsAdjusting()));
    panel.add(ySpin, new GBC(1, 1).a(GBC.WEST));
    dropDown.appendChild(panel);
    this.add(dropDown, new GBC(x, y).a(anchor).f(fill).i(top, 0, 0, 5));
  }

   addApply(x) {
    let dropDown = new JSDropDownMenu();
    dropDown.cssAddClass("z4ribbontextpanel-editor");
    dropDown.setLabel(Z4Translations.APPLY_ON);
    this.applyOnSelectedLayer = dropDown.addMenu(Z4Translations.SELECTED_LAYER, event => this.canvas.drawText(false));
    this.applyOnSelectedLayer.setEnabled(false);
    this.applyOnSelectedLayer.setContentAreaFilled(false);
    this.applyOnNewLayer = dropDown.addMenu(Z4Translations.NEW_LAYER, event => this.canvas.drawText(true));
    this.applyOnNewLayer.setEnabled(false);
    this.applyOnNewLayer.setContentAreaFilled(false);
    this.add(dropDown, new GBC(x, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 0));
  }

   onTextInfoChange(adjusting) {
    document.querySelectorAll(".z4ribbontextpanel .z4ribbontextpanel-editor").forEach(element => {
      if (adjusting) {
        element.setAttribute("transparent", "true");
      } else {
        element.removeAttribute("transparent");
      }
    });
    this.textInfo.font = this.fontSelectionPanel ? this.fontSelectionPanel.getValue() : null;
    this.textInfo.rotation = this.rotation.getValue();
    this.textInfo.textText = this.textText.getText();
    if (this.fontSelectionPanel) {
      this.fontSelectionPanel.setSampleVisible(!this.textInfo.textText);
    }
    this.applyOnSelectedLayer.setEnabled(this.textInfo.textText && this.textInfo.shape);
    this.applyOnNewLayer.setEnabled(this.textInfo.textText && this.textInfo.shape);
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
    this.canvas.setTextInfo(this.textInfo, this.selectedControlPoint);
  }

   onReset() {
    if (this.fontSelectionPanel) {
      this.fontSelectionPanel.setValue(new Z4Font("Arial", 24, false, false));
    }
    this.rotation.setValue(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false));
    this.textText.setText("");
    this.textEmpty.setSelected(false);
    this.textColor.setValue(this.getBlackBiGradientColor());
    this.putImageData();
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

   getBlackBiGradientColor() {
    let black = new Z4GradientColor();
    black.addColor(new Color(0, 0, 0, 255), 0);
    return black;
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the geometric shape
   *
   * @param shape The geometric shape
   * @param selectedControlPoint The selected control point
   */
   setGeometricShape(shape, selectedControlPoint) {
    this.textInfo.shape = shape;
    if (shape) {
      this.warningMessage.getStyle().display = "none";
    } else {
      this.warningMessage.getStyle().removeProperty("display");
    }
    this.applyOnSelectedLayer.setEnabled(this.textInfo.textText && this.textInfo.shape);
    this.applyOnNewLayer.setEnabled(this.textInfo.textText && this.textInfo.shape);
    this.selectedControlPoint = selectedControlPoint;
    this.canvas.setTextInfo(this.textInfo, selectedControlPoint);
  }

  /**
   * Resets the ribbon text panel
   */
   reset() {
    this.setGeometricShape(null, this.selectedControlPoint);
    this.onReset();
  }

  /**
   * Checks the available fonts
   */
   checkFonts() {
    if (this.fontsChecked) {
      this.onTextInfoChange(false);
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
    } else {
      let regExp = new RegExp("pizzApazzA-bundle-.*js");
      document.querySelectorAll("script").forEach(script => {
        let src = script.getAttribute("src");
        if (regExp.test(src) && src.indexOf("-min-") !== -1) {
          this.isProd = true;
        }
      });
      Z4UI.pleaseWait(this, true, false, false, false, "", () => Z4Font.getAvailableFontFamilies(this.isProd, available => {
        let fonts = new Array();
        available.forEach((f, key, array) => fonts.push(f));
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
