/**
 * The configuration of a spinner used by a geometrishape
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeSpinnerConfiguration {

   grouping = null;

   label = null;

   value = 0;

   minimum = 0;

   maximum = 0;

  /**
   * Creates the object
   *
   * @param grouping The grouping label, to group more spinners
   * @param label The spinner label
   * @param value The value
   * @param minimum The minimum value
   * @param maximum The maximum value
   */
  constructor(grouping, label, value, minimum, maximum) {
    this.grouping = grouping;
    this.label = label;
    this.value = value;
    this.minimum = minimum;
    this.maximum = maximum;
  }
}
