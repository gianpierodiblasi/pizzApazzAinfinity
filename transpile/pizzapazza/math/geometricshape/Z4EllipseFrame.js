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
    super(x, y, w, h, angle, sx, sy);
    this.startAngle = startAngle;
    this.extentAngle = extentAngle;
    let w2 = (w - 1) / 2;
    let h2 = (h - 1) / 2;
    let incAngle = extentAngle / Z4GeometricCurve.APPROX_SEGMENTS;
    let points = new Array();
    for (let i = 0; i <= Z4GeometricCurve.APPROX_SEGMENTS; i++) {
      let currentAngle = startAngle + incAngle * i;
      let xx = w2 * Math.cos(currentAngle) + w2;
      let yy = h2 * Math.sin(currentAngle) + h2;
      let p = Z4Math.shear(xx, yy, sx, sy);
      points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    }
    this.polyline = new Z4Polyline(points);
  }
}
