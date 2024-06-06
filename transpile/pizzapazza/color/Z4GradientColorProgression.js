/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorProgression extends Z4AbstractGradientColorProgression {

   behavior = null;

   temporalStepProgression = 0.0;

  /**
   * Creates the object
   *
   * @param behavior The gradient color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  constructor(behavior, temporalStepProgression, lighting) {
    super(lighting);
    this.behavior = behavior;
    this.temporalStepProgression = temporalStepProgression;
  }

  /**
   * Returns the gradient color progression behavior
   *
   * @return The gradient color progression behavior
   */
   getGradientColorProgressionBehavior() {
    return this.behavior;
  }

  /**
   * Returns the step for temporal progression (in the range [0,1])
   *
   * @return The step for temporal progression (in the range [0,1])
   */
   getTemporalStepProgression() {
    return this.temporalStepProgression;
  }

   toJSON() {
    let json = super.toJSON();
    json["behavior"] = this.behavior;
    json["temporalStepProgression"] = this.temporalStepProgression;
    return json;
  }

  /**
   * Creates a Z4GradientColorProgression from a JSON object
   *
   * @param json The JSON object
   * @return the gradient color progression
   */
  static  fromJSON(json) {
    let lighting = null;
    switch("" + json["lighting"]) {
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
    switch("" + json["behavior"]) {
      case "SPATIAL":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, json["temporalStepProgression"], lighting);
      case "TEMPORAL":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, json["temporalStepProgression"], lighting);
      case "RELATIVE_TO_PATH":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, json["temporalStepProgression"], lighting);
      case "RANDOM":
        return new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RANDOM, json["temporalStepProgression"], lighting);
      default:
        return null;
    }
  }
}
