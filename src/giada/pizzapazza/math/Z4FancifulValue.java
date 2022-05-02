package giada.pizzapazza.math;

/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValue {

  private Z4SignedValue constant = new Z4SignedValue();
  private Z4SignedRandomValue random = Z4SignedRandomValue.classic(0);
  private Z4SignedValue proportional = new Z4SignedValue();
  private boolean uniformSign;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setConstant(Z4SignedValue constant) {
    this.constant = constant;
    return this;
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
   * Sets the random component
   *
   * @param random The random component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setRandom(Z4SignedRandomValue random) {
    this.random = random;
    return this;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
  public Z4SignedRandomValue getRandom() {
    return this.random;
  }
}
