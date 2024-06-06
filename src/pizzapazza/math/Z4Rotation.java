package pizzapazza.math;

import simulation.js.$Object;

/**
 * The rotation (angles parameters have to be provided in degrees, rotations are
 * computed in radians)
 *
 * @author gianpiero.diblasi
 */
public class Z4Rotation implements Z4NextableWithParam<Double, Double> {

  private final double startAngle;
  private final Z4FancifulValue angle;
  private final Z4RotationBehavior behavior;
  private final boolean delayed;

  private double rotationNext;

  /**
   * Creates the object
   *
   * @param startAngle The initial angle of rotation (in degrees)
   * @param angle The angle (in degrees)
   * @param behavior The rotation behavior
   * @param delayed true if the returned rotation has to be delayed (rotated by
   * a PI angle), false otherwise
   */
  public Z4Rotation(double startAngle, Z4FancifulValue angle, Z4RotationBehavior behavior, boolean delayed) {
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
  public double getStartAngle() {
    return this.startAngle;
  }

  /**
   * Returns the angle (in degrees)
   *
   * @return The angle (in degrees)
   */
  public Z4FancifulValue getAngle() {
    return this.angle;
  }

  /**
   * Returns the rotation behavior
   *
   * @return The rotation behavior
   */
  public Z4RotationBehavior getRotationBehavior() {
    return this.behavior;
  }

  /**
   * Returns if the rotation has to be delayed (rotated by a PI angle)
   *
   * @return true if the returned rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   */
  public boolean isDelayed() {
    return this.delayed;
  }

  @Override
  public Double next(Double tangentAngle) {
    double nextAngle = Z4Math.deg2rad(this.startAngle + this.angle.next());

    if (this.behavior == Z4RotationBehavior.FIXED) {
      return nextAngle + (this.delayed ? Math.PI : 0);
    } else if (this.behavior == Z4RotationBehavior.CUMULATIVE) {
      this.rotationNext += nextAngle;
      return this.rotationNext + (this.delayed ? Math.PI : 0);
    } else if (this.behavior == Z4RotationBehavior.RELATIVE_TO_PATH) {
      return nextAngle + tangentAngle + (this.delayed ? Math.PI : 0);
    } else {
      return 0.0;
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("startAngle", this.startAngle);
    json.$set("angle", this.angle.toJSON());
    json.$set("behavior", this.behavior);
    json.$set("delayed", this.delayed);
    return json;
  }

  /**
   * Creates a Z4Rotation from a JSON object
   *
   * @param json The JSON object
   * @return the rotation
   */
  public static Z4Rotation fromJSON($Object json) {
    switch ("" + json.$get("behavior")) {
      case "FIXED":
        return new Z4Rotation(json.$get("startAngle"), Z4FancifulValue.fromJSON(json.$get("angle")), Z4RotationBehavior.FIXED, json.$get("delayed"));
      case "CUMULATIVE":
        return new Z4Rotation(json.$get("startAngle"), Z4FancifulValue.fromJSON(json.$get("angle")), Z4RotationBehavior.CUMULATIVE, json.$get("delayed"));
      case "RELATIVE_TO_PATH":
        return new Z4Rotation(json.$get("startAngle"), Z4FancifulValue.fromJSON(json.$get("angle")), Z4RotationBehavior.RELATIVE_TO_PATH, json.$get("delayed"));
      default:
        return null;
    }
  }
}
