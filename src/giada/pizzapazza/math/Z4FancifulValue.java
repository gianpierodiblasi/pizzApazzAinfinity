package giada.pizzapazza.math;

import giada.pizzapazza.setting.Z4Setting;

/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValue {

  private Z4Sign constantSign = Z4Sign.RANDOM;
  private double constantValue = 0;
  private Z4Sign randomSign = Z4Sign.RANDOM;
  private Z4RandomValue randomValue = Z4RandomValue.classic(0);
  private Z4Sign proportionalSign = Z4Sign.RANDOM;
  private double proportionalValue = 0;
  private boolean uniformSign;

  /**
   * Sets the constant component
   *
   * @param constantSign The sign of the constant component
   * @param constantValue The value of the constant component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setConstant(Z4Sign constantSign, double constantValue) {
    this.constantSign = constantSign;
    this.constantValue = constantValue;
    return this;
  }

  /**
   * Returns the sign of the constant component
   *
   * @return The sign of the constant component
   */
  public Z4Sign getConstantSign() {
    return this.constantSign;
  }

  /**
   * Returns the value of the constant component
   *
   * @return The value of the constant component
   */
  public double getConstantValue() {
    return this.constantValue;
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
   * Returns the sign of the random component
   *
   * @return The sign of the random component
   */
  public Z4Sign getRandomSign() {
    return this.randomSign;
  }

  /**
   * Returns the value of the random component
   *
   * @return The value of the random component
   */
  public Z4RandomValue getRandomValue() {
    return this.randomValue;
  }

  /**
   * Sets the proportional component
   *
   * @param proportionalSign The sign of the proportional component
   * @param proportionalValue The value of the proportional component
   * @return This Z4FancifulValue
   */
  public Z4FancifulValue setProportional(Z4Sign proportionalSign, double proportionalValue) {
    this.proportionalSign = proportionalSign;
    this.proportionalValue = proportionalValue;
    return this;
  }

  /**
   * Returns the sign of the proportional component
   *
   * @return The sign of the proportional component
   */
  public Z4Sign getProportionalSign() {
    return this.proportionalSign;
  }

  /**
   * Returns the value of the proportional component
   *
   * @return The value of the proportional component
   */
  public double getProportionalValue() {
    return this.proportionalValue;
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
