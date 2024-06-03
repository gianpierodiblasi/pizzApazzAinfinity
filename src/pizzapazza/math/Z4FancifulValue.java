package pizzapazza.math;

/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
public class Z4FancifulValue implements Z4Nextable<Double> {

  private final Z4SignedValue constant;
  private final Z4SignedRandomValue random;
  private final boolean uniformSign;

  /**
   * Creates the object
   *
   * @param constant The constant component
   * @param random The random component
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise; if true then the constant sign is used
   */
  public Z4FancifulValue(Z4SignedValue constant, Z4SignedRandomValue random, boolean uniformSign) {
    this.constant = constant;
    this.random = random;
    this.uniformSign = uniformSign;
  }

  /**
   * Returns the the constant component
   *
   * @return The the constant component
   */
  public Z4SignedValue getConstant() {
    return this.constant;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
  public Z4SignedRandomValue getRandom() {
    return this.random;
  }

  /**
   * Checks if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for both components,
   * false otherwise
   */
  public boolean isUniformSign() {
    return this.uniformSign;
  }

  @Override
  public Double next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.getValue().next());
    } else {
      return this.constant.next() + this.random.next();
    }
  }
}
