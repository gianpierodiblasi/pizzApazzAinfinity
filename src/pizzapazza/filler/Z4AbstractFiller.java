package pizzapazza.filler;

import def.dom.ImageData;
import javascript.awt.Color;
import pizzapazza.color.Z4GradientColor;
import simulation.js.$Uint8Array;

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
}
