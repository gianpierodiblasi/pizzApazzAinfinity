/**
 * The whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4Whirlpool extends Z4JSONable {

   behavior = null;

   angle = null;

  /**
   * Creates the object
   *
   * @param behavior The behavior
   * @param angle The angle
   */
  constructor(behavior, angle) {
    this.behavior = behavior;
    this.angle = angle;
  }

  /**
   * Returns the behavior
   *
   * @return The behavior
   */
   getBehavior() {
    return this.behavior;
  }

  /**
   * Returns the angle
   *
   * @return The angle
   */
   getAngle() {
    return this.angle;
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    json["angle"] = this.angle.toJSON();
    return json;
  }

  /**
   * Creates a Z4Whirlpool from a JSON object
   *
   * @param json The JSON object
   * @return the whirlpool
   */
  static  fromJSON(json) {
    return new Z4Whirlpool(json["behavior"], Z4FancifulValue.fromJSON(json["angle"]));
  }
}
