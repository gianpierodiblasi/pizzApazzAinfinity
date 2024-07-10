package pizzapazza.filler;

import def.dom.ImageData;
import javascript.awt.Color;
import pizzapazza.color.Z4GradientColor;
import simulation.js.$Uint8Array;

/**
 * A Filler based on a gradient color
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractGradientColorFiller implements Z4AbstractFiller {

  private final Z4GradientColor gradientColor;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   */
  public Z4AbstractGradientColorFiller(Z4GradientColor gradientColor) {
    super();
    this.gradientColor = gradientColor;
  }

  @Override
  public void fill(ImageData imageData) {
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < imageData.height; y++) {
      for (int x = 0; x < imageData.width; x++) {
        double position = this.getColorPositionAt(x, y);

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
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The color position, -1 if no position is available
   */
  protected abstract double getColorPositionAt(int x, int y);

  @Override
  public Object getFillingColor() {
    return this.gradientColor;
  }
}
