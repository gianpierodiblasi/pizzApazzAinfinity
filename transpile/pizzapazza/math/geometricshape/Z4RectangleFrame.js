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
    super(x, y, w, h, angle, sx, sy);
    let points = new Array();
    let p = Z4Math.shear(0, 0, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    p = Z4Math.shear(w - 1, 0, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    p = Z4Math.shear(w - 1, h - 1, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    p = Z4Math.shear(0, h - 1, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    points.push(points[0]);
    this.polyline = new Z4Polyline(points);
  }
}
