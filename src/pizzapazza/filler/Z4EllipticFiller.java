package pizzapazza.filler;

import def.dom.ImageData;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Uint8Array;

/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
public class Z4EllipticFiller extends Z4AbstractFiller {

  private final double cx;
  private final double cy;
  private final double rx;
  private final double ry;
  private final double angle;
  private final int boundaryBehavior;

  /**
   * The filler does nothing outside the boundary
   */
  public final static int STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  public final static int FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  public final static int SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  public final static int REPEAT_AT_BOUNDARY = 3;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point in relative size (in
   * the range [0,1])
   * @param cy The y-axis coordinate of the center point in relative size (in
   * the range [0,1])
   * @param rx The x-radius in relative size (in the range [0,1])
   * @param ry The y-radius in relative size (in the range [0,1])
   * @param angle The rotation angle of the ellipse (in radians)
   * @param boundaryBehavior The boundary behavior
   */
  public Z4EllipticFiller(Z4GradientColor gradientColor, double cx, double cy, double rx, double ry, double angle, int boundaryBehavior) {
    super(gradientColor);

    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.boundaryBehavior = boundaryBehavior;
  }

  @Override
  public void fill(ImageData imageData) {
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < imageData.height; y++) {
      double yy = y / imageData.height - this.cy;

      for (int x = 0; x < imageData.width; x++) {
        int index = (y * imageData.width + x) * 4;

        double xx = x / imageData.width - this.cx;
        $Object rotated = Z4Math.rotate(xx, yy, this.angle);
        double d = Math.hypot((double) rotated.$get("x") / this.rx, (double) rotated.$get("y") / this.ry);

        if (d <= 1) {
          this.setValue(data, d, index);
        } else if (this.boundaryBehavior == Z4EllipticFiller.STOP_AT_BOUNDARY) {
        } else if (this.boundaryBehavior == Z4EllipticFiller.FILL_AT_BOUNDARY) {
          this.setValue(data, 1, index);
        } else if (this.boundaryBehavior == Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY) {
          int step = (int) Math.floor(d);
          d -= step;

          if ($exists((step % 2))) {
            d = 1 - d;
          }

          this.setValue(data, d, index);
        } else if (this.boundaryBehavior == Z4EllipticFiller.REPEAT_AT_BOUNDARY) {
          this.setValue(data, d - (int) Math.floor(d), index);
        }
      }
    }
  }
}
