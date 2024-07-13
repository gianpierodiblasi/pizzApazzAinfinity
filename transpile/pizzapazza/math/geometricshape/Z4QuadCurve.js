/**
 * The quadratic bezier curve
 *
 * @author gianpiero.diblasi
 */
class Z4QuadCurve extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   ctrlx = 0.0;

   ctrly = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   bezier = null;

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
  constructor(x1, y1, ctrlx, ctrly, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx = ctrlx;
    this.ctrly = ctrly;
    this.x2 = x2;
    this.y2 = y2;
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx, this.ctrly, this.x2, this.y2);
  }

   getPolyline() {
    return new Z4Polyline(this.bezier.getLUT(parseInt(this.bezier.length() / 2)));
  }

   distance(x, y) {
    let point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y);
  }
}
