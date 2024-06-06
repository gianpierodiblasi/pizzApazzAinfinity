/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorProgression extends Z4AbstractProgression {

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
}
