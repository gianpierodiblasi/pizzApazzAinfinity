/**
 * The sinusoidal curve
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalCurve extends Z4GeometricCurve {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   period = 0.0;

   amplitude = 0.0;

   angle = 0.0;

   two_PI_over_period = 0.0;

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
    super(Z4GeometricShapeType.SINUSOIDAL);
    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;
    this.two_PI_over_period = Z4Math.TWO_PI / period;
    let distance = Z4Math.distance(x1, y1, x2, y2);
    let size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / period) - 1;
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

   getControlPoints() {
    let rotation = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);
    return new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2), new Z4Point(this.x1 + this.period * Math.cos(rotation), this.y1 + this.period * Math.sin(rotation)), new Z4Point(this.x1 + this.amplitude * Math.cos(rotation - Z4Math.HALF_PI), this.y1 + this.amplitude * Math.sin(rotation - Z4Math.HALF_PI)));
  }

   getControlPointConnections() {
    return new Array(0, 1, 0, 2, 0, 3);
  }

   getSpinnerConfigurations() {
    return new Array(new Z4GeometricShapeSpinnerConfiguration("", Z4Translations.ANGLE, 0, 0, 360));
  }

   toJSON() {
    let json = super.toJSON();
    json["x1"] = this.x1;
    json["y1"] = this.y1;
    json["x2"] = this.x2;
    json["y2"] = this.y2;
    json["period"] = this.period;
    json["amplitude"] = this.amplitude;
    json["angle"] = this.angle;
    return json;
  }

  /**
   * Creates a Z4SinusoidalCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4SinusoidalCurve(json["x1"], json["y1"], json["x2"], json["y2"], json["period"], json["amplitude"], json["angle"]);
  }

  /**
   * Creates a Z4SinusoidalCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4SinusoidalCurve(width / 2, height / 2, 3 * width / 4, height / 2, width / 8, height / 4, 0);
  }
}
