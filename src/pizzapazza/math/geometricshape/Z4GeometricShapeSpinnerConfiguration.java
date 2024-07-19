package pizzapazza.math.geometricshape;

/**
 * The configuration of a spinner used by a geometrishape
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeSpinnerConfiguration {

  public final String grouping;
  public final String label;
  public final int value;
  public final int minimum;
  public final int maximum;

  /**
   * Creates the object
   *
   * @param grouping The grouping label, to group more spinners
   * @param label The spinner label
   * @param value The value
   * @param minimum The minimum value
   * @param maximum The maximum value
   */
  public Z4GeometricShapeSpinnerConfiguration(String grouping, String label, int value, int minimum, int maximum) {
    this.grouping = grouping;
    this.label = label;
    this.value = value;
    this.minimum = minimum;
    this.maximum = maximum;
  }
}
