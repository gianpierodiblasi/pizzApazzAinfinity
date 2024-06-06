package pizzapazza.color;

import simulation.js.$Object;

/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorProgression extends Z4AbstractProgression {

  private final Z4GradientColorProgressionBehavior behavior;
  private final double temporalStepProgression;

  /**
   * Creates the object
   *
   * @param behavior The gradient color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  public Z4GradientColorProgression(Z4GradientColorProgressionBehavior behavior, double temporalStepProgression, Z4Lighting lighting) {
    super(lighting);
    this.behavior = behavior;
    this.temporalStepProgression = temporalStepProgression;
  }

  /**
   * Returns the gradient color progression behavior
   *
   * @return The gradient color progression behavior
   */
  public Z4GradientColorProgressionBehavior getGradientColorProgressionBehavior() {
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

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("behavior", this.behavior);
    json.$set("temporalStepProgression", this.temporalStepProgression);
    return json;
  }
}
