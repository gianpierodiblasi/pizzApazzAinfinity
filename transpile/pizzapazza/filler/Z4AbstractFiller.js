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
    let data = imageData.data;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let position = this.getColorPositionAt(x / imageData.width, y / imageData.height);
        if (position !== -1) {
          let color = this.gradientColor.getColorAt(position, true);
          let index = (y * imageData.width + x) * 4;
          data[index] = color.red;
          data[index + 1] = color.green;
          data[index + 2] = color.blue;
          data[index + 3] = color.alpha;
        }
      }
    }
  }

  /**
   * Returns the color position to use for a pixel
   *
   * @param x The x-axis coordinate of the pixel in relative size (in the range
   * [0,1])
   * @param y The y-axis coordinate of the pixel in relative size (in the range
   * [0,1])
   * @return The color position, -1 if no position is available
   */
   getColorPositionAt(x, y) {
  }
}
