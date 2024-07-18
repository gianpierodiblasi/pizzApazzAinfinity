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

   getPolyline() {
    return new Z4Polyline(new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2)));
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
