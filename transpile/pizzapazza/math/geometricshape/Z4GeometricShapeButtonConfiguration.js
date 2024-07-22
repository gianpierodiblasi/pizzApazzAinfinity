/**
 * The configuration of a button used by a geometrishape
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeButtonConfiguration {

   label = null;

   onClick = null;

  /**
   * Creates the object
   *
   * @param label The spinner label
   * @param onClick The action to do on click
   */
  constructor(label, onClick) {
    this.label = label;
    this.onClick = onClick;
  }
}
