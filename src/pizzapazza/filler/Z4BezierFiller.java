package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.bezier.$Bezier;

/**
 * A (multi) cubic bezier filler
 *
 * @author gianpiero.diblasi
 */
public class Z4BezierFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

  private final int x1;
  private final int y1;
  private final int ctrlx1;
  private final int ctrly1;
  private final int ctrlx2;
  private final int ctrly2;
  private final int x2;
  private final int y2;
  private final int radius;

  private final $Bezier bezier;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx1 The x-axis coordinate of the first control point of the curve
   * @param ctrly1 The y-axis coordinate of the first control point of the curve
   * @param ctrlx2 The x-axis coordinate of the second control point of the
   * curve
   * @param ctrly2 The y-axis coordinate of the second control point of the
   * curve
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param radius The radius
   * @param boundaryBehavior The boundary behavior
   */
  public Z4BezierFiller(Z4GradientColor gradientColor, int x1, int y1, int ctrlx1, int ctrly1, int ctrlx2, int ctrly2, int x2, int y2, int radius, Z4BoundaryBehavior boundaryBehavior) {
    super(gradientColor, boundaryBehavior);

    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;

    this.bezier = new $Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

  @Override
  protected double getDistance(int x, int y) {
    Z4Point point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y) / this.radius;
  }
}
