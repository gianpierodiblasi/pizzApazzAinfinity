package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;
import simulation.js.$Path2D;

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
    this.y1 = y1;
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
  public boolean isPath() {
    return true;
  }

  @Override
  public $Path2D getPath2D() {
    return this.polyline.getPath2D();
  }

  @Override
  public Array<$Path2D> getDirectionArrows() {
    return new Array<>(this.getDirectionArrowAt(0.5));
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
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1, 0, 2, 0, 3);
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return new Array<>(new Z4GeometricShapeSpinnerConfiguration("", Z4Translations.ANGLE, parseInt(Z4Math.rad2deg(this.angle)), 0, 360));
  }

  @Override
  public Array<Z4GeometricShapeButtonConfiguration> getButtonConfigurations() {
    return new Array<>();
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    if (pointIndex == 0) {
      double offsetX = this.x1 - x;
      double offsetY = this.y1 - y;

      double radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      double angle1 = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);
      double angle2 = angle1;
      double angle3 = angle1 - Z4Math.HALF_PI;

      Z4Point point1 = this.getPoint(x, y, this.x2 - offsetX, this.y2 - offsetY, radius1, angle1, width, height);
      Z4Point point2 = this.getPoint(x, y, controlPoints.$get(2).x - offsetX, controlPoints.$get(2).y - offsetY, this.period, angle2, width, height);
      Z4Point point3 = this.getPoint(this.x1, this.y1, controlPoints.$get(3).x - offsetX, controlPoints.$get(3).y - offsetY, this.amplitude, angle3, width, height);

      return new Z4SinusoidalCurve(
              x, y,
              point1.x, point1.y,
              Z4Math.distance(x, y, point2.x, point2.y), Z4Math.distance(x, y, point3.x, point3.y),
              spinnerIndex == 0 ? spinnerValue : this.angle
      );
    } else if (pointIndex == 1) {
      double angle2 = Z4Math.atan(this.x1, this.y1, x, y);
      double angle3 = angle2 - Z4Math.HALF_PI;

      Z4Point point2 = this.getPoint(
              this.x1, this.y1,
              this.x1 + this.period * Math.cos(angle2), this.y1 + this.period * Math.sin(angle2),
              this.period, angle2, width, height
      );

      Z4Point point3 = this.getPoint(
              this.x1, this.y1,
              this.x1 + this.amplitude * Math.cos(angle3), this.y1 + this.amplitude * Math.sin(angle3),
              this.amplitude, angle3, width, height
      );

      return new Z4SinusoidalCurve(
              this.x1, this.y1,
              x, y,
              Z4Math.distance(this.x1, this.y1, point2.x, point2.y), Z4Math.distance(this.x1, this.y1, point3.x, point3.y),
              spinnerIndex == 0 ? spinnerValue : this.angle
      );
    } else if (pointIndex == 2) {
      double radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      double angle1 = Z4Math.atan(this.x1, this.y1, x, y);
      double angle3 = angle1 - Z4Math.HALF_PI;

      Z4Point point1 = this.getPoint(
              this.x1, this.y1,
              this.x1 + radius1 * Math.cos(angle1), this.y1 + radius1 * Math.sin(angle1),
              radius1, angle1, width, height
      );

      Z4Point point3 = this.getPoint(
              this.x1, this.y1,
              this.x1 + this.amplitude * Math.cos(angle3), this.y1 + this.amplitude * Math.sin(angle3),
              this.amplitude, angle3, width, height
      );

      return new Z4SinusoidalCurve(
              this.x1, this.y1,
              point1.x, point1.y,
              Z4Math.distance(this.x1, this.y1, x, y), Z4Math.distance(this.x1, this.y1, point3.x, point3.y),
              spinnerIndex == 0 ? spinnerValue : this.angle
      );
    } else if (pointIndex == 3) {
      double radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      double angle1 = Z4Math.atan(this.x1, this.y1, x, y) + Z4Math.HALF_PI;
      double angle2 = angle1;

      Z4Point point1 = this.getPoint(
              this.x1, this.y1,
              this.x1 + radius1 * Math.cos(angle1), this.y1 + radius1 * Math.sin(angle1),
              radius1, angle1, width, height
      );

      Z4Point point2 = this.getPoint(
              this.x1, this.y1,
              this.x1 + this.period * Math.cos(angle2), this.y1 + this.period * Math.sin(angle2),
              this.period, angle2, width, height
      );

      return new Z4SinusoidalCurve(
              this.x1, this.y1,
              point1.x, point1.y,
              Z4Math.distance(this.x1, this.y1, point2.x, point2.y), Z4Math.distance(this.x1, this.y1, x, y),
              spinnerIndex == 0 ? spinnerValue : this.angle
      );
    } else {
      return spinnerIndex == 0 ? new Z4SinusoidalCurve(this.x1, this.y1, this.x2, this.y2, this.period, this.amplitude, Z4Math.deg2rad(spinnerValue)) : this;
    }
  }

  private Z4Point getPoint(double cx, double cy, double x, double y, double radius, double angle, int width, int height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

  @Override
  public Z4GeometricShape fromRotation(double cx, double cy, double angle) {
    Z4Point p1 = Z4Math.rotoTranslate(this.x1 - cx, this.y1 - cy, angle, cx, cy);
    Z4Point p2 = Z4Math.rotoTranslate(this.x2 - cx, this.y2 - cy, angle, cx, cy);
    return new Z4SinusoidalCurve(p1.x, p1.y, p2.x, p2.y, this.period, this.amplitude, this.angle);
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
            width / 4, height / 2,
            3 * width / 4, height / 2,
            width / 2, height / 4, 0);
  }
}
