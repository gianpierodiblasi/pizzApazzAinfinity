/**
 * An elliptic curve
 *
 * @author gianpiero.diblasi
 */
class Z4EllipseFrame extends Z4GeometricFrame {

   startAngle = 0.0;

   extentAngle = 0.0;

  /**
   * Creates the oject
   *
   * @param x The x center location of the ellipse (not rotated)
   * @param y The y center location of the ellipse (not rotated)
   * @param w The half width of the ellipse (not sheared)
   * @param h The half height of the ellipse (not sheared)
   * @param angle The rotation angle
   * @param sx The x shear of the ellipse
   * @param sy The y shear of the ellipse
   * @param startAngle The start angle
   * @param extentAngle The extent angle
   */
  constructor(x, y, w, h, angle, sx, sy, startAngle, extentAngle) {
    super(Z4GeometricShapeType.ELLIPSE, x, y, w, h, angle, sx, sy);
    this.startAngle = startAngle;
    this.extentAngle = extentAngle;
    let incAngle = extentAngle / Z4GeometricCurve.APPROX_SEGMENTS;
    let tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
    let points = new Array();
    for (let i = 0; i <= Z4GeometricCurve.APPROX_SEGMENTS; i++) {
      let currentAngle = startAngle + incAngle * i;
      let xx = w * Math.cos(currentAngle);
      let yy = h * Math.sin(currentAngle);
      points.push(tx.transform(xx, yy));
    }
    this.polyline = new Z4Polyline(points);
  }

   getControlPoints() {
    let w2 = this.w - 5;
    let h2 = this.h - 5;
    let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
    let controlPoints = super.getControlPoints();
    controlPoints.push(tx.transform(w2 * Math.cos(this.startAngle), h2 * Math.sin(this.startAngle)));
    controlPoints.push(tx.transform(w2 * Math.cos(this.startAngle + this.extentAngle), h2 * Math.sin(this.startAngle + this.extentAngle)));
    return controlPoints;
  }

   getControlPointConnections() {
    let controlPointConnections = super.getControlPointConnections();
    controlPointConnections.push(0, 3, 0, 4);
    return controlPointConnections;
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 3) {
      let txInverse = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT).inverse();
      let point3 = txInverse.transform(x, y);
      return new Z4EllipseFrame(this.x, this.y, this.w, this.h, this.angle, this.sx, this.sy, Z4Math.atan(0, 0, point3.x, point3.y), this.extentAngle);
    } else if (pointIndex === 4) {
      let txInverse = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT).inverse();
      let point4 = txInverse.transform(x, y);
      let angle4 = Z4Math.atan(0, 0, point4.x, point4.y) - this.startAngle;
      return new Z4EllipseFrame(this.x, this.y, this.w, this.h, this.angle, this.sx, this.sy, this.startAngle, angle4 > 0 ? angle4 : (Z4Math.TWO_PI + angle4));
    } else {
      return super.fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height);
    }
  }

   fromParameters(x, y, w, h, angle, sx, sy) {
    return new Z4EllipseFrame(x, y, w, h, angle, sx, sy, this.startAngle, this.extentAngle);
  }

   toJSON() {
    let json = super.toJSON();
    json["startAngle"] = this.startAngle;
    json["extentAngle"] = this.extentAngle;
    return json;
  }

  /**
   * Creates a Z4EllipseFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4EllipseFrame(json["x"], json["y"], json["w"], json["h"], json["angle"], json["sx"], json["sy"], json["startAngle"], json["extentAngle"]);
  }

  /**
   * Creates a Z4EllipseFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4EllipseFrame(width / 2, height / 2, width / 4, height / 4, 0, 0, 0, Math.PI, Z4Math.TWO_PI);
  }
}
