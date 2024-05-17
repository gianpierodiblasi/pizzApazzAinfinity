/**
 * A (multi) cubic bezier filler
 *
 * @author gianpiero.diblasi
 */
class Z4BezierFiller extends Z4AbstractBoundaryBehaviorFiller {

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
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
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
    this.bezier = new Bezier(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2);
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let point = this.bezier.project(new Z4Point(x, y));
    let d = Z4Math.distance(point.x, point.y, x, y) / this.radius;
    if (d <= 1) {
      return d;
    } else if (boundaryBehavior === Z4BezierFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4BezierFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior === Z4BezierFiller.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (boundaryBehavior === Z4BezierFiller.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
