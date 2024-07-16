package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import static simulation.js.$Globals.parseInt;

/**
 * The sinusoidal curve
 *
 * @author gianpiero.diblasi
 */
public class Z4SinusoidalCurve extends Z4GeometricCurve {

  private final double x1;
  private final double y1;
  private final double x2;
  private final double y2;
  private final double period;
  private final double amplitude;
  private final double angle;

  private final double two_PI_over_period;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the sinusoid
   * @param y1 The y-axis coordinate of the start point of the sinusoid
   * @param x2 The x-axis coordinate of the end point of the sinusoid
   * @param y2 The y-axis coordinate of the end point of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  public Z4SinusoidalCurve(double x1, double y1, double x2, double y2, double period, double amplitude, double angle) {
    super();

    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;

    this.two_PI_over_period = Z4Math.TWO_PI / period;

    double distance = Z4Math.distance(x1, y1, x2, y2);
    int size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / period) - 1;

    if (size > 0) {
      double rotation = Z4Math.atan(x1, y1, x2, y2);

      Array<Z4Point> points = new Array<>();
      for (int i = 0; i <= size; i++) {
        double x = distance * i / size;
        double y = Math.sin(angle + this.two_PI_over_period * x) * amplitude;
        points.push(Z4Math.rotoTranslate(x, y, rotation, x1, y1));
      }
      this.polyline = new Z4Polyline(points);
    } else {
      this.polyline = new Z4Polyline(new Array<>(new Z4Point(x1, y1), new Z4Point(x2, y2)));
    }
  }
}