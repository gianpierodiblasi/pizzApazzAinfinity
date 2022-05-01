/**
 * The common parent of all fanciful values
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractFancifulValue {

   constantSign = Z4Sign.RANDOM;

   constantValue = 0;

   randomSign = Z4Sign.RANDOM;

   randomValue = Z4RandomValue.classic(0);

   proportionalSign = Z4Sign.RANDOM;

   proportionalValue = 0;

   uniformSign = false;

  /**
   * Sets the constant component
   *
   * @param constantSign The sign of the constant component
   * @param constantValue The value of the constant component
   * @return This Z4FancifulValue
   */
   setConstant(constantSign, constantValue) {
    this.constantSign = constantSign;
    this.constantValue = constantValue;
    return this;
  }

  /**
   * Returns the sign of the constant component
   *
   * @return The sign of the constant component
   */
   getConstantSign() {
    return this.constantSign;
  }

  /**
   * Returns the value of the constant component
   *
   * @return The value of the constant component
   */
   getConstantValue() {
    return this.constantValue;
  }

  /**
   * Sets the random component
   *
   * @param randomSign The sign of the random component
   * @param randomValue The value of the random component
   * @return This Z4FancifulValue
   */
   setRandom(randomSign, randomValue) {
    this.randomSign = randomSign;
    this.randomValue = randomValue;
    return this;
  }

  /**
   * Returns the sign of the random component
   *
   * @return The sign of the random component
   */
   getRandomSign() {
    return this.randomSign;
  }

  /**
   * Returns the value of the random component
   *
   * @return The value of the random component
   */
   getRandomValue() {
    return this.randomValue;
  }

  /**
   * Sets the proportional component
   *
   * @param proportionalSign The sign of the proportional component
   * @param proportionalValue The value of the proportional component
   * @return This Z4FancifulValue
   */
   setProportional(proportionalSign, proportionalValue) {
    this.proportionalSign = proportionalSign;
    this.proportionalValue = proportionalValue;
    return this;
  }

  /**
   * Returns the sign of the proportional component
   *
   * @return The sign of the proportional component
   */
   getProportionalSign() {
    return this.proportionalSign;
  }

  /**
   * Returns the value of the proportional component
   *
   * @return The value of the proportional component
   */
   getProportionalValue() {
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