/**
 * The panel to select a font
 *
 * @author gianpiero.diblasi
 */
class Z4FontSelectionPanel extends JSPanel {

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
}
