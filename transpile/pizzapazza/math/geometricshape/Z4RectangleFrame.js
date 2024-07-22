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

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 0) {
      let tx = Z4AffineTransform.translate(x, y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      let point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      return new Z4RectangleFrame(x, y, Z4Math.distance(x, y, point1.x, point1.y), Z4Math.distance(x, y, point2.x, point2.y), this.angle, this.sx, this.sy);
    } else if (pointIndex === 1) {
      let angle1 = Z4Math.atan(this.x, this.y, x, y);
      let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle1).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      return new Z4RectangleFrame(this.x, this.y, Z4Math.distance(this.x, this.y, x, y), Z4Math.distance(this.x, this.y, point2.x, point2.y), angle1, this.sx, this.sy);
    } else if (pointIndex === 2) {
      let angle2 = Z4Math.atan(this.x, this.y, x, y) - Z4Math.HALF_PI;
      let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle2).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      return new Z4RectangleFrame(this.x, this.y, Z4Math.distance(this.x, this.y, point1.x, point1.y), Z4Math.distance(this.x, this.y, x, y), angle2, this.sx, this.sy);
    } else if (spinnerIndex === 0) {
      return new Z4RectangleFrame(this.x, this.y, this.w, this.h, this.angle, spinnerValue, this.sy);
    } else if (spinnerIndex === 1) {
      return new Z4RectangleFrame(this.x, this.y, this.w, this.h, this.angle, this.sx, spinnerValue);
    } else {
      return this;
    }
  }

   getPoint(tx, point, w, h, width, height) {
    while ((point.x < 0 || point.x > width || point.y < 0 || point.y > height) && (w > 0 || h > 0)) {
      if (w > 0) {
        w = Math.max(0, w - 0.05);
      }
      if (h > 0) {
        h = Math.max(0, h - 0.05);
      }
      point = tx.transform(w, h);
    }
    return point;
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
