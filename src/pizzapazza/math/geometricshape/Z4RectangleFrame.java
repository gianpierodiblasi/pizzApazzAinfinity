package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Point;

/**
 * A rectangular curve
 *
 * @author gianpiero.diblasi
 */
public class Z4RectangleFrame extends Z4GeometricFrame {

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
  public Z4RectangleFrame(double x, double y, double w, double h, double angle, double sx, double sy) {
    super(x, y, w, h, angle, sx, sy);

    Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);

    Array<Z4Point> points = new Array<>();
    points.push(tx.transform(0, 0));
    points.push(tx.transform(w - 1, 0));
    points.push(tx.transform(w - 1, h - 1));
    points.push(tx.transform(0, h - 1));
    points.push(points.$get(0));
    this.polyline = new Z4Polyline(points);
  }

}
