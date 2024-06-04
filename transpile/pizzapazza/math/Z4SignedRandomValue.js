/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValue extends Z4Nextable {

   sign = null;

   value = null;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The random value
   */
  constructor(sign, value) {
    super();
    this.sign = sign;
    this.value = value;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Returns the random value
   *
   * @return The random value
   */
   getValue() {
    return this.value;
  }

   next() {
    return this.sign.next() * this.value.next();
  }

   toJSON() {
    let json = new Object();
    json["sign"] = this.sign.toJSON();
    json["value"] = this.value.toJSON();
    return json;
  }

  /**
   * Creates a Z4SignedRandomValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed random value
   */
  static  fromJSON(json) {
    return new Z4SignedRandomValue(Z4Sign.fromJSON(json["sign"]), Z4RandomValue.fromJSON(json["value"]));
  }
}
