package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Point;

/**
 * An elliptic curve
 *
 * @author gianpiero.diblasi
 */
public class Z4EllipseFrame extends Z4GeometricFrame {

  private final double startAngle;
  private final double extentAngle;

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
  public Z4EllipseFrame(double x, double y, double w, double h, double angle, double sx, double sy, double startAngle, double extentAngle) {
    super(x, y, w, h, angle, sx, sy);

    this.startAngle = startAngle;
    this.extentAngle = extentAngle;

    double w2 = (w - 1) / 2;
    double h2 = (h - 1) / 2;
    double incAngle = extentAngle / Z4GeometricCurve.APPROX_SEGMENTS;

    Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenate(Z4AffineTransform.rotate(angle)).concatenate(Z4AffineTransform.shear(sx, sy));

    Array<Z4Point> points = new Array<>();
    for (int i = 0; i <= Z4GeometricCurve.APPROX_SEGMENTS; i++) {
      double currentAngle = startAngle + incAngle * i;
      double xx = w2 * Math.cos(currentAngle) + w2;
      double yy = h2 * Math.sin(currentAngle) + h2;
      points.push(tx.transform(xx, yy));
    }
    this.polyline = new Z4Polyline(points);
  }
}
