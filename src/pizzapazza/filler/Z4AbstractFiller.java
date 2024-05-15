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
  public abstract void fill(ImageData imageData);

  /**
   * Sets a value in a data array
   *
   * @param data The data array
   * @param position The color posiiton
   * @param index The data index
   */
  protected void setValue($Uint8Array data, double position, int index) {
    Color color = this.gradientColor.getColorAt(position, true);

    data.$set(index, color.red);
    data.$set(index + 1, color.green);
    data.$set(index + 2, color.blue);
    data.$set(index + 3, color.alpha);
  }
}
