package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
public class Z4EllipticFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

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
  protected double getDistance(int x, int y) {
    Z4Point rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    return Math.hypot(rotated.x / this.rx, rotated.y / this.ry);
  }
}
