/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgression extends Z4NextableWithParam {

   behavior = null;

   temporalStepProgression = 0.0;

   lighting = null;

  /**
   * Creates the object
   *
   * @param behavior The color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  constructor(behavior, temporalStepProgression, lighting) {
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
   getColorProgressionBehavior() {
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

  /**
   * Returns the color lighting
   *
   * @return The color lighting
   */
   getLighting() {
    return this.lighting;
  }

   next(position) {
    position = position === -1 ? 0 : position + this.temporalStepProgression;
    if (position > 1) {
      position -= 1;
    }
    return position;
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    json["temporalStepProgression"] = this.temporalStepProgression;
    json["lighting"] = this.lighting;
    return json;
  }

  /**
   * Creates a Z4ColorProgression from a JSON object
   *
   * @param json The JSON object
   * @return the color progression
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
        return new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, json["temporalStepProgression"], lighting);
      case "TEMPORAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, json["temporalStepProgression"], lighting);
      case "RELATIVE_TO_PATH":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, json["temporalStepProgression"], lighting);
      case "RANDOM":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, json["temporalStepProgression"], lighting);
      case "RADIAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RADIAL, json["temporalStepProgression"], lighting);
      default:
        return null;
    }
  }
}
