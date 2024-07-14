/**
 * The ribbon panel containing the settings to draw text
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonTextPanel extends Z4AbstractRibbonPanel {

   fontSelection = new JSButton();

   textText = new JSTextField();

   textEmpty = new JSCheckBox();

   textBorder = new JSSpinner();

   textBorderColor = new JSColorChooser();

   textShearX = new JSSpinner();

   textShearY = new JSSpinner();

   shadow = new JSCheckBox();

   shadowText = new JSTextField();

   shadowEmpty = new JSCheckBox();

   shadowShearX = new JSSpinner();

   shadowShearY = new JSSpinner();

   apply = new JSButton();

   reset = new JSButton();

   canvas = null;

   fontsChecked = false;

   fonts = new Array();

   textInfo = new Z4TextInfo();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbontextpanel");
    this.textInfo.font = new Z4Font("Arial", 12, false, false);
    this.fontSelection.setContentAreaFilled(false);
    this.fontSelection.setText(Z4Translations.FONT_SELECTION);
    this.fontSelection.addActionListener(event => {
      let fontSelectionPanel = new Z4FontSelectionPanel(this.fonts);
      fontSelectionPanel.setValue(this.textInfo.font);
      JSOptionPane.showInputDialog(fontSelectionPanel, Z4Translations.FONT_SELECTION, listener => fontSelectionPanel.addChangeListener(listener), () => !!(fontSelectionPanel.getValue()), response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.textInfo.font = fontSelectionPanel.getValue();
          this.onTextInfoChange();
        }
      });
    });
    this.add(this.fontSelection, new GBC(0, 2).f(GBC.VERTICAL));
    Z4UI.addVLine(this, new GBC(1, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.TEXT, new GBC(2, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));
    this.textText.addActionListener(event => this.onTextInfoChange());
    this.add(this.textText, new GBC(2, 2).a(GBC.WEST).f(GBC.VERTICAL).i(0, 0, 0, 5));
    this.textEmpty.setText(Z4Translations.EMPTY);
    this.textEmpty.addActionListener(event => this.onTextInfoChange());
    this.add(this.textEmpty, new GBC(2, 3).a(GBC.WEST));
    Z4UI.addLabel(this, Z4Translations.BORDER, new GBC(3, 0).h(2).a(GBC.WEST).i(5, 5, 2, 0));
    this.textBorder.cssAddClass("jsspinner_w_4rem");
    this.textBorder.setModel(new SpinnerNumberModel(0, 1, 20, 1));
    this.textBorder.addChangeListener(event => this.onTextInfoChange());
    this.add(this.textBorder, new GBC(3, 2).a(GBC.WEST).i(0, 0, 0, 5));
    this.textBorderColor.setCloseOnChange(false);
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textBorderColor.addChangeListener(event => this.onTextInfoChange());
    this.add(this.textBorderColor, new GBC(3, 3).f(GBC.HORIZONTAL).i(0, 0, 0, 5));
    Z4UI.addLabel(this, Z4Translations.SHEARING, new GBC(4, 0).w(2).a(GBC.WEST).i(5, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.HORIZONTAL, new GBC(4, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    Z4UI.addLabel(this, Z4Translations.VERTICAL, new GBC(5, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    this.textShearX.cssAddClass("jsspinner_w_4rem");
    this.textShearX.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.textShearX.addChangeListener(event => this.onTextInfoChange());
    this.add(this.textShearX, new GBC(4, 2).a(GBC.WEST).i(0, 0, 0, 5));
    this.textShearY.cssAddClass("jsspinner_w_4rem");
    this.textShearY.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.textShearY.addChangeListener(event => this.onTextInfoChange());
    this.add(this.textShearY, new GBC(5, 2).a(GBC.WEST));
    Z4UI.addVLine(this, new GBC(11, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.shadow.setText(Z4Translations.SHADOW);
    this.shadow.addActionListener(event => this.onTextInfoChange());
    this.add(this.shadow, new GBC(12, 0).h(2).a(GBC.WEST));
    this.shadowText.addActionListener(event => this.onTextInfoChange());
    this.add(this.shadowText, new GBC(12, 2).f(GBC.VERTICAL).a(GBC.WEST).i(0, 0, 0, 5));
    this.shadowEmpty.setText(Z4Translations.EMPTY);
    this.shadowEmpty.addActionListener(event => this.onTextInfoChange());
    this.add(this.shadowEmpty, new GBC(12, 3).a(GBC.WEST));
    Z4UI.addLabel(this, Z4Translations.SHEARING, new GBC(13, 0).w(2).a(GBC.WEST).i(5, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.HORIZONTAL, new GBC(13, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    Z4UI.addLabel(this, Z4Translations.VERTICAL, new GBC(14, 1).a(GBC.WEST).i(0, 5, 0, 0)).getStyle().fontSize = "smaller";
    this.shadowShearX.cssAddClass("jsspinner_w_4rem");
    this.shadowShearX.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowShearX.addChangeListener(event => this.onTextInfoChange());
    this.add(this.shadowShearX, new GBC(13, 2).a(GBC.WEST).i(0, 0, 0, 5));
    this.shadowShearY.cssAddClass("jsspinner_w_4rem");
    this.shadowShearY.setModel(new SpinnerNumberModel(0, -200, 200, 1));
    this.shadowShearY.addChangeListener(event => this.onTextInfoChange());
    this.add(this.shadowShearY, new GBC(14, 2).a(GBC.WEST));
    Z4UI.addVLine(this, new GBC(21, 0).h(4).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.apply.setContentAreaFilled(false);
    this.apply.setText("APPLY");
    this.apply.addActionListener(event => {
    });
    this.add(this.apply, new GBC(22, 2).i(0, 0, 0, 5));
    this.reset.setContentAreaFilled(false);
    this.reset.setText(Z4Translations.RESET);
    this.reset.addActionListener(event => this.onReset());
    this.add(this.reset, new GBC(23, 2));
  }

   onTextInfoChange() {
    this.textInfo.textText = this.textText.getText();
    this.textInfo.textEmpty = this.textEmpty.isSelected();
    this.textInfo.textBorder = parseInt(this.textBorder.getValue());
    this.textInfo.textBorderColor = this.textBorderColor.getSelectedColor();
    this.textInfo.textShearX = parseInt(this.textShearX.getValue());
    this.textInfo.textShearY = parseInt(this.textShearY.getValue());
    this.textInfo.shadow = this.shadow.isSelected();
    this.textInfo.shadowText = this.shadowText.getText();
    this.textInfo.shadowEmpty = this.shadowEmpty.isSelected();
    this.textInfo.shadowShearX = parseInt(this.shadowShearX.getValue());
    this.textInfo.shadowShearY = parseInt(this.shadowShearY.getValue());
  }

   onReset() {
    this.textInfo.font = new Z4Font("Arial", 12, false, false);
    this.textText.setText("");
    this.textEmpty.setSelected(false);
    this.textBorder.setValue(0);
    this.textBorderColor.setSelectedColor(new Color(0, 0, 0, 255));
    this.textShearX.setValue(0);
    this.textShearY.setValue(0);
    this.shadow.setSelected(false);
    this.shadowText.setText("");
    this.shadowEmpty.setSelected(false);
    this.shadowShearX.setValue(0);
    this.shadowShearY.setValue(0);
    this.onTextInfoChange();
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
   * Checks the available fonts
   */
   checkFonts() {
    if (this.fontsChecked) {
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
    } else {
      Z4Font.getAvailableFontFamilies(true, available => {
        available.forEach((font, key, array) => this.fonts.push(font));
        this.fonts.sort();
        this.fontsChecked = true;
        this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.DRAW_TEXT);
      });
    }
  }
}
