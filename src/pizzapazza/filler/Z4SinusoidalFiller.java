package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import static simulation.js.$Globals.$exists;

/**
 * A (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
public class Z4SinusoidalFiller extends Z4AbstractBoundaryBehaviorFiller {

  private final int x;
  private final int y;
  private final double waveLength;
  private final double period;
  private final double amplitude;
  private final double angle;

  private final double two_PI_over_period;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x The x-axis coordinate of the start point of the sinusoid
   * @param y The y-axis coordinate of the start point of the sinusoid
   * @param waveLength The wave lenght of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   * @param boundaryBehavior The boundary behavior
   */
  public Z4SinusoidalFiller(Z4GradientColor gradientColor, int x, int y, double waveLength, double period, double amplitude, double angle, int boundaryBehavior) {
    super(gradientColor, boundaryBehavior);

    this.x = x;
    this.y = y;
    this.waveLength = waveLength;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;

    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
  }

  @Override
  protected double getColorPositionAtWithBoundaryBehavior(int x, int y, int boundaryBehavior) {
    Z4Point rotated = Z4Math.rotate(x - this.x, y - this.y, this.angle);
    double d = Math.abs(rotated.y - this.amplitude * Math.sin(rotated.x * this.two_PI_over_period)) / this.waveLength;

    if (d <= 1) {
      return d;
    } else if (boundaryBehavior == Z4SinusoidalFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior == Z4SinusoidalFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior == Z4SinusoidalFiller.SYMMETRIC_AT_BOUNDARY) {
      int step = (int) Math.floor(d);
      d -= step;

      if ($exists((step % 2))) {
        d = 1 - d;
      }

      return d;
    } else if (boundaryBehavior == Z4SinusoidalFiller.REPEAT_AT_BOUNDARY) {
      return d - (int) Math.floor(d);
    } else {
      return -1;
    }
  }
}
