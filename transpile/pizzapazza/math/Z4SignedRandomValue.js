/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValue extends Z4Nextable {

   sign = null;

   value = null;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The random value
   */
  constructor(sign, value) {
    super();
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
   * Returns the random value
   *
   * @return The random value
   */
   getValue() {
    return this.value;
  }

   next() {
    return this.sign.next() * this.value.next();
  }
}
