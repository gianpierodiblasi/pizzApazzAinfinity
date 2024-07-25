/**
 * Common abstract object for quadric and cubic bezier curves
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractBezierCurve extends Z4GeometricShape {

  /**
   * The x-axis coordinate of the start point of the curve
   */
   x1 = 0.0;

  /**
   * The y-axis coordinate of the start point of the curve
   */
   y1 = 0.0;

  /**
   * The x-axis coordinate of the end point of the curve
   */
   x2 = 0.0;

  /**
   * The y-axis coordinate of the end point of the curve
   */
   y2 = 0.0;

  /**
   * The bezier curve
   */
   bezier = null;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  constructor(type, x1, y1, x2, y2) {
    super(type);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

   isPath() {
    return true;
  }

   getPath2D() {
    return new Z4Polyline(this.bezier.getLUT(parseInt(this.bezier.length() / 2))).getPath2D();
  }

   getDirectionArrows() {
    return new Array(this.getDirectionArrowAt(0.5));
  }

   distance(x, y) {
    let point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y);
  }

   getLength() {
    return this.bezier.length();
  }

   getPointAt(position) {
    return this.bezier.get(position);
  }

   getTangentAt(position) {
    let point = this.bezier.get(position);
    let derivative = this.bezier.derivative(position);
    return Z4Vector.fromPoints(point.x, point.y, point.x + derivative.x, point.y + derivative.y);
  }

   getSpinnerConfigurations() {
    return new Array();
  }

   getButtonConfigurations() {
    return new Array();
  }
}
