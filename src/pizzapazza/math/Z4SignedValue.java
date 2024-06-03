package pizzapazza.math;

/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValue {

  private Z4Sign sign = Z4Sign.RANDOM;
  private double value;

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
   */
  public void setSign(Z4Sign sign) {
    this.sign = sign;
  }

  /**
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
  public double getValue() {
    return this.value;
  }

  /**
   * Sets the value
   *
   * @param value The (positive) value
   */
  public void setValue(double value) {
    this.value = value;
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
