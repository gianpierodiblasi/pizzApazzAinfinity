package giada.pizzapazza.math;

/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4RandomValue extends Z4AbstractRandomValue<Z4RandomValue> {

  private Z4RandomValue(double value, int type, double length) {
    super(value, type, length);
  }

  /**
   * Returns a Z4RandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4RandomValue
   */
  public static Z4RandomValue classic(double value) {
    return new Z4RandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue bezier(double value, double length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue polyline(double value, double length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue stepped(double value, double length) {
    return new Z4RandomValue(value, 3, length);
  }
}
