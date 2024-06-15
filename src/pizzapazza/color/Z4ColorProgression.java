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
  private final Z4Lighting lighting;

  /**
   * Creates the object
   *
   * @param behavior The color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  public Z4ColorProgression(Z4ColorProgressionBehavior behavior, double temporalStepProgression, Z4Lighting lighting) {
    super();
    this.behavior = behavior;
    this.temporalStepProgression = temporalStepProgression;
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
      case "LIGHTED":
        lighting = Z4Lighting.LIGHTED;
        break;
      case "DARKENED":
        lighting = Z4Lighting.DARKENED;
        break;
      default:
        lighting = null;
        break;
    }

    switch ("" + json.$get("behavior")) {
      case "SPATIAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, json.$get("temporalStepProgression"), lighting);
      case "TEMPORAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, json.$get("temporalStepProgression"), lighting);
      case "RELATIVE_TO_PATH":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, json.$get("temporalStepProgression"), lighting);
      case "RANDOM":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, json.$get("temporalStepProgression"), lighting);
      default:
        return null;
    }
  }
}
