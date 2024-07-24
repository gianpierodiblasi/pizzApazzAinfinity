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

   isPath() {
    return true;
  }

   getPath2D() {
    let path = new Path2D();
    path.moveTo(this.x, this.y);
    return path;
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

   getControlPoints() {
    return new Array(new Z4Point(this.x, this.y));
  }

   getControlPointConnections() {
    return new Array();
  }

   getSpinnerConfigurations() {
    return new Array();
  }

   getButtonConfigurations() {
    return new Array();
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    return pointIndex === 0 ? new Z4SinglePointShape(x, y) : this;
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
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4SinglePointShape(json["x"], json["y"]);
  }

  /**
   * Creates a Z4SinglePointShape contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4SinglePointShape(width / 2, height / 2);
  }
}
