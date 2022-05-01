package giada.pizzapazza.math;

/**
 * A value with sign
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedValue {

  private Z4Sign sign = Z4Sign.RANDOM;
  private double value = 0;

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
   * @return This Z4SignedValue
   */
  public Z4SignedValue setSign(Z4Sign sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public double geValue() {
    return this.value;
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4SignedValue
   */
  public Z4SignedValue setValue(double value) {
    this.value = value;
    return this;
  }

  /**
   * Returns the next signed value
   *
   * @return The next signed value
   */
  public double next() {
    return this.sign.next() * this.value;
  }
}