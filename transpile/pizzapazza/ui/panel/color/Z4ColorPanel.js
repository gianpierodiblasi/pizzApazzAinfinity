/**
 * The panale to manage a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorPanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   container = new JSComponent(document.createElement("div"));

   component = new JSComponent(document.createElement("div"));

   componentOpacity = new JSComponent(document.createElement("div"));

   edit = new JSButton();

   opacityVisible = true;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4colorpanel");
    this.setLayout(new GridBagLayout());
    this.add(this.label, new GBC(0, 0).w(2).a(GBC.WEST));
    this.container.cssAddClass("z4colorpanel-container");
    this.add(this.container, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL));
    this.component.cssAddClass("z4colorpanel-opaque");
    this.container.appendChild(this.component);
    this.componentOpacity.cssAddClass("z4colorpanel-transparent");
    this.container.appendChild(this.componentOpacity);
    this.edit.setText(Z4Translations.EDIT);
    this.edit.addActionListener(event => {
      JSColorChooser.showDialog(Z4Translations.COLOR, this.value, this.opacityVisible, null, c => {
        this.setValue(c);
        this.onchange();
      });
    });
    this.add(this.edit, new GBC(1, 1).i(0, 5, 0, 0));
    this.setValue(new Color(0, 0, 0, 255));
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

   setValue(value) {
    this.value = value;
    this.component.getStyle().backgroundColor = value.getRGB_String();
    this.componentOpacity.getStyle().backgroundColor = value.getRGBA_String();
    let rgb = new Array();
    let hsl = new Array();
    rgb[0] = value.red;
    rgb[1] = value.green;
    rgb[2] = value.blue;
    Color.RGBtoHSL(rgb, hsl);
    this.container.getStyle().border = "1px solid " + (hsl[2] > 0.5 ? value.darkened(0.1).getRGB_HEX() : value.lighted(0.1).getRGB_HEX());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.edit.setEnabled(b);
  }

  /**
   * Sets the visibility of the edit button
   *
   * @param b true to show the edit button, false otherwise
   */
   setEditButtonVisible(b) {
    this.edit.getStyle().display = b ? "flex" : "none";
  }

  /**
   * Sets the visibility of the opacity selector
   *
   * @param b true to show the opacity selector, false otherwise
   */
   setOpacityVisible(b) {
    this.opacityVisible = b;
  }
}
