package pizzapazza.math.geometricshape;

import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.bezier.$Bezier;
import static simulation.js.$Globals.parseInt;

/**
 *
 * @author gianpiero.diblasi
 */
public class Z4BezierCurve implements Z4GeometricShape {

  private final double x1;
  private final double y1;
  private final double ctrlx1;
  private final double ctrly1;
  private final double ctrlx2;
  private final double ctrly2;
  private final double x2;
  private final double y2;

  private final $Bezier bezier;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx1 The x-axis coordinate of the first control point of the curve
   * @param ctrly1 The y-axis coordinate of the first control point of the curve
   * @param ctrlx2 The x-axis coordinate of the second control point of the
   * curve
   * @param ctrly2 The y-axis coordinate of the second control point of the
   * curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  public Z4BezierCurve(double x1, double y1, double ctrlx1, double ctrly1, double ctrlx2, double ctrly2, double x2, double y2) {
    super();

    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.x2 = x2;
    this.y2 = y2;

    this.bezier = new $Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
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
}
