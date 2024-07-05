package pizzapazza.color;

import pizzapazza.math.Z4NextableWithParam;
import simulation.js.$Object;

/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorProgression implements Z4NextableWithParam<Double, Double> {

  private final Z4ColorProgressionBehavior behavior;
  private final double temporalStepProgression;
  private final boolean resetOnStartMoving;
  private final Z4Lighting lighting;

  /**
   * Creates the object
   *
   * @param behavior The color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param resetOnStartMoving true to reset the temporal position when the
   * moving starts, false otherwise
   * @param lighting The color lighting
   *
   */
  public Z4ColorProgression(Z4ColorProgressionBehavior behavior, double temporalStepProgression, boolean resetOnStartMoving, Z4Lighting lighting) {
    super();
    this.behavior = behavior;
    this.temporalStepProgression = temporalStepProgression;
    this.resetOnStartMoving = resetOnStartMoving;
    this.lighting = lighting;
  }

  /**
   * Returns the color progression behavior
   *
   * @return The color progression behavior
   */
  public Z4ColorProgressionBehavior getColorProgressionBehavior() {
    return this.behavior;
  }

  /**
   * Returns the step for temporal progression (in the range [0,1])
   *
   * @return The step for temporal progression (in the range [0,1])
   */
  public double getTemporalStepProgression() {
    return this.temporalStepProgression;
  }

  /**
   * Checks if the temporal position has to be reset on start moving
   *
   * @return true to reset the temporal position when the moving starts, false
   * otherwise
   */
  public boolean isResetOnStartMoving() {
    return this.resetOnStartMoving;
  }

  /**
   * Returns the color lighting
   *
   * @return The color lighting
   */
  public Z4Lighting getLighting() {
    return this.lighting;
  }

  @Override
  public Double next(Double position) {
    position = position == -1 ? 0 : position + this.temporalStepProgression;
    if (position > 1) {
      position -= 1;
    }
    return position;
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("behavior", this.behavior);
    json.$set("temporalStepProgression", this.temporalStepProgression);
    json.$set("resetOnStartMoving", this.resetOnStartMoving);
    json.$set("lighting", this.lighting);
    return json;
  }

  /**
   * Creates a Z4ColorProgression from a JSON object
   *
   * @param json The JSON object
   * @return the color progression
   */
  @SuppressWarnings("unchecked")
  public static Z4ColorProgression fromJSON($Object json) {
    Z4Lighting lighting;
    switch ("" + json.$get("lighting")) {
      case "NONE":
        lighting = Z4Lighting.NONE;
        break;
      case "LIGHTED_IN_OUT":
        lighting = Z4Lighting.LIGHTED_IN_OUT;
        break;
      case "DARKENED_IN_OUT":
        lighting = Z4Lighting.DARKENED_IN_OUT;
        break;
      case "LIGHTED_OUT_IN":
        lighting = Z4Lighting.LIGHTED_OUT_IN;
        break;
      case "DARKENED_OUT_IN":
        lighting = Z4Lighting.DARKENED_OUT_IN;
        break;
      default:
        lighting = null;
        break;
    }

    switch ("" + json.$get("behavior")) {
      case "SPATIAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, json.$get("temporalStepProgression"), json.$get("resetOnStartMoving"), lighting);
      case "TEMPORAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, json.$get("temporalStepProgression"), json.$get("resetOnStartMoving"), lighting);
      case "RELATIVE_TO_PATH":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, json.$get("temporalStepProgression"), json.$get("resetOnStartMoving"), lighting);
      case "RANDOM":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, json.$get("temporalStepProgression"), json.$get("resetOnStartMoving"), lighting);
      default:
        return null;
    }
  }
}
