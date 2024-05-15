/**
 * The common abstract object for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFiller {

  /**
   * The color used to fill
   */
   gradientColor = null;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   */
  constructor(gradientColor) {
    this.gradientColor = gradientColor;
  }

  /**
   * Fills an image
   *
   * @param imageData The image data
   */
   fill(imageData) {
  }
}
