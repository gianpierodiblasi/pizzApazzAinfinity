/**
 * A (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
class Z4LinearFiller extends Z4AbstractBoundaryBehaviorFiller {

   p1x = 0;

   p1y = 0;

   p2x = 0;

   p2y = 0;

   angle = 0.0;

   distance = 0.0;

   line1x = 0.0;

   line1y = 0.0;

   line2x = 0.0;

   line2y = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x1, y1, x2, y2, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.p1x = x1;
    this.p1y = y1;
    this.p2x = x2;
    this.p2y = y2;
    this.angle = Z4Math.atan(this.p1x, this.p1y, this.p2x, this.p2y) + Z4Math.HALF_PI;
    this.distance = Z4Math.distance(this.p1x, this.p1y, this.p2x, this.p2y);
    this.line1x = this.p1x + Math.cos(this.angle);
    this.line1y = this.p1y + Math.sin(this.angle);
    this.line2x = this.p2x + Math.cos(this.angle);
    this.line2y = this.p2y + Math.sin(this.angle);
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let d1 = Z4Math.ptLineDist(this.p1x, this.p1y, this.line1x, this.line1y, x, y) / this.distance;
    let d2 = Z4Math.ptLineDist(this.p2x, this.p2y, this.line2x, this.line2y, x, y) / this.distance;
    if (d1 <= 1 && d2 <= 1) {
      return d1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return d1 < d2 ? 0 : 1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY) {
      let position = d1 < d2 ? d1 : d2;
      let step = Math.floor(position);
      position -= step;
      if ((d1 < d2 && (step % 2)) || (d1 > d2 && !(step % 2))) {
        position = 1 - position;
      }
      return position;
    } else if (boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      let position = d1 < d2 ? d1 : d2;
      position -= Math.floor(position);
      if (d1 < d2) {
        position = 1 - position;
      }
      return position;
    } else {
      return -1;
    }
  }
}
