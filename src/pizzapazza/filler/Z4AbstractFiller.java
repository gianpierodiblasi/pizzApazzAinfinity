package pizzapazza.filler;

import def.dom.ImageData;
import javascript.awt.Color;
import pizzapazza.color.Z4GradientColor;
import simulation.js.$Uint8Array;

/**
 * The common abstract object for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractFiller {

  private final Z4GradientColor gradientColor;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   */
  public Z4AbstractFiller(Z4GradientColor gradientColor) {
    this.gradientColor = gradientColor;
  }

  /**
   * Fills an image
   *
   * @param imageData The image data
   */
  public void fill(ImageData imageData) {
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < imageData.height; y++) {
      for (int x = 0; x < imageData.width; x++) {
        double position = this.getColorPositionAt(x / imageData.width, y / imageData.height);
        
        if (position != -1) {
          Color color = this.gradientColor.getColorAt(position, true);

          int index = (y * imageData.width + x) * 4;
          data.$set(index, color.red);
          data.$set(index + 1, color.green);
          data.$set(index + 2, color.blue);
          data.$set(index + 3, color.alpha);
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
  protected abstract double getColorPositionAt(double x, double y);
}
