/**
 * A rectangular curve
 *
 * @author gianpiero.diblasi
 */
class Z4RectangleFrame extends Z4GeometricFrame {

  /**
   * Creates the object
   *
   * @param x The x location of the rectangle (not rotated)
   * @param y The y location of the rectangle (not rotated)
   * @param w The width of the rectangle (not sheared)
   * @param h The height of the rectangle (not sheared)
   * @param angle The rotation angle of the rectangle
   * @param sx The x shear of the rectangle
   * @param sy The y shear of the rectangle
   */
  constructor(x, y, w, h, angle, sx, sy) {
    super(Z4GeometricShapeType.RECTANGLE, x, y, w, h, angle, sx, sy);
    let tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);
    let points = new Array();
    points.push(tx.transform(0, 0));
    points.push(tx.transform(w - 1, 0));
    points.push(tx.transform(w - 1, h - 1));
    points.push(tx.transform(0, h - 1));
    points.push(points[0]);
    this.polyline = new Z4Polyline(points);
  }

   fromDataChanged(x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    return null;
  }

  /**
   * Creates a Z4RectangleFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4RectangleFrame(json["x"], json["y"], json["w"], json["h"], json["angle"], json["sx"], json["sy"]);
  }

  /**
   * Creates a Z4RectangleFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4RectangleFrame(width / 4, height / 4, width / 2, height / 2, 0, 0, 0);
  }
}
