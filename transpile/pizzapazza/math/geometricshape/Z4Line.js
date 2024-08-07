/**
 * The line
 *
 * @author gianpiero.diblasi
 */
class Z4Line extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  constructor(x1, y1, x2, y2) {
    super(Z4GeometricShapeType.LINE);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

   isPath() {
    return true;
  }

   getPath2D() {
    let path = new Path2D();
    path.moveTo(this.x1, this.y1);
    path.lineTo(this.x2, this.y2);
    return path;
  }

   getDirectionArrows() {
    return new Array(this.getDirectionArrowAt(0.5));
  }

   distance(x, y) {
    return Z4Math.ptSegDist(this.x1, this.y1, this.x2, this.y2, x, y);
  }

   getLength() {
    return Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
  }

   getPointAt(position) {
    let x = (this.x2 - this.x1) * position + this.x1;
    let y = (this.y2 - this.y1) * position + this.y1;
    return new Z4Point(x, y);
  }

   getTangentAt(position) {
    if (position !== 1) {
      let point = this.getPointAt(position);
      return Z4Vector.fromPoints(point.x, point.y, this.x2, this.y2);
    } else {
      return Z4Vector.fromVector(this.x2, this.y2, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    }
  }

   getControlPoints() {
    return new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2));
  }

   getControlPointConnections() {
    return new Array(0, 1);
  }

   getSpinnerConfigurations() {
    return new Array();
  }

   getButtonConfigurations() {
    return new Array();
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 0) {
      return new Z4Line(x, y, this.x2, this.y2);
    } else if (pointIndex === 1) {
      return new Z4Line(this.x1, this.y1, x, y);
    } else {
      return this;
    }
  }

   fromRotation(cx, cy, angle) {
    let p1 = Z4Math.rotoTranslate(this.x1 - cx, this.y1 - cy, angle, cx, cy);
    let p2 = Z4Math.rotoTranslate(this.x2 - cx, this.y2 - cy, angle, cx, cy);
    return new Z4Line(p1.x, p1.y, p2.x, p2.y);
  }

   toJSON() {
    let json = super.toJSON();
    json["x1"] = this.x1;
    json["y1"] = this.y1;
    json["x2"] = this.x2;
    json["y2"] = this.y2;
    return json;
  }

  /**
   * Creates a Z4Line from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4Line(json["x1"], json["y1"], json["x2"], json["y2"]);
  }

  /**
   * Creates a Z4Line contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4Line(width / 4, height / 2, 3 * width / 4, height / 2);
  }
}
