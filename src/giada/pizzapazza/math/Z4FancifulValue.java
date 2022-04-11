package giada.pizzapazza.math;

import giada.pizzapazza.setting.Z4Setting;

/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValue {

  private Z4Sign constantSign = Z4Sign.RANDOM;
  private int constantValue = 0;
  private Z4Sign randomSign = Z4Sign.RANDOM;
  private Z4RandomValue randomValue = Z4RandomValue.classic(0);
  private Z4Sign proportionalSign = Z4Sign.RANDOM;
  private int proportionalValue = 0;
  private boolean uniformSign;

  /**
   * Sets the constant component
   *
   * @param constantSign The sign of the constant component
   * @param constantValue The value of the constant component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setConstant(Z4Sign constantSign, int constantValue) {
    this.constantSign = constantSign;
    this.constantValue = constantValue;
    return this;
  }

  /**
   * Sets the random component
   *
   * @param randomSign The sign of the random component
   * @param randomValue The value of the random component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setRandom(Z4Sign randomSign, Z4RandomValue randomValue) {
    this.randomSign = randomSign;
    this.randomValue = randomValue;
    return this;
  }

  /**
   * Sets the proportional component
   *
   * @param proportionalSign The sign of the proportional component
   * @param proportionalValue The value of the proportional component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setProportional(Z4Sign proportionalSign, int proportionalValue) {
    this.proportionalSign = proportionalSign;
    this.proportionalValue = proportionalValue;
    return this;
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
   * Returns the next "fanciful" value
   *
   * @param sensibility The sensibility value to apply to the proportional
   * component
   * @return The next "fanciful" value
   */
  public double next(double sensibility) {
    if (Z4Setting.isLiteMode()) {
      return this.constantSign.next() * this.constantValue;
    } else if (Z4Setting.isStandardMode()) {
      if (this.uniformSign) {
        return this.constantSign.next() * (this.constantValue + this.randomValue.next());
      } else {
        return this.constantSign.next() * this.constantValue + this.randomSign.next() * this.randomValue.next();
      }
    } else if (Z4Setting.isProMode()) {
      if (this.uniformSign) {
        return this.constantSign.next() * (this.constantValue + this.randomValue.next() + sensibility * this.proportionalValue);
      } else {
        return this.constantSign.next() * this.constantValue + this.randomSign.next() * this.randomValue.next() + this.proportionalSign.next() * sensibility * this.proportionalValue;
      }
    } else {
      return 0;
    }
  }
}
