package pizzapazza.math.geometricshape;

import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.bezier.$Bezier;
import static simulation.js.$Globals.parseInt;

/**
 * The quadratic bezier curve
 *
 * @author gianpiero.diblasi
 */
public class Z4QuadCurve implements Z4GeometricShape {

  private final double x1;
  private final double y1;
  private final double ctrlx;
  private final double ctrly;
  private final double x2;
  private final double y2;

  private final $Bezier bezier;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx The x-axis coordinate of the first control point of the curve
   * @param ctrly The y-axis coordinate of the first control point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  public Z4QuadCurve(double x1, double y1, double ctrlx, double ctrly, double x2, double y2) {
    super();

    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx = ctrlx;
    this.ctrly = ctrly;
    this.x2 = x2;
    this.y2 = y2;

    this.bezier = new $Bezier(this.x1, this.y1, this.ctrlx, this.ctrly, this.x2, this.y2);
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
