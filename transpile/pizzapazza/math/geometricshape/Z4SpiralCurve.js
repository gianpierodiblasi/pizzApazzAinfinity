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

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the spiral
   * @param y1 The y-axis coordinate of the start point of the spiral
   * @param x2 The x-axis coordinate of the end point of the spiral
   * @param y2 The y-axis coordinate of the end point of the spiral
   * @param radius The radius of the spiral
   */
  constructor(x1, y1, x2, y2, radius) {
    super(Z4GeometricShapeType.SPIRAL);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    let distance = Z4Math.distance(x1, y1, x2, y2);
    let size = parseInt(distance * Z4GeometricCurve.APPROX_SEGMENTS / radius);
    if (size > 0) {
      let angle = Z4Math.atan(x1, y1, x2, y2);
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

   isPath() {
    return true;
  }

   getPath2D() {
    return this.polyline.getPath2D();
  }

   getDirectionArrows() {
    return new Array(this.getDirectionArrowAt(0.5));
  }

   getControlPoints() {
    let angle = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);
    return new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2), new Z4Point(this.x1 + this.radius * Math.cos(angle), this.y1 + this.radius * Math.sin(angle)));
  }

   getControlPointConnections() {
    return new Array(0, 1, 0, 2);
  }

   getSpinnerConfigurations() {
    return new Array();
  }

   getButtonConfigurations() {
    return new Array();
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 0) {
      let offsetX = this.x1 - x;
      let offsetY = this.y1 - y;
      let radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      let angle1 = Z4Math.atan(this.x1, this.y1, this.x2, this.y2);
      let point1 = this.getPoint(x, y, this.x2 - offsetX, this.y2 - offsetY, radius1, angle1, width, height);
      let point2 = this.getPoint(x, y, controlPoints[2].x - offsetX, controlPoints[2].y - offsetY, this.radius, angle1, width, height);
      return new Z4SpiralCurve(x, y, point1.x, point1.y, Z4Math.distance(x, y, point2.x, point2.y));
    } else if (pointIndex === 1) {
      return new Z4SpiralCurve(this.x1, this.y1, x, y, this.radius);
    } else if (pointIndex === 2) {
      let radius1 = Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
      let angle1 = Z4Math.atan(this.x1, this.y1, x, y);
      let point1 = this.getPoint(this.x1, this.y1, this.x1 + radius1 * Math.cos(angle1), this.y1 + radius1 * Math.sin(angle1), radius1, angle1, width, height);
      return new Z4SpiralCurve(this.x1, this.y1, point1.x, point1.y, Z4Math.distance(this.x1, this.y1, x, y));
    } else {
      return this;
    }
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
    json["radius"] = this.radius;
    return json;
  }

  /**
   * Creates a Z4SpiralCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4SpiralCurve(json["x1"], json["y1"], json["x2"], json["y2"], json["radius"]);
  }

  /**
   * Creates a Z4SpiralCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4SpiralCurve(width / 2, height / 2, 3 * width / 4, height / 2, width / 8);
  }
}
