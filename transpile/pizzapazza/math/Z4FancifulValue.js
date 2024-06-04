/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
class Z4FancifulValue extends Z4Nextable {

   constant = null;

   random = null;

   uniformSign = false;

  /**
   * Creates the object
   *
   * @param constant The constant component
   * @param random The random component
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise; if true then the constant sign is used
   */
  constructor(constant, random, uniformSign) {
    super();
    this.constant = constant;
    this.random = random;
    this.uniformSign = uniformSign;
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
   * Returns the random component
   *
   * @return The random component
   */
   getRandom() {
    return this.random;
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

   next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.getValue().next());
    } else {
      return this.constant.next() + this.random.next();
    }
  }

   toJSON() {
    let json = new Object();
    json["constant"] = this.constant.toJSON();
    json["random"] = this.random.toJSON();
    json["uniform"] = this.uniformSign;
    return json;
  }

  /**
   * Creates a Z4FancifulValue from a JSON object
   *
   * @param json The JSON object
   * @return the fanciful value
   */
  static  fromJSON(json) {
    return new Z4FancifulValue(Z4SignedValue.fromJSON(json["constant"]), Z4SignedRandomValue.fromJSON(json["random"]), json["uniform"]);
  }
}
