/**
 * The common abstract object for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFiller {

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

  /**
   * Sets a value in a data array
   *
   * @param data The data array
   * @param position The color posiiton
   * @param index The data index
   */
   setValue(data, position, index) {
    let color = this.gradientColor.getColorAt(position, true);
    data[index] = color.red;
    data[index + 1] = color.green;
    data[index + 2] = color.blue;
    data[index + 3] = color.alpha;
  }
}
