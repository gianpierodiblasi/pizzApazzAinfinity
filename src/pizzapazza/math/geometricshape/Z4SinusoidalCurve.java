package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

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
    super(Z4GeometricShapeType.SINUSOIDAL);

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

  @Override
  public Array<Z4Point> getControlPoints() {
    double rotation = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);

    return new Array<>(
            new Z4Point(this.x1, this.y1),
            new Z4Point(this.x2, this.y2),
            new Z4Point(this.x1 + this.period * Math.cos(rotation), this.y1 + this.period * Math.sin(rotation)),
            new Z4Point(this.x1 + this.amplitude * Math.cos(rotation - Z4Math.HALF_PI), this.y1 + this.amplitude * Math.sin(rotation - Z4Math.HALF_PI))
    );
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    json.$set("period", this.period);
    json.$set("amplitude", this.amplitude);
    json.$set("angle", this.angle);
    return json;
  }

  /**
   * Creates a Z4SinusoidalCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4SinusoidalCurve fromJSON($Object json) {
    return new Z4SinusoidalCurve(
            json.$get("x1"), json.$get("y1"),
            json.$get("x2"), json.$get("y2"),
            json.$get("period"), json.$get("amplitude"), json.$get("angle")
    );
  }

  /**
   * Creates a Z4SinusoidalCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4SinusoidalCurve fromSize(int width, int height) {
    return new Z4SinusoidalCurve(
            width / 2, height / 2,
            3 * width / 4, height / 2,
            width / 8, height / 4, 0);
  }
}
