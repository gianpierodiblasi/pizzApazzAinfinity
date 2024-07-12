/**
 * The panale to manage a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorPanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   colorPreview = new JSColorPreview();

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
    this.add(this.colorPreview, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL));
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
    this.colorPreview.setColor(value);
    let rgb = new Array();
    let hsl = new Array();
    rgb[0] = value.red;
    rgb[1] = value.green;
    rgb[2] = value.blue;
    Color.RGBtoHSL(rgb, hsl);
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
   * Sets the filling of the area of the edit button
   *
   * @param b true to set the filling of the area of the edit button, false
   * otherwise
   */
   setEditButtonContentAreaFilled(b) {
    this.edit.setContentAreaFilled(b);
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
