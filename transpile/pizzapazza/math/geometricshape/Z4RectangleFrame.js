/**
 * A rectangular curve
 *
 * @author gianpiero.diblasi
 */
class Z4RectangleFrame extends Z4GeometricFrame {

  /**
   * Creates the object
   *
   * @param x The x center location of the rectangle (not rotated)
   * @param y The y center location of the rectangle (not rotated)
   * @param w The half width of the rectangle (not sheared)
   * @param h The half height of the rectangle (not sheared)
   * @param angle The rotation angle of the rectangle
   * @param sx The x shear of the rectangle
   * @param sy The y shear of the rectangle
   */
  constructor(x, y, w, h, angle, sx, sy) {
    super(Z4GeometricShapeType.RECTANGLE, x, y, w, h, angle, sx, sy);
    let tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
    let points = new Array();
    points.push(tx.transform(-w, -h));
    points.push(tx.transform(w, -h));
    points.push(tx.transform(w, h));
    points.push(tx.transform(-w, h));
    points.push(points[0]);
    this.polyline = new Z4Polyline(points);
  }

   fromParameters(x, y, w, h, angle, sx, sy) {
    return new Z4RectangleFrame(x, y, w, h, angle, sx, sy);
  }

   fromRotation(cx, cy, angle) {
    let p = Z4Math.rotoTranslate(this.x - cx, this.y - cy, angle, cx, cy);
    return new Z4RectangleFrame(p.x, p.y, this.w, this.h, this.angle, this.sx, this.sy);
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
    return new Z4RectangleFrame(width / 2, height / 2, width / 4, height / 4, 0, 0, 0);
  }
}
