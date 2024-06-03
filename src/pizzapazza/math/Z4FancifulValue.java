package pizzapazza.math;

/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
public class Z4FancifulValue {

  private Z4SignedValue constant = new Z4SignedValue();
  private Z4SignedRandomValue random = Z4SignedRandomValue.classic(0);
  private boolean uniformSign;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   */
  public void setConstant(Z4SignedValue constant) {
    this.constant = constant;
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
   */
  public void setRandom(Z4SignedRandomValue random) {
    this.random = random;
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
   * Sets if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise
   */
  public void setUniformSign(boolean uniformSign) {
    this.uniformSign = uniformSign;
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

  /**
   * Returns the next "fanciful" value
   *
   * @return The next "fanciful" value
   */
  public double next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
    } else {
      return this.constant.next() + this.random.nextSigned();
    }
  }
}
