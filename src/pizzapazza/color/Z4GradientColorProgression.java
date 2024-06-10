package pizzapazza.color;

import simulation.js.$Object;

/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorProgression extends Z4AbstractGradientColorProgression {

  private final Z4GradientColorProgressionBehavior behavior;

  /**
   * Creates the object
   *
   * @param behavior The gradient color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  public Z4GradientColorProgression(Z4GradientColorProgressionBehavior behavior, double temporalStepProgression, Z4Lighting lighting) {
    super(temporalStepProgression, lighting);
    this.behavior = behavior;
  }

  /**
   * Returns the gradient color progression behavior
   *
   * @return The gradient color progression behavior
   */
  public Z4GradientColorProgressionBehavior getGradientColorProgressionBehavior() {
    return this.behavior;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("behavior", this.behavior);
    return json;
  }

  /**
   * Creates a Z4GradientColorProgression from a JSON object
   *
   * @param json The JSON object
   * @return the gradient color progression
   */
  @SuppressWarnings("unchecked")
  public static Z4GradientColorProgression fromJSON($Object json) {
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
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, json.$get("temporalStepProgression"), lighting);
      case "TEMPORAL":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, json.$get("temporalStepProgression"), lighting);
      case "RELATIVE_TO_PATH":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, json.$get("temporalStepProgression"), lighting);
      case "RANDOM":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RANDOM, json.$get("temporalStepProgression"), lighting);
      default:
        return null;
    }
  }
}
