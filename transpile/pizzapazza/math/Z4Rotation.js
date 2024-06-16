/**
 * The rotation (angles parameters have to be provided in degrees, rotations are
 * computed in radians)
 *
 * @author gianpiero.diblasi
 */
class Z4Rotation extends Z4NextableWithParam {

   startAngle = 0.0;

   angle = null;

   behavior = null;

   delayed = false;

   rotationNext = 0.0;

  /**
   * Creates the object
   *
   * @param startAngle The initial angle of rotation (in degrees)
   * @param angle The angle (in degrees)
   * @param behavior The rotation behavior
   * @param delayed true if the returned rotation has to be delayed (rotated by
   * a PI angle), false otherwise
   */
  constructor(startAngle, angle, behavior, delayed) {
    super();
    this.startAngle = startAngle;
    this.delayed = delayed;
    this.behavior = behavior;
    this.angle = angle;
  }

  /**
   * Returns the initial angle of rotation (in degrees)
   *
   * @return The initial angle of rotation (in degrees)
   */
   getStartAngle() {
    return this.startAngle;
  }

  /**
   * Returns the angle (in degrees)
   *
   * @return The angle (in degrees)
   */
   getAngle() {
    return this.angle;
  }

  /**
   * Returns the rotation behavior
   *
   * @return The rotation behavior
   */
   getRotationBehavior() {
    return this.behavior;
  }

  /**
   * Returns if the rotation has to be delayed (rotated by a PI angle)
   *
   * @return true if the returned rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   */
   isDelayed() {
    return this.delayed;
  }

   next(tangentAngle) {
    let nextAngle = Z4Math.deg2rad(this.startAngle + this.angle.next());
    if (this.behavior === Z4RotationBehavior.FIXED) {
      return nextAngle + (this.delayed ? Math.PI : 0);
    } else if (this.behavior === Z4RotationBehavior.CUMULATIVE) {
      this.rotationNext += nextAngle;
      return this.rotationNext + (this.delayed ? Math.PI : 0);
    } else if (this.behavior === Z4RotationBehavior.RELATIVE_TO_PATH) {
      return nextAngle + tangentAngle + (this.delayed ? Math.PI : 0);
    } else {
      return 0.0;
    }
  }

  /**
   * Computes the side to assign to a point
   *
   * @param currentVector The vector of the current point
   * @param vector The tangent vector (if available)
   * @return The side to assign to a point
   */
   computeSide(currentVector, vector) {
    if (this.behavior === Z4RotationBehavior.FIXED) {
      return new Z4Sign(Z4SignBehavior.POSITIVE);
    } else if (this.behavior === Z4RotationBehavior.CUMULATIVE) {
      return new Z4Sign(Z4SignBehavior.POSITIVE);
    } else if (this.behavior === Z4RotationBehavior.RELATIVE_TO_PATH) {
      return new Z4Sign(vector ? vector.direction(currentVector) : Z4SignBehavior.RANDOM);
    } else {
      return null;
    }
  }

   toJSON() {
    let json = new Object();
    json["startAngle"] = this.startAngle;
    json["angle"] = this.angle.toJSON();
    json["behavior"] = this.behavior;
    json["delayed"] = this.delayed;
    return json;
  }

  /**
   * Creates a Z4Rotation from a JSON object
   *
   * @param json The JSON object
   * @return the rotation
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "FIXED":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.FIXED, json["delayed"]);
      case "CUMULATIVE":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.CUMULATIVE, json["delayed"]);
      case "RELATIVE_TO_PATH":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.RELATIVE_TO_PATH, json["delayed"]);
      default:
        return null;
    }
  }
}
