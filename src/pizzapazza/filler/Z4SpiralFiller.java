package pizzapazza.filler;

import static def.js.Globals.isNaN;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

/**
 * A (multi) spiral filler
 *
 * @author gianpiero.diblasi
 */
public class Z4SpiralFiller extends Z4AbstractGradientColorFiller {

  private final int cx;
  private final int cy;
  private final double radius;
  private final double angle;
  private final boolean logarithmic;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param radius The radius of the spiral
   * @param angle The start angle of the spiral (in radians)
   * @param logarithmic true for a logarithmic spiral, false otherwise
   */
  public Z4SpiralFiller(Z4GradientColor gradientColor, int cx, int cy, double radius, double angle, boolean logarithmic) {
    super(gradientColor);

    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.logarithmic = logarithmic;
  }

  @Override
  protected double getColorPositionAt(int x, int y) {
    Z4Point rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    double distance = Math.hypot(rotated.x, rotated.y);
    double currentAngle = Z4Math.TWO_PI * (this.logarithmic ? Math.log(distance / this.radius) : distance / this.radius);
    double xSpiral = distance * Math.cos(currentAngle);
    double ySpiral = distance * Math.sin(currentAngle);

    distance = Z4Math.distance(rotated.x, rotated.y, xSpiral, ySpiral) / (2 * distance);
    return isNaN(distance) ? 0 : distance;
  }
}
