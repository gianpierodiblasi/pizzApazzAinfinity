/**
 * A (multi) conic filler
 *
 * @author gianpiero.diblasi
 */
class Z4ConicFiller extends Z4AbstractFiller {

   cx = 0;

   cy = 0;

   angle = 0.0;

   symmetric = false;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param angle The rotation angle of the cone (in radians)
   * @param symmetric true for symmetric cone, false otherwise
   */
  constructor(gradientColor, cx, cy, angle, symmetric) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.angle = angle;
    this.symmetric = symmetric;
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let position = Math.atan2(rotated["y"], rotated["x"]) / Z4Math.TWO_PI;
    if (position < 0) {
      position += 1;
    }
    if (this.symmetric) {
      return 2 * (position < 0.5 ? position : 1 - position);
    } else {
      return position;
    }
  }
}
