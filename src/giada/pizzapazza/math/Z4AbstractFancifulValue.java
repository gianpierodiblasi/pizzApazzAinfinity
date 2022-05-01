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
  private Z4SignedRandomValue random = Z4SignedRandomValue.classic(0);
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
   * @param random The random component
   * @return This Z4AbstractFancifulValue
   */
  @SuppressWarnings("unchecked")
  public T setRandom(Z4SignedRandomValue random) {
    this.random = random;
    return (T) this;
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
      return this.constant.next();
    } else if (Z4Setting.isStandardMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.geValue() + this.random.next());
      } else {
        return this.constant.next() + this.random.nextSigned();
      }
    } else if (Z4Setting.isProMode()) {
      if (this.uniformSign) {
        return this.constant.getSign().next() * (this.constant.geValue() + this.random.next() + sensibility * this.proportional.geValue());
      } else {
        return this.constant.next() + this.random.nextSigned() + sensibility * this.proportional.next();
      }
    } else {
      return 0;
    }
  }
}
