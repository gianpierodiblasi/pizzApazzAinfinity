package pizzapazza.math;

/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedRandomValue implements Z4Nextable<Double> {

  private final Z4Sign sign;
  private final Z4RandomValue value;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The random value
   */
  public Z4SignedRandomValue(Z4Sign sign, Z4RandomValue value) {
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
   * Returns the random value
   *
   * @return The random value
   */
  public Z4RandomValue getValue() {
    return this.value;
  }

  @Override
  public Double next() {
    return this.sign.next() * this.value.next();
  }
}
