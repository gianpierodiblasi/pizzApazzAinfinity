/**
 * The progression of a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractGradientColorProgression extends Z4JSONable {

   lighting = null;

  /**
   * Creates the object
   *
   * @param lighting
   */
  constructor(lighting) {
    this.lighting = lighting;
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
    json["lighting"] = this.lighting;
    return json;
  }
}
