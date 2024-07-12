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
    this.filter.addActionListener(event => {
      let str = this.filter.getText().toLowerCase();
      this.radios.forEach((radio, index, array) => {
        radio.setSelected(false);
        radio.getStyle().display = this.fonts[index].toLowerCase().indexOf(str) !== -1 ? "flex" : "none";
      });
      this.onFontChange();
    });
    this.add(this.filter, new GBC(0, 1).a(GBC.WEST).wx(1));
    Z4UI.addLabel(this, Z4Translations.DIMENSION, new GBC(1, 0).a(GBC.WEST));
    this.size.cssAddClass("jsspinner_w_4rem");
    this.size.setModel(new SpinnerNumberModel(12, 7, 400, 1));
    this.size.addChangeListener(event => this.onFontChange());
    this.add(this.size, new GBC(1, 1).a(GBC.WEST).i(0, 0, 0, 5));
    this.bold.setText(Z4Translations.BOLD);
    this.bold.addActionListener(event => this.onFontChange());
    this.add(this.bold, new GBC(2, 1).i(0, 0, 0, 5));
    this.italic.setText(Z4Translations.ITALIC);
    this.italic.addActionListener(event => this.onFontChange());
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
    radio.addActionListener(event => this.onFontChange());
    this.radios.push(radio);
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

   onFontChange() {
    let index = this.radios.findIndex(radio => radio.isSelected() && radio.getStyle().display !== "none");
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
    let index = this.fonts.findIndex(font => font === value.family);
    if (index !== -1) {
      this.radios[index].setSelected(true);
      setTimeout(() => this.radios[index].invoke("scrollIntoView()"), 0);
    } else {
      this.radios.forEach(radio => radio.setSelected(false));
    }
    this.size.setValue(value.size);
    this.bold.setSelected(value.bold);
    this.italic.setSelected(value.italic);
    this.setSample();
  }

   setSample() {
    this.sample.setText(Z4Translations.STRING_EXAMPLE);
    this.sample.getStyle().fontFamily = this.value.family;
    this.sample.getStyle().fontSize = this.value.size + "px";
    this.sample.getStyle().fontStyle = this.value.italic ? "italic" : "normal";
    this.sample.getStyle().fontWeight = this.value.bold ? "bold" : "normal";
  }
}
