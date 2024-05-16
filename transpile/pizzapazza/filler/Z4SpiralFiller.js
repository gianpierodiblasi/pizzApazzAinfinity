/**
 * A (multi) spiral filler
 *
 * @author gianpiero.diblasi
 */
class Z4SpiralFiller extends Z4AbstractFiller {

   cx = 0;

   cy = 0;

   radius = 0.0;

   angle = 0.0;

   logarithmic = false;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param radius The radius of the spiral
   * @param angle The start angle of the spiral (in radians)
   * @param logarithmic true for a logarithmic spiral, false otherwise
   */
  constructor(gradientColor, cx, cy, radius, angle, logarithmic) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.logarithmic = logarithmic;
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let distance = Math.hypot(rotated["x"], rotated["y"]);
    let currentAngle = Z4Math.TWO_PI * (this.logarithmic ? Math.log(distance / this.radius) : distance / this.radius);
    let xSpiral = distance * Math.cos(currentAngle);
    let ySpiral = distance * Math.sin(currentAngle);
    distance = Z4Math.distance(rotated["x"], rotated["y"], xSpiral, ySpiral) / (2 * distance);
    return isNaN(distance) ? 0 : distance;
  }
}
