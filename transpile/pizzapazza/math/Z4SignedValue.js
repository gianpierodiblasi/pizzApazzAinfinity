/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValue {

   sign = null;

   value = 0.0;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The value
   */
  constructor(sign, value) {
    this.sign = sign;
    this.value = value;
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
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

  /**
   * Returns the next signed value
   *
   * @return The next signed value
   */
   next() {
    return this.sign.next() * this.value;
  }
}
