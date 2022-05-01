/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
class Z4RandomValue extends Z4AbstractRandomValue {

  constructor(value, type, length) {
    super(value, type, length);
  }

  /**
   * Returns a Z4RandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4RandomValue
   */
  static  classic(value) {
    return new Z4RandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  static  bezier(value, length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  static  polyline(value, length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  static  stepped(value, length) {
    return new Z4RandomValue(value, 3, length);
  }
}
