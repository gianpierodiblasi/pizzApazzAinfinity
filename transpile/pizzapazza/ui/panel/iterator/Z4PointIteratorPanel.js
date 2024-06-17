/**
 * The abstract panel to edit a Z4PointIterator
 *
 * @author gianpiero.diblasi
 * @param <T> The point iterator type
 */
class Z4PointIteratorPanel extends Z4AbstractValuePanel {

  /**
   * The rotation panel
   */
   rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4pointiteratorpanel");
    this.setLayout(new GridBagLayout());
    this.rotation.addChangeListener(event => this.onIteratorChange());
  }

  /**
   * The method to call on iterator changes
   */
   onIteratorChange() {
  }

   setValue(value) {
    this.rotation.setValue(value.getRotation());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.rotation.setEnabled(b);
  }
}
