/**
 * The common parent of all fanciful values
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractFancifulValue {

   constant = new Z4SignedValue();

   random = Z4SignedRandomValue.classic(0);

   proportional = new Z4SignedValue();

   uniformSign = false;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   * @return This Z4AbstractFancifulValue
   */
   setConstant(constant) {
    this.constant = constant;
    return this;
  }

  /**
   * Returns the the constant component
   *
   * @return The the constant component
   */
   getConstant() {
    return this.constant;
  }

  /**
   * Sets the random component
   *
   * @param random The random component
   * @return This Z4AbstractFancifulValue
   */
   setRandom(random) {
    this.random = random;
    return this;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
   getRandom() {
    return this.random;
  }

  /**
   * Sets the proportional component
   *
   * @param proportional The proportional component
   * @return This Z4AbstractFancifulValue
   */
   setProportional(proportional) {
    this.proportional = proportional;
    return this;
  }

  /**
   * Returns the proportional component
   *
   * @return The proportional component
   */
   getProportional() {
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
   setUniformSign(uniformSign) {
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
   isUniformSign() {
    return this.uniformSign;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @param sensibility The sensibility value to apply to the proportional
   * component
   * @return The next "fanciful" value
   */
   next(sensibility) {
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
