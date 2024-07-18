/**
 * A geometric shape described by a single point
 *
 * @author gianpiero.diblasi
 */
class Z4SinglePointShape extends Z4GeometricShape {

   x = 0.0;

   y = 0.0;

  /**
   * Creates the object
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   */
  constructor(x, y) {
    super(Z4GeometricShapeType.POINT);
    this.x = x;
    this.y = y;
  }

   getPolyline() {
    return new Z4Polyline(new Array(new Z4Point(x, y), new Z4Point(x, y)));
  }

   distance(x, y) {
    return Z4Math.distance(this.x, this.y, x, y);
  }

   getLength() {
    return 0;
  }

   getPointAt(position) {
    return new Z4Point(this.x, this.y);
  }

   getTangentAt(position) {
    return Z4Vector.fromVector(this.x, this.y, 0, 0);
  }

   toJSON() {
    let json = super.toJSON();
    json["x"] = this.x;
    json["y"] = this.y;
    return json;
  }

  /**
   * Creates a Z4SinglePointShape from a JSON object
   *
   * @param json The JSON object
   * @return the geometric shape
   */
  static  fromJSON(json) {
    return new Z4SinglePointShape(json["x"], json["y"]);
  }
}
