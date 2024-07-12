/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
class Z4FontSelectionPanel extends Z4AbstractValuePanel {

   bold = new JSCheckBox();

   italic = new JSCheckBox();

   sample = new JSLabel();

   radios = new Array();

  /**
   * Creates the object
   *
   * @param fonts The available fonts
   */
  constructor(fonts) {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fontselectionpanel");
  }

   setValue(value) {
    this.value = value;
  }
}
