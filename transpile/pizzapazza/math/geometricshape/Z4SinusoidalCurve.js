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

   fromDataChanged(x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    // double angle1;
    // double radius1;
    // Z4Point point1;
    // double angle2;
    // double radius2;
    // Z4Point point2;
    // double angle3;
    // double radius3;
    // Z4Point point3;
    // 
    // switch (selectedIndex) {
    // case 0:
    // int offsetX = points.$get(0).x - x;
    // int offsetY = points.$get(0).y - y;
    // 
    // radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
    // angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
    // radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
    // angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
    // radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
    // angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
    // 
    // points.$set(0, new Point(x, y));
    // 
    // point1 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(1).x - offsetX, points.$get(1).y - offsetY, radius1, angle1, width, height);
    // points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
    // 
    // point2 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(2).x - offsetX, points.$get(2).y - offsetY, radius2, angle2, width, height);
    // points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
    // 
    // point3 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(3).x - offsetX, points.$get(3).y - offsetY, radius3, angle3, width, height);
    // points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
    // break;
    // case 1:
    // radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
    // angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;
    // radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
    // angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Math.PI;
    // 
    // point2 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius2 * Math.cos(angle2), points.$get(0).y + radius2 * Math.sin(angle2),
    // radius2, angle2, width, height);
    // 
    // point3 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius3 * Math.cos(angle3), points.$get(0).y + radius3 * Math.sin(angle3),
    // radius3, angle3, width, height);
    // 
    // points.$set(1, new Point(x, y));
    // points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
    // points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
    // break;
    // case 2:
    // radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
    // angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;
    // radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
    // angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;
    // 
    // point1 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius1 * Math.cos(angle1), points.$get(0).y + radius1 * Math.sin(angle1),
    // radius1, angle1, width, height);
    // 
    // point3 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius3 * Math.cos(angle3), points.$get(0).y + radius3 * Math.sin(angle3),
    // radius3, angle3, width, height);
    // 
    // points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
    // points.$set(2, new Point(x, y));
    // points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
    // break;
    // case 3:
    // radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
    // angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Math.PI;
    // radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
    // angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;
    // 
    // point1 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius1 * Math.cos(angle1), points.$get(0).y + radius1 * Math.sin(angle1),
    // radius1, angle1, width, height);
    // 
    // point2 = this.getPoint(
    // points.$get(0).x, points.$get(0).y,
    // points.$get(0).x + radius2 * Math.cos(angle2), points.$get(0).y + radius2 * Math.sin(angle2),
    // radius2, angle2, width, height);
    // 
    // points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
    // points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
    // points.$set(3, new Point(x, y));
    // break;
    // }
    return null;
  }

   getPoint(cx, cy, x, y, radius, angle, width, height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
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
