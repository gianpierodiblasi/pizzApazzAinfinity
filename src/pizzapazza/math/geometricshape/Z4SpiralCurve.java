package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The spiral curve
 *
 * @author gianpiero.diblasi
 */
public class Z4SpiralCurve extends Z4GeometricCurve {

  private final double x1;
  private final double y1;
  private final double x2;
  private final double y2;
  private final double radius;
  private final double angle;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the spiral
   * @param y1 The y-axis coordinate of the start point of the spiral
   * @param x2 The x-axis coordinate of the end point of the spiral
   * @param y2 The y-axis coordinate of the end point of the spiral
   * @param radius The radius of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  public Z4SpiralCurve(double x1, double y1, double x2, double y2, double radius, double angle) {
    super(Z4GeometricShapeType.SPIRAL);

    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    this.angle = angle;

    double distance = Z4Math.distance(x1, y1, x2, y2);
    int size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / radius) - 1;

    if (size > 0) {
      Array<Z4Point> points = new Array<>();
      for (int i = 0; i <= size; i++) {
        double t = i / Z4GeometricCurve.APPROX_SEGMENTS;
        double a = angle + Z4Math.TWO_PI * t;
        double r = radius * t;
        points.push(new Z4Point(r * Math.cos(a) + x1, r * Math.sin(a) + y1));
      }
      this.polyline = new Z4Polyline(points);
    } else {
      this.polyline = new Z4Polyline(new Array<>(new Z4Point(x1, y1), new Z4Point(x2, y2)));
    }
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return new Array<>(
            new Z4Point(this.x1, this.y1),
            new Z4Point(this.x2, this.y2),
            new Z4Point(this.x1 + this.radius * Math.cos(this.angle), this.y1 - this.radius * Math.sin(this.angle))
    );
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    json.$set("radius", this.radius);
    json.$set("angle", this.angle);
    return json;
  }

  /**
   * Creates a Z4SpiralCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4SpiralCurve fromJSON($Object json) {
    return new Z4SpiralCurve(
            json.$get("x1"), json.$get("y1"),
            json.$get("x2"), json.$get("y2"),
            json.$get("radius"), json.$get("angle")
    );
  }

  /**
   * Creates a Z4SpiralCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4SpiralCurve fromSize(int width, int height) {
    return new Z4SpiralCurve(
            width / 2, height / 2,
            3 * width / 4, height / 2,
            width / 8, 0
    );
  }
}
