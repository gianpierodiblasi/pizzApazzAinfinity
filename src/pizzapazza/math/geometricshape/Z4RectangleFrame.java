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
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    if (pointIndex == 0) {
      Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      Z4Point point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);

      return new Z4RectangleFrame(x, y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), this.angle, this.sx, this.sy);
    } else if (pointIndex == 1) {
      double angle1 = Z4Math.atan(this.x, this.y, x, y);
      Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle1).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = txInverse.transform(x, y);
      Z4Point point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);

      return new Z4RectangleFrame(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle1, this.sx, this.sy);
    } else if (pointIndex == 2) {
      double angle2 = Z4Math.atan(this.x, this.y, x, y) - Z4Math.HALF_PI;
      Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle2).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      Z4AffineTransform txInverse = tx.inverse();

      Z4Point point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      Z4Point point2 = txInverse.transform(x, y);

      return new Z4RectangleFrame(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle2, this.sx, this.sy);
    } else if (spinnerIndex == 0) {
      return new Z4RectangleFrame(this.x, this.y, this.w, this.h, this.angle, spinnerValue, this.sy);
    } else if (spinnerIndex == 1) {
      return new Z4RectangleFrame(this.x, this.y, this.w, this.h, this.angle, this.sx, spinnerValue);
    } else {
      return this;
    }
  }

  private Z4Point getPoint(Z4AffineTransform tx, Z4Point point, double w, double h, int width, int height) {
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
