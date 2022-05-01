/**
 * A value with sign
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValue {

   sign = Z4Sign.RANDOM;

   value = 0;

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
   * @return This Z4SignedValue
   */
   setSign(sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   geValue() {
    return this.value;
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4SignedValue
   */
   setValue(value) {
    this.value = value;
    return this;
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
