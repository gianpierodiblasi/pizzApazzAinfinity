package pizzapazza.filler;

import def.dom.ImageData;

/**
 * The common interface for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
public interface Z4AbstractFiller {

  /**
   * Fills an image
   *
   * @param imageData The image data
   */
  public void fill(ImageData imageData);

  /**
   * Returns the filling color (an instance of Color or Z4GradientColor) if it
   * exists
   *
   * @return The filling color (an instance of Color or Z4GradientColor)
   */
  public Object getFillingColor();
}
