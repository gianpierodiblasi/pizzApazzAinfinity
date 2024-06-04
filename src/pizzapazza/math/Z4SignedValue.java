package pizzapazza.math;

/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValue implements Z4Nextable<Double> {

  private final Z4Sign sign;
  private final double value;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The value
   */
  public Z4SignedValue(Z4Sign sign, double value) {
    super();
    this.sign = sign;
    this.value = value;
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
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
  public double getValue() {
    return this.value;
  }

  @Override
  public Double next() {
    return this.sign.next() * this.value;
  }
}
