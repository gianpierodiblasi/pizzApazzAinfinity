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
   * true if value is adjusting, false otherwise
   */
   valueIsAdjusting = false;

  /**
   * true if the panel is enabled, false otherwise
   */
   enabled = true;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4pointiteratorpanel");
    this.setLayout(new GridBagLayout());
    this.rotation.setLabel(Z4Translations.ROTATION);
    this.rotation.cssAddClass("z4abstractvaluepanel-titled");
    this.rotation.addChangeListener(event => this.onIteratorChange(this.rotation.getValueIsAdjusting()));
  }

  /**
   * The method to call on iterator changes
   *
   * @param valueIsAdjusting true if value is adjusting, false otherwise
   */
   onIteratorChange(valueIsAdjusting) {
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.rotation.setValue(value.getRotation());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
    this.rotation.setEnabled(b);
  }
}
