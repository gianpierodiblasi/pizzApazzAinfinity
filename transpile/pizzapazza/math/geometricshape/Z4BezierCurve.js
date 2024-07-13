/**
 * The cubic bezier curve
 *
 * @author gianpiero.diblasi
 */
class Z4BezierCurve extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   ctrlx1 = 0.0;

   ctrly1 = 0.0;

   ctrlx2 = 0.0;

   ctrly2 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   bezier = null;

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
  constructor(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.x2 = x2;
    this.y2 = y2;
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

   getPolyline() {
    return new Z4Polyline(this.bezier.getLUT(parseInt(this.bezier.length() / 2)));
  }

   distance(x, y) {
    let point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y);
  }
}
