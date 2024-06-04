/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValue extends Z4Nextable {

   sign = null;

   value = 0.0;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The value
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
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

   next() {
    return this.sign.next() * this.value;
  }

   toJSON() {
    let json = new Object();
    json["sign"] = this.sign.toJSON();
    json["value"] = this.value;
    return json;
  }

  /**
   * Creates a Z4SignedValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed value
   */
  static  fromJSON(json) {
    return new Z4SignedValue(Z4Sign.fromJSON(json["sign"]), json["value"]);
  }
}
