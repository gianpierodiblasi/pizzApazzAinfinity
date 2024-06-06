package pizzapazza.color;

import pizzapazza.Z4JSONable;
import simulation.js.$Object;

/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractProgression implements Z4JSONable {

  private final Z4Lighting lighting;

  /**
   * Creates the object
   *
   * @param lighting
   */
  public Z4AbstractProgression(Z4Lighting lighting) {
    this.lighting = lighting;
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
    json.$set("lighting", this.lighting);
    return json;
  }
}
