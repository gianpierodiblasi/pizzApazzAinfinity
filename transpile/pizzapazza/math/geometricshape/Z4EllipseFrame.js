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
   * @param x The x location of the ellipse (not rotated)
   * @param y The y location of the ellipse (not rotated)
   * @param w The width of the ellipse (not sheared)
   * @param h The height of the ellipse (not sheared)
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
    let w2 = (w - 1) / 2;
    let h2 = (h - 1) / 2;
    let incAngle = extentAngle / Z4GeometricCurve.APPROX_SEGMENTS;
    let tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);
    let points = new Array();
    for (let i = 0; i <= Z4GeometricCurve.APPROX_SEGMENTS; i++) {
      let currentAngle = startAngle + incAngle * i;
      let xx = w2 * Math.cos(currentAngle) + w2;
      let yy = h2 * Math.sin(currentAngle) + h2;
      points.push(tx.transform(xx, yy));
    }
    this.polyline = new Z4Polyline(points);
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
    return new Z4EllipseFrame(width / 4, height / 4, width / 2, height / 2, 0, 0, 0, 0, Z4Math.TWO_PI);
  }
}
