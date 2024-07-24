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

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the spiral
   * @param y1 The y-axis coordinate of the start point of the spiral
   * @param x2 The x-axis coordinate of the end point of the spiral
   * @param y2 The y-axis coordinate of the end point of the spiral
   * @param radius The radius of the spiral
   */
  public Z4SpiralCurve(double x1, double y1, double x2, double y2, double radius) {
    super(Z4GeometricShapeType.SPIRAL);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;

    double distance = Z4Math.distance(x1, y1, x2, y2);
    int size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / radius);

    if (size > 0) {
      double angle = Z4Math.atan(x1, y1, x2, y2);
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
  public boolean isPath() {
    return true;
  }
  
  @Override
  public Array<Z4Point> getControlPoints() {
    double angle = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);

    return new Array<>(
            new Z4Point(this.x1, this.y1),
            new Z4Point(this.x2, this.y2),
            new Z4Point(this.x1 + this.radius * Math.cos(angle), this.y1 + this.radius * Math.sin(angle))
    );
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1, 0, 2);
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return new Array<>();
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

      Z4Point point1 = this.getPoint(x, y, this.x2 - offsetX, this.y2 - offsetY, radius1, angle1, width, height);
      Z4Point point2 = this.getPoint(x, y, controlPoints.$get(2).x - offsetX, controlPoints.$get(2).y - offsetY, this.radius, angle1, width, height);

      return new Z4SpiralCurve(x, y, point1.x, point1.y, Z4Math.distance(x, y, point2.x, point2.y));
    } else if (pointIndex == 1) {
      return new Z4SpiralCurve(this.x1, this.y1, x, y, this.radius);
    } else if (pointIndex == 2) {
      double radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      double angle1 = Z4Math.atan(this.x1, this.y1, x, y);

      Z4Point point1 = this.getPoint(this.x1, this.y1, this.x1 + radius1 * Math.cos(angle1), this.y1 + radius1 * Math.sin(angle1), radius1, angle1, width, height);

      return new Z4SpiralCurve(this.x1, this.y1, point1.x, point1.y, Z4Math.distance(this.x1, this.y1, x, y));
    } else {
      return this;
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
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    json.$set("radius", this.radius);
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
            json.$get("radius")
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
            width / 8
    );
  }
}
