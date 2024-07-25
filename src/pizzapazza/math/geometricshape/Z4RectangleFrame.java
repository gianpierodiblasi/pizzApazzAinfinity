package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.js.$Object;

/**
 * A rectangular curve
 *
 * @author gianpiero.diblasi
 */
public class Z4RectangleFrame extends Z4GeometricFrame {

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
  public Z4RectangleFrame(double x, double y, double w, double h, double angle, double sx, double sy) {
    super(Z4GeometricShapeType.RECTANGLE, x, y, w, h, angle, sx, sy);

    Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);

    Array<Z4Point> points = new Array<>();
    points.push(tx.transform(-w, -h));
    points.push(tx.transform(w, -h));
    points.push(tx.transform(w, h));
    points.push(tx.transform(-w, h));
    points.push(points.$get(0));
    this.polyline = new Z4Polyline(points);
  }

  @Override
  protected Z4GeometricFrame fromParameters(double x, double y, double w, double h, double angle, double sx, double sy) {
    return new Z4RectangleFrame(x, y, w, h, angle, sx, sy);
  }

  @Override
  public Z4GeometricShape fromRotation(double cx, double cy, double angle) {
    Z4Point p = Z4Math.rotoTranslate(this.x - cx, this.y - cy, angle, cx, cy);
    return new Z4RectangleFrame(p.x, p.y, this.w, this.h, this.angle, this.sx, this.sy);
  }

  /**
   * Creates a Z4RectangleFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4RectangleFrame fromJSON($Object json) {
    return new Z4RectangleFrame(
            json.$get("x"), json.$get("y"),
            json.$get("w"), json.$get("h"),
            json.$get("angle"),
            json.$get("sx"), json.$get("sy"));
  }

  /**
   * Creates a Z4RectangleFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4RectangleFrame fromSize(int width, int height) {
    return new Z4RectangleFrame(
            width / 2, height / 2,
            width / 4, height / 4,
            0,
            0, 0
    );
  }
}
