/**
 * The signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValue extends Z4AbstractRandomValue {

   sign = Z4Sign.RANDOM;

  constructor(value, type, length) {
    super(value, type, length);
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Sets the sign
   *
   * @param sign The sign
   * @return This Z4SignedRandomValue
   */
   setSign(sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the next signed random value
   *
   * @return The next random value (in the range [0,value[)
   */
   nextSigned() {
    return this.sign.next() * this.next();
  }

  /**
   * Returns a Z4SignedRandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4SignedRandomValue
   */
  static  classic(value) {
    return new Z4SignedRandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4SignedRandomValue
   */
  static  bezier(value, length) {
    return new Z4SignedRandomValue(value, 1, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4SignedRandomValue
   */
  static  polyline(value, length) {
    return new Z4SignedRandomValue(value, 2, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4SignedRandomValue
   */
  static  stepped(value, length) {
    return new Z4SignedRandomValue(value, 3, length);
  }
}
