/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
class Z4FontSelectionPanel extends Z4AbstractValuePanel {

   filter = new JSTextField();

   radios = new Array();

   bold = new JSCheckBox();

   italic = new JSCheckBox();

   sample = new JSLabel();

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
      let str = this.filter.getText();
      this.radios.forEach((radio, index, array) => {
        radio.setSelected(false);
        radio.getStyle().display = this.fonts[index].contains(str) ? "flex" : "none";
        this.value = null;
        this.onchange();
      });
    });
    this.add(this.filter, new GBC(0, 1).f(GBC.HORIZONTAL));
    let panel = new JSPanel();
    panel.cssAddClass("z4fontselectionpanel-fontlist");
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(0, 2));
    let buttonGroup = new ButtonGroup();
    fonts.forEach(font => this.addFont(font, buttonGroup, panel));
  }

   addFont(font, buttonGroup, panel) {
    let radio = new JSRadioButton();
    radio.setText(font);
    radio.addActionListener(event => {
      // this.value = new Z4Font(font, 0, true, true);
      this.onchange();
    });
    buttonGroup.add(radio);
    panel.add(radio, null);
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
