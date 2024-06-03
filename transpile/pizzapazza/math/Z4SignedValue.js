/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValue extends Z4Nextable {

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

   next() {
    return this.sign.next() * this.value;
  }
}
