package pizzapazza.filler;

import def.dom.ImageData;
import pizzapazza.color.Z4GradientColor;

/**
 * The common abstract object for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractFiller {

  /**
   * The color used to fill
   */
  protected final Z4GradientColor gradientColor;

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
}
