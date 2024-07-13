/**
 * The sinusoidal curve
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalCurve extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   period = 0.0;

   amplitude = 0.0;

   angle = 0.0;

   two_PI_over_period = 0.0;

   polyline = null;

  static  APPROX_SEGMENTS = 64;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the sinusoid
   * @param y1 The y-axis coordinate of the start point of the sinusoid
   * @param x2 The x-axis coordinate of the end point of the sinusoid
   * @param y2 The y-axis coordinate of the end point of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  constructor(x1, y1, x2, y2, period, amplitude, angle) {
    super();
    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;
    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
    let distance = Z4Math.distance(x1, y1, x2, y2);
    let size = parseInt(distance * Z4SinusoidalCurve.APPROX_SEGMENTS / period) - 1;
    if (size > 0) {
      let rotation = Z4Math.atan(x1, y1, x2, y2);
      let points = new Array();
      for (let i = 0; i <= size; i++) {
        let x = distance * i / size;
        let y = Math.sin(angle + this.two_PI_over_period * x) * amplitude;
        points.push(Z4Math.rotoTranslate(x, y, rotation, x1, y1));
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
