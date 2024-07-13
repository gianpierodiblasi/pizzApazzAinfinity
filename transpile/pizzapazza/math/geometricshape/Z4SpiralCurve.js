/**
 * The spiral curve
 *
 * @author gianpiero.diblasi
 */
class Z4SpiralCurve extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   radius = 0.0;

   angle = 0.0;

   polyline = null;

  static  APPROX_SEGMENTS = 64;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the spiral
   * @param y1 The y-axis coordinate of the start point of the spiral
   * @param x2 The x-axis coordinate of the end point of the spiral
   * @param y2 The y-axis coordinate of the end point of the spiral
   * @param radius The radius of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  constructor(x1, y1, x2, y2, period, radius, angle) {
    super();
    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    this.angle = angle;
    let distance = Z4Math.distance(x1, y1, x2, y2);
    let size = parseInt(distance * Z4SpiralCurve.APPROX_SEGMENTS / radius) - 1;
    if (size > 0) {
      let points = new Array();
      for (let i = 0; i <= size; i++) {
        let t = i / Z4SpiralCurve.APPROX_SEGMENTS;
        let a = angle + Z4Math.TWO_PI * t;
        let r = radius * t;
        points.push(new Z4Point(r * Math.cos(a) + x1, r * Math.sin(a) + y1));
      }
      this.polyline = new Z4Polyline(points);
    } else {
      this.polyline = new Z4Polyline(new Array(new Z4Point(x1, y1), new Z4Point(x2, y2)));
    }
  }

   getPolyline() {
    return this.polyline;
  }

   distance(x, y) {
    return polyline.distance(x, y);
  }
}
