/**
 * The spiral curve
 *
 * @author gianpiero.diblasi
 */
class Z4SpiralCurve extends Z4GeometricCurve {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   radius = 0.0;

   angle = 0.0;

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
  constructor(x1, y1, x2, y2, radius, angle) {
    super(Z4GeometricShapeType.SPIRAL);
    this.x1 = x1;
    this.y1 = y2;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    this.angle = angle;
    let distance = Z4Math.distance(x1, y1, x2, y2);
    let size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / radius) - 1;
    if (size > 0) {
      let points = new Array();
      for (let i = 0; i <= size; i++) {
        let t = i / Z4GeometricCurve.APPROX_SEGMENTS;
        let a = angle + Z4Math.TWO_PI * t;
        let r = radius * t;
        points.push(new Z4Point(r * Math.cos(a) + x1, r * Math.sin(a) + y1));
      }
      this.polyline = new Z4Polyline(points);
    } else {
      this.polyline = new Z4Polyline(new Array(new Z4Point(x1, y1), new Z4Point(x2, y2)));
    }
  }

   toJSON() {
    let json = super.toJSON();
    json["x1"] = this.x1;
    json["y1"] = this.y1;
    json["x2"] = this.x2;
    json["y2"] = this.y2;
    json["radius"] = this.radius;
    json["angle"] = this.angle;
    return json;
  }

  /**
   * Creates a Z4SpiralCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4SpiralCurve(json["x1"], json["y1"], json["x2"], json["y2"], json["radius"], json["angle"]);
  }

  /**
   * Creates a Z4SpiralCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4SpiralCurve(width / 2, height / 2, 3 * width / 4, height / 2, width / 8, 0);
  }
}
