package giada.pizzapazza.math;

import giada.pizzapazza.setting.Z4Setting;

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

  /**
   * Sets the proportional component
   *
   * @param proportional The proportional component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setProportional(Z4SignedValue proportional) {
    this.proportional = proportional;
    return this;
  }

  /**
   * Returns the proportional component
   *
   * @return The proportional component
   */
  public Z4SignedValue getProportional() {
    return this.proportional;
  }

  /**
   * Sets if the computed sign has to be equals for all components; if true then
   * the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for all
   * components, false otherwise
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setUniformSign(boolean uniformSign) {
    this.uniformSign = uniformSign;
    return this;
  }

  /**
   * Checks if the computed sign has to be equals for all components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for all components,
   * false otherwise
   */
  public boolean isUniformSign() {
    return this.uniformSign;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @param sensibility The sensibility value to apply to the proportional
   * component
   * @return The next "fanciful" value
   */
  public double next(double sensibility) {
    if (Z4Setting.isLiteMode()) {
      return this.constant.next();
    } else if (Z4Setting.isStandardMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
      } else {
        return this.constant.next() + this.random.nextSigned();
      }
    } else if (Z4Setting.isProMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned() + sensibility * this.proportional.getValue());
      } else {
        return this.constant.next() + this.random.nextSigned() + sensibility * this.proportional.next();
      }
    } else {
      return 0;
    }
  }
}
