package pizzapazza.math;

import pizzapazza.util.Z4JSONable;
import simulation.js.$Object;

/**
 * The whirlpool
 *
 * @author gianpiero.diblasi
 */
public class Z4Whirlpool implements Z4JSONable {

  private final Z4WhirlpoolBehavior behavior;
  private final Z4FancifulValue angle;

  /**
   * Creates the object
   *
   * @param behavior The behavior
   * @param angle The angle
   */
  public Z4Whirlpool(Z4WhirlpoolBehavior behavior, Z4FancifulValue angle) {
    super();
    this.behavior = behavior;
    this.angle = angle;
  }

  /**
   * Returns the behavior
   *
   * @return The behavior
   */
  public Z4WhirlpoolBehavior getWhirlpoolBehavior() {
    return this.behavior;
  }

  /**
   * Returns the angle
   *
   * @return The angle
   */
  public Z4FancifulValue getAngle() {
    return this.angle;
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("behavior", this.behavior);
    json.$set("angle", this.angle.toJSON());
    return json;
  }

  /**
   * Creates a Z4Whirlpool from a JSON object
   *
   * @param json The JSON object
   * @return the whirlpool
   */
  public static Z4Whirlpool fromJSON($Object json) {
    return new Z4Whirlpool(json.$get("behavior"), Z4FancifulValue.fromJSON(json.$get("angle")));
  }
}
