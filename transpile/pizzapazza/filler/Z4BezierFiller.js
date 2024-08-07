/**
 * A (multi) cubic bezier filler
 *
 * @author gianpiero.diblasi
 */
class Z4BezierFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

   x1 = 0;

   y1 = 0;

   ctrlx1 = 0;

   ctrly1 = 0;

   ctrlx2 = 0;

   ctrly2 = 0;

   x2 = 0;

   y2 = 0;

   radius = 0;

   bezier = null;

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
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   * @param radius The radius
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2, radius, boundaryBehavior) {
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
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

   getDistance(x, y) {
    let point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y) / this.radius;
  }
}
