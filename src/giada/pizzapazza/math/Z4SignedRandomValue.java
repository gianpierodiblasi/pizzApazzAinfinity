package giada.pizzapazza.math;

/**
 * The signed random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedRandomValue extends Z4AbstractRandomValue<Z4SignedRandomValue> {

  private Z4Sign sign = Z4Sign.RANDOM;

  private Z4SignedRandomValue(double value, int type, double length) {
    super(value, type, length);
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
  public Z4Sign getSign() {
    return this.sign;
  }

  /**
   * Sets the sign
   *
   * @param sign The sign
   * @return This Z4SignedRandomValue
   */
  public Z4SignedRandomValue setSign(Z4Sign sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the next signed random value
   *
   * @return The next random value (in the range [0,value[)
   */
  public double nextSigned() {
    return this.sign.next() * this.next();
  }

  /**
   * Returns a Z4SignedRandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue classic(double value) {
    return new Z4SignedRandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue bezier(double value, double length) {
    return new Z4SignedRandomValue(value, 1, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue polyline(double value, double length) {
    return new Z4SignedRandomValue(value, 2, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue stepped(double value, double length) {
    return new Z4SignedRandomValue(value, 3, length);
  }
}
