/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
class Z4EllipticFiller extends Z4AbstractFiller {

   cx = 0.0;

   cy = 0.0;

   rx = 0.0;

   ry = 0.0;

   angle = 0.0;

   boundaryBehavior = 0;

  /**
   * The filler does nothing outside the boundary
   */
  static  STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  static  FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  static  SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  static  REPEAT_AT_BOUNDARY = 3;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point in relative size (in
   * the range [0,1])
   * @param cy The y-axis coordinate of the center point in relative size (in
   * the range [0,1])
   * @param rx The x-radius in relative size (in the range [0,1])
   * @param ry The y-radius in relative size (in the range [0,1])
   * @param angle The rotation angle of the ellipse (in radians)
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, boundaryBehavior) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.boundaryBehavior = boundaryBehavior;
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let d = Math.hypot(rotated["x"] / this.rx, rotated["y"] / this.ry);
    if (d <= 1) {
      return d;
    } else if (this.boundaryBehavior === Z4EllipticFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (this.boundaryBehavior === Z4EllipticFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (this.boundaryBehavior === Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (this.boundaryBehavior === Z4EllipticFiller.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
