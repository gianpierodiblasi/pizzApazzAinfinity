package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The line
 *
 * @author gianpiero.diblasi
 */
public class Z4Line extends Z4GeometricShape {

  public final double x1;
  public final double y1;
  public final double x2;
  public final double y2;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  public Z4Line(double x1, double y1, double x2, double y2) {
    super(Z4GeometricShapeType.LINE);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  @Override
  public boolean isPath() {
    return true;
  }

  @Override
  public $Path2D getPath2D() {
    $Path2D path = new $Path2D();
    path.moveTo(this.x1, this.y1);
    path.lineTo(this.x2, this.y2);
    return path;
  }

  @Override
  public Array<$Path2D> getDirectionArrows() {
    return new Array<>(this.getDirectionArrowAt(0.5));
  }

  @Override
  public double distance(double x, double y) {
    return Z4Math.ptSegDist(this.x1, this.y1, this.x2, this.y2, x, y);
  }

  @Override
  public double getLength() {
    return Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
  }

  @Override
  public Z4Point getPointAt(double position) {
    double x = (this.x2 - this.x1) * position + this.x1;
    double y = (this.y2 - this.y1) * position + this.y1;
    return new Z4Point(x, y);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    if (position != 1) {
      Z4Point point = this.getPointAt(position);
      return Z4Vector.fromPoints(point.x, point.y, this.x2, this.y2);
    } else {
      return Z4Vector.fromVector(this.x2, this.y2, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    }
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return new Array<>(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2));
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1);
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
      return new Z4Line(x, y, this.x2, this.y2);
    } else if (pointIndex == 1) {
      return new Z4Line(this.x1, this.y1, x, y);
    } else {
      return this;
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    return json;
  }

  /**
   * Creates a Z4Line from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4Line fromJSON($Object json) {
    return new Z4Line(json.$get("x1"), json.$get("y1"), json.$get("x2"), json.$get("y2"));
  }

  /**
   * Creates a Z4Line contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4Line fromSize(int width, int height) {
    return new Z4Line(width / 4, height / 2, 3 * width / 4, height / 2);
  }
}
