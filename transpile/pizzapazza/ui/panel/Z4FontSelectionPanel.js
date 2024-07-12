/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
class Z4FontSelectionPanel extends Z4AbstractValuePanel {

   filter = new JSTextField();

   radios = new Array();

   size = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);

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
    this.add(this.filter, new GBC(0, 1).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    let panel = new JSPanel();
    panel.cssAddClass("z4fontselectionpanel-fontlist");
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(0, 2));
    let buttonGroup = new ButtonGroup();
    fonts.forEach(font => this.addFont(font, buttonGroup, panel));
    this.size.setSignVisible(false);
    this.size.setRange(7, 400);
    this.size.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 12));
    this.size.addChangeListener(event => this.onFontChange());
    this.add(this.size, new GBC(1, 0).h(2));
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
    let index = this.radios.findIndex(radio => radio.isSelected() && radio.getStyle().display === "flex");
    if (index !== -1) {
      this.value = new Z4Font(this.fonts[index], this.size.getValue().getValue(), this.bold.isSelected(), this.italic.isSelected());
    } else {
      this.value = null;
    }
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    let index = this.fonts.findIndex(font => font === value.family);
    if (index !== -1) {
      this.radios[index].setSelected(true);
    } else {
      this.radios.forEach(radio => radio.setSelected(false));
    }
  }
}
