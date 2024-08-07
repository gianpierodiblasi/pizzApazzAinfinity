/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgression extends Z4NextableWithParam {

   behavior = null;

   temporalStepProgression = 0.0;

   resetOnStartMoving = false;

   lighting = null;

  /**
   * Creates the object
   *
   * @param behavior The color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param resetOnStartMoving true to reset the temporal position when the
   * moving starts, false otherwise
   * @param lighting The color lighting
   */
  constructor(behavior, temporalStepProgression, resetOnStartMoving, lighting) {
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
   * Checks if the temporal position has to be reset on start moving
   *
   * @return true to reset the temporal position when the moving starts, false
   * otherwise
   */
   isResetOnStartMoving() {
    return this.resetOnStartMoving;
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
    json["resetOnStartMoving"] = this.resetOnStartMoving;
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
    switch("" + json["behavior"]) {
      case "SPATIAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "TEMPORAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "RELATIVE_TO_PATH":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "RANDOM":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      default:
        return null;
    }
  }
}
