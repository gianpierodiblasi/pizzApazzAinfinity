/**
 * The signs of a value
 *
 * @author gianpiero.diblasi
 */
class Z4Sign extends Z4Nextable {

   behavior = null;

   sign = 0;

  /**
   * Creates the object
   *
   * @param behavior The sign behavior
   */
  constructor(behavior) {
    super();
    this.behavior = behavior;
    if (behavior === Z4SignBehavior.POSITIVE) {
      this.sign = 1;
    } else if (behavior === Z4SignBehavior.NEGATIVE) {
      this.sign = -1;
    } else if (behavior === Z4SignBehavior.RANDOM) {
      this.sign = 0;
    } else if (behavior === Z4SignBehavior.ALTERNATE) {
      this.sign = -2;
    }
  }

  /**
   * Returns the sign behavior
   *
   * @return The sign behavior
   */
   getSignBehavior() {
    return this.behavior;
  }

   next() {
    switch(this.sign) {
      case 1:
      case -1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case -2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    return json;
  }

  /**
   * Creates a Z4Sign from a JSON object
   *
   * @param json The JSON object
   * @return the sign
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "POSITIVE":
        return new Z4Sign(Z4SignBehavior.POSITIVE);
      case "NEGATIVE":
        return new Z4Sign(Z4SignBehavior.NEGATIVE);
      case "RANDOM":
        return new Z4Sign(Z4SignBehavior.RANDOM);
      case "ALTERNATE":
        return new Z4Sign(Z4SignBehavior.ALTERNATE);
      default:
        return null;
    }
  }
}
