package giada.pizzapazza.math;

import giada.pizzapazza.setting.Z4Setting;

/**
 * The common parent of all fanciful values
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public class Z4AbstractFancifulValue<T extends Z4AbstractFancifulValue<T>> {

  private Z4SignedValue constant = new Z4SignedValue();
  private Z4Sign randomSign = Z4Sign.RANDOM;
  private Z4RandomValue randomValue = Z4RandomValue.classic(0);
  private Z4SignedValue proportional = new Z4SignedValue();
  private boolean uniformSign;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   * @return This Z4AbstractFancifulValue
   */
  @SuppressWarnings("unchecked")
  public T setConstant(Z4SignedValue constant) {
    this.constant = constant;
    return (T) this;
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
   * @param randomSign The sign of the random component
   * @param randomValue The value of the random component
   * @return This Z4AbstractFancifulValue
   */
  @SuppressWarnings("unchecked")
  public T setRandom(Z4Sign randomSign, Z4RandomValue randomValue) {
    this.randomSign = randomSign;
    this.randomValue = randomValue;
    return (T) this;
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
   * @param proportional The proportional component
   * @return This Z4AbstractFancifulValue
   */
  @SuppressWarnings("unchecked")
  public T setProportional(Z4SignedValue proportional) {
    this.proportional = proportional;
    return (T) this;
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
   * @return This Z4AbstractFancifulValue
   */
  @SuppressWarnings("unchecked")
  public T setUniformSign(boolean uniformSign) {
    this.uniformSign = uniformSign;
    return (T) this;
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
