package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.js.$Object;

/**
 * A (multi) conic filler
 *
 * @author gianpiero.diblasi
 */
public class Z4ConicFiller extends Z4AbstractFiller {

  private final int cx;
  private final int cy;
  private final double angle;
  private final boolean symmetric;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param angle The rotation angle of the cone (in radians)
   * @param symmetric true for symmetric cone, false otherwise
   */
  public Z4ConicFiller(Z4GradientColor gradientColor, int cx, int cy, double angle, boolean symmetric) {
    super(gradientColor);

    this.cx = cx;
    this.cy = cy;
    this.angle = angle;
    this.symmetric = symmetric;
  }

  @Override
  protected double getColorPositionAt(int x, int y) {
    $Object rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    double position = Math.atan2((double) rotated.$get("y"), (double) rotated.$get("x")) / Z4Math.TWO_PI;

    if (position < 0) {
      position += 1;
    }

    if (this.symmetric) {
      return 2 * (position < 0.5 ? position : 1 - position);
    } else {
      return position;
    }
  }
}
