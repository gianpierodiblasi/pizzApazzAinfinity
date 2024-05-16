package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
public class Z4EllipticFiller extends Z4AbstractBoundaryBehaviorFiller {

  private final int cx;
  private final int cy;
  private final int rx;
  private final int ry;
  private final double angle;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param rx The x-radius
   * @param ry The y-radius
   * @param angle The rotation angle of the ellipse (in radians)
   * @param boundaryBehavior The boundary behavior
   */
  public Z4EllipticFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int boundaryBehavior) {
    super(gradientColor, boundaryBehavior);

    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
  }

  @Override
  protected double getColorPositionAtWithBoundaryBehavior(int x, int y, int boundaryBehavior) {
    $Object rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    double d = Math.hypot((double) rotated.$get("x") / this.rx, (double) rotated.$get("y") / this.ry);

    if (d <= 1) {
      return d;
    } else if (boundaryBehavior == Z4EllipticFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior == Z4EllipticFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior == Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY) {
      int step = (int) Math.floor(d);
      d -= step;

      if ($exists((step % 2))) {
        d = 1 - d;
      }

      return d;
    } else if (boundaryBehavior == Z4EllipticFiller.REPEAT_AT_BOUNDARY) {
      return d - (int) Math.floor(d);
    } else {
      return -1;
    }
  }
}
