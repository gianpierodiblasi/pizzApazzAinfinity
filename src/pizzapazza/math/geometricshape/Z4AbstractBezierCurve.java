package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.bezier.$Bezier;
import static simulation.js.$Globals.parseInt;

/**
 * Common abstract object for quadric and cubic bezier curves
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractBezierCurve extends Z4GeometricShape {

  /**
   * The x-axis coordinate of the start point of the curve
   */
  protected final double x1;

  /**
   * The y-axis coordinate of the start point of the curve
   */
  protected final double y1;

  /**
   * The x-axis coordinate of the end point of the curve
   */
  protected final double x2;

  /**
   * The y-axis coordinate of the end point of the curve
   */
  protected final double y2;

  /**
   * The bezier curve
   */
  protected $Bezier bezier;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  public Z4AbstractBezierCurve(Z4GeometricShapeType type, double x1, double y1, double x2, double y2) {
    super(type);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  @Override
  public Z4Polyline getPolyline() {
    return new Z4Polyline(this.bezier.getLUT(parseInt(this.bezier.length() / 2)));
  }

  @Override
  public double distance(double x, double y) {
    Z4Point point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y);
  }

  @Override
  public double getLength() {
    return this.bezier.length();
  }

  @Override
  public Z4Point getPointAt(double position) {
    return this.bezier.get(position);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    Z4Point point = this.bezier.get(position);
    Z4Point derivative = this.bezier.derivative(position);
    return Z4Vector.fromPoints(point.x, point.y, point.x + derivative.x, point.y + derivative.y);
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfiguration() {
    return new Array<>();
  }
}
