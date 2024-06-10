/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractGradientColorProgression extends Z4JSONable {

   temporalStepProgression = 0.0;

   lighting = null;

  /**
   * Creates the object
   *
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  constructor(temporalStepProgression, lighting) {
    super();
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
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

   toJSON() {
    let json = new Object();
    json["temporalStepProgression"] = this.temporalStepProgression;
    json["lighting"] = this.lighting;
    return json;
  }
}
