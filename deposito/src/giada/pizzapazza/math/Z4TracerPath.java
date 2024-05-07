package giada.pizzapazza.math;

import simulation.bezier.$Bezier;
import simulation.bezier.$BezierPoint;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The path for a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
public class Z4TracerPath {

  private double surplus;
  private double step;

  private double x1;
  private double y1;
  private double x2;
  private double y2;
  private double x3;
  private double y3;

  private $Bezier bezierCurve;
  private double bezierCurveLength;

  private double length;
  private double position;

  /**
   * Creates a Z4TracerPath from a line
   *
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  public static Z4TracerPath fromLine(double x1, double y1, double x2, double y2, double surplus, double step) {
    Z4TracerPath path = new Z4TracerPath();

    path.x1 = x1;
    path.y1 = y1;
    path.x2 = x2;
    path.y2 = y2;

    return path.init(surplus, step);
  }

  /**
   * Creates a Z4TracerPath from a quadric Bezier curve followed by a line
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx The x-axis coordinate of the control point of the curve
   * @param ctrly The y-axis coordinate of the control point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param x3 The x-axis coordinate of the end point of the line
   * @param y3 The y-axis coordinate of the end point of the line
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  public static Z4TracerPath fromQuadAndLine(double x1, double y1, double ctrlx, double ctrly, double x2, double y2, double x3, double y3, double surplus, double step) {
    Z4TracerPath path = new Z4TracerPath();

    path.bezierCurve = new $Bezier(x1, y1, ctrlx, ctrly, x2, y2);
    path.bezierCurveLength = path.bezierCurve.length();
    path.x2 = x2;
    path.y2 = y2;
    path.x3 = x3;
    path.y3 = y3;

    return path.init(surplus, step);
  }

  private Z4TracerPath init(double surplus, double step) {
    this.surplus = surplus;
    this.step = step;

    this.length = $exists(this.bezierCurve)
            ? this.bezierCurveLength + Z4Math.distance(this.x2, this.y2, this.x3, this.y3)
            : Z4Math.distance(this.x1, this.y1, this.x2, this.y2);

    this.position = surplus;
    return this;
  }

  /**
   * Checks if this path has more points
   *
   * @return true if this path has more points, false otherwise
   */
  public boolean hasNext() {
    return this.length > this.position;
  }

  /**
   * Returns the next tangent vector
   *
   * @return The next tangent vector, null if the path has no more points
   */
  public Z4Vector next() {
    if (!this.hasNext()) {
      return null;
    } else if (!$exists(this.bezierCurve)) {
      double t = this.position / this.length;
      double x = (this.x2 - this.x1) * t + this.x1;
      double y = (this.y2 - this.y1) * t + this.y1;

      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    } else if (this.position < this.bezierCurveLength) {
      double t = this.position / this.bezierCurveLength;
      $BezierPoint point = this.bezierCurve.get(t);
      $BezierPoint derivative = this.bezierCurve.derivative(t);

      this.position += this.step;
      return Z4Vector.fromPoints(point.x, point.y, point.x + derivative.x, point.y + derivative.y);
    } else {
      double t = (this.position - this.bezierCurveLength) / (this.length - this.bezierCurveLength);
      double x = (this.x3 - this.x2) * t + this.x2;
      double y = (this.y3 - this.y2) * t + this.y2;

      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x2, this.y2, this.x3, this.y3));
    }
  }

  /**
   * Returns the tangent vector in a position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector
   */
  public Z4Vector getTangentAt(double position) {
//    let tangent = this._gPath.tangentAt(position);
//    return Z4Vector.fromPoints(tangent.start.x, tangent.start.y, tangent.end.x, tangent.end.y);
    return null;
  }

  /**
   * Restarts the path
   *
   * @return This Z4TracerPath
   */
  public Z4TracerPath restart() {
    this.position = this.surplus;
    return this;
  }

  /**
   * Returns the path length
   *
   * @return The path length
   */
  public double getLength() {
    return this.length;
  }

  /**
   * Returns the new surplus for the next path
   *
   * @return The new surplus for the next path
   */
  public double getNewSurplus() {
    return this.position - this.length;
  }

  /**
   * Returns the number of available points in the path
   *
   * @return The number of available points in the path
   */
  public double getPointCount() {
    return parseInt((this.length - this.surplus) / this.step);
  }
}
