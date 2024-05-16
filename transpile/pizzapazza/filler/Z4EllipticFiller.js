/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
class Z4EllipticFiller extends Z4AbstractBoundaryBehaviorFiller {

   cx = 0;

   cy = 0;

   rx = 0;

   ry = 0;

   angle = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param rx The x-radius
   * @param ry The y-radius
   * @param angle The rotation angle of the ellipse (in radians)
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let d = Math.hypot(rotated.x / this.rx, rotated.y / this.ry);
    if (d <= 1) {
      return d;
    } else if (boundaryBehavior === Z4EllipticFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4EllipticFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior === Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (boundaryBehavior === Z4EllipticFiller.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
