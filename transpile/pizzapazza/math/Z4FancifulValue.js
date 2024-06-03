/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
class Z4FancifulValue {

   constant = new Z4SignedValue();

   random = Z4SignedRandomValue.classic(0);

   uniformSign = false;

  /**
   * Sets the constant component
   *
   * @param constant The constant component
   */
   setConstant(constant) {
    this.constant = constant;
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
   */
   setRandom(random) {
    this.random = random;
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
   * Sets if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise
   */
   setUniformSign(uniformSign) {
    this.uniformSign = uniformSign;
  }

  /**
   * Checks if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for both components,
   * false otherwise
   */
   isUniformSign() {
    return this.uniformSign;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @return The next "fanciful" value
   */
   next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
    } else {
      return this.constant.next() + this.random.nextSigned();
    }
  }
}
