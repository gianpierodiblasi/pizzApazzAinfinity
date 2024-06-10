package pizzapazza.color;

import pizzapazza.util.Z4JSONable;
import simulation.js.$Object;

/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractGradientColorProgression implements Z4JSONable {

  private final double temporalStepProgression;
  private final Z4Lighting lighting;

  /**
   * Creates the object
   *
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   */
  public Z4AbstractGradientColorProgression(double temporalStepProgression, Z4Lighting lighting) {
    super();
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
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
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("temporalStepProgression", this.temporalStepProgression);
    json.$set("lighting", this.lighting);
    return json;
  }
}
