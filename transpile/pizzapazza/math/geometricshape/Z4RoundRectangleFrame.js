/**
 * A rectangular curve with rounded vertices
 *
 * @author gianpiero.diblasi
 */
class Z4RoundRectangleFrame extends Z4GeometricFrame {

  static  ADVANCE = 0.15;

  static  ROUND_APPROX_SEGMENTS = 16;

  /**
   * Creates the object
   *
   * @param x The x center location of the rounded rectangle (not rotated)
   * @param y The y center location of the rounded rectangle (not rotated)
   * @param w The half width of the rounded rectangle (not sheared)
   * @param h The half height of the rounded rectangle (not sheared)
   * @param angle The rotation angle of the rounded rectangle
   * @param sx The x shear of the rounded rectangle
   * @param sy The y shear of the rounded rectangle
   */
  constructor(x, y, w, h, angle, sx, sy) {
    super(Z4GeometricShapeType.ROUND_RECTANGLE, x, y, w, h, angle, sx, sy);
    let min = Math.min(w, h);
    let advance = min * Z4RoundRectangleFrame.ADVANCE;
    let tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);
    let points = new Array();
    // First point NW
    points.push(tx.transform(advance - w, -h));
    // Second point NE
    points.push(tx.transform(w - advance, -h));
    // Arc NE
    this.createArc(points, tx, advance, Z4Math.HALF_THREE_PI, w - advance, advance - h);
    // Third point SE
    points.push(tx.transform(w, h - advance));
    // Arc SE
    this.createArc(points, tx, advance, 0, w - advance, h - advance);
    // fourth point SW
    points.push(tx.transform(advance - w, h));
    // Arc SW
    this.createArc(points, tx, advance, Z4Math.HALF_PI, advance - w, h - advance);
    // fifth point NW
    points.push(tx.transform(-w, advance - h));
    // Arc NW
    this.createArc(points, tx, advance, Math.PI, advance - w, advance - h);
    points.push(points[0]);
    this.polyline = new Z4Polyline(points);
  }

   createArc(points, tx, advance, startAngle, dx, dy) {
    for (let i = 1; i < Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS; i++) {
      let angleArc = startAngle + Z4Math.HALF_PI * i / Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS;
      let xx = advance * Math.cos(angleArc);
      let yy = advance * Math.sin(angleArc);
      points.push(tx.transform(xx + dx, yy + dy));
    }
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    return null;
  }

  /**
   * Creates a Z4RoundRectangleFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4RoundRectangleFrame(json["x"], json["y"], json["w"], json["h"], json["angle"], json["sx"], json["sy"]);
  }

  /**
   * Creates a Z4RoundRectangleFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4RoundRectangleFrame(width / 2, height / 2, width / 4, height / 4, 0, 0, 0);
  }
}
