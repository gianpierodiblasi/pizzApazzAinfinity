/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
class Z4FontSelectionPanel extends Z4AbstractValuePanel {

   filter = new JSTextField();

   radios = new Array();

   size = new JSSpinner();

   sample = new JSLabel();

   bold = new JSCheckBox();

   italic = new JSCheckBox();

   fonts = null;

   sampleString = null;

   valueIsAdjusting = false;

   autoSelectFirstFontOnFiltering = false;

  /**
   * Creates the object
   *
   * @param fonts The available fonts
   */
  constructor(fonts) {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fontselectionpanel");
    this.fonts = fonts;
    Z4UI.addLabel(this, Z4Translations.FILTER, new GBC(0, 0).a(GBC.WEST));
    this.filter.addActionListener(event => this.onFiltering());
    this.add(this.filter, new GBC(0, 1).a(GBC.WEST).wx(1));
    Z4UI.addLabel(this, Z4Translations.DIMENSION, new GBC(1, 0).a(GBC.WEST));
    this.size.cssAddClass("jsspinner_w_4rem");
    this.size.setModel(new SpinnerNumberModel(12, 7, 400, 1));
    this.size.addChangeListener(event => this.onFontChange(this.size.getValueIsAdjusting()));
    this.add(this.size, new GBC(1, 1).a(GBC.WEST).i(0, 0, 0, 5));
    this.bold.setText(Z4Translations.BOLD);
    this.bold.addActionListener(event => this.onFontChange(false));
    this.add(this.bold, new GBC(2, 1).i(0, 0, 0, 5));
    this.italic.setText(Z4Translations.ITALIC);
    this.italic.addActionListener(event => this.onFontChange(false));
    this.add(this.italic, new GBC(3, 1));
    let panel = new JSPanel();
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    panel.cssAddClass("z4fontselectionpanel-fontlist");
    this.add(panel, new GBC(0, 2).w(4));
    let buttonGroup = new ButtonGroup();
    fonts.forEach(font => this.addFont(font, buttonGroup, panel));
    this.sample.cssAddClass("z4fontselectionpanel-sample");
    this.add(this.sample, new GBC(0, 3).w(4).i(5, 0, 0, 0));
  }

   addFont(font, buttonGroup, panel) {
    let radio = new JSRadioButton();
    radio.setText(font);
    radio.getStyle().fontFamily = font;
    radio.setTooltip(font);
    radio.addActionListener(event => this.onFontChange(false));
    this.radios.push(radio);
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

   onFiltering() {
    let str = this.filter.getText().toLowerCase();
    this.radios.forEach((radio, index, array) => {
      let b = this.fonts[index].toLowerCase().indexOf(str) !== -1;
      radio.getStyle().display = b ? "flex" : "none";
      if (!b) {
        radio.setSelected(false);
      }
    });
    let selected = this.radios.find((radio, index, array) => radio.isSelected());
    let found = this.radios.find((radio, index, array) => radio.getStyle().display === "flex");
    if (!this.autoSelectFirstFontOnFiltering) {
      if (selected) {
        setTimeout(() => selected.invoke("scrollIntoView()"), 0);
      }
    } else if (selected) {
      setTimeout(() => selected.invoke("scrollIntoView()"), 0);
    } else if (found) {
      found.setSelected(true);
      setTimeout(() => found.invoke("scrollIntoView()"), 0);
    } else {
      let index = this.fonts.findIndex(font => font === "Arial");
      this.radios[index].setSelected(true);
      this.radios[index].getStyle().display = "flex";
      setTimeout(() => this.radios[index].invoke("scrollIntoView()"), 0);
    }
    this.onFontChange(false);
  }

   onFontChange(b) {
    this.valueIsAdjusting = b;
    let index = this.radios.findIndex(radio => radio.isSelected());
    if (index !== -1) {
      this.value = new Z4Font(this.fonts[index], parseInt(this.size.getValue()), this.bold.isSelected(), this.italic.isSelected());
      this.setSample();
    } else {
      this.value = null;
      this.sample.setText("");
    }
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    this.filter.setText("");
    this.radios.forEach((radio, index, array) => {
      radio.setSelected(false);
      radio.getStyle().display = "flex";
    });
    let index = this.fonts.findIndex(font => font === value.family);
    if (index !== -1) {
      this.radios[index].setSelected(true);
      setTimeout(() => this.radios[index].invoke("scrollIntoView()"), 0);
    }
    this.size.setValue(value.size);
    this.bold.setSelected(value.bold);
    this.italic.setSelected(value.italic);
    this.setSample();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets if the first font in the list has to be auto-selected on filtering; if
   * no font is found then the "Arial" font is automatically selected
   *
   * @param autoSelectFirstFontOnFiltering true to auto-select the first font in
   * the list on filtering, false otherwise
   */
   setAutoSelectFirstFontOnFiltering(autoSelectFirstFontOnFiltering) {
    this.autoSelectFirstFontOnFiltering = autoSelectFirstFontOnFiltering;
  }

  /**
   * Sets the visibility of the sample string
   *
   * @param b true to show the sample string, false otherwise
   */
   setSampleVisible(b) {
    this.sample.getStyle().display = b ? "flex" : "none";
  }

  /**
   * Sets the sample string to use to preview the font
   *
   * @param str The sample string, if empty or null the default sample string is
   * used
   */
   setSampleString(str) {
    this.sampleString = str;
    if (this.value) {
      this.setSample();
    }
  }

   setSample() {
    this.sample.setText(this.sampleString ? this.sampleString : Z4Translations.STRING_EXAMPLE);
    this.sample.getStyle().fontFamily = this.value.family;
    this.sample.getStyle().fontSize = this.value.size + "px";
    this.sample.getStyle().fontStyle = this.value.italic ? "italic" : "normal";
    this.sample.getStyle().fontWeight = this.value.bold ? "bold" : "normal";
  }
}
