/**
 * The common interface for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFiller {

  /**
   * Fills an image
   *
   * @param imageData The image data
   */
   fill(imageData) {
  }

  /**
   * Returns the filling color (an instance of Color or Z4GradientColor) if it
   * exists
   *
   * @return The filling color (an instance of Color or Z4GradientColor)
   */
   getFillingColor() {
  }
}
