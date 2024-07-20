package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.js.$Object;

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
  public Z4EllipseFrame(double x, double y, double w, double h, double angle, double sx, double sy, double startAngle, double extentAngle) {
    super(Z4GeometricShapeType.ELLIPSE, x, y, w, h, angle, sx, sy);

    this.startAngle = startAngle;
    this.extentAngle = extentAngle;

    double incAngle = extentAngle / Z4GeometricCurve.APPROX_SEGMENTS;

    Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);

    Array<Z4Point> points = new Array<>();
    for (int i = 0; i <= Z4GeometricCurve.APPROX_SEGMENTS; i++) {
      double currentAngle = startAngle + incAngle * i;
      double xx = w * Math.cos(currentAngle);
      double yy = h * Math.sin(currentAngle);
      points.push(tx.transform(xx, yy));
    }
    this.polyline = new Z4Polyline(points);
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    double w2 = this.w - 5;
    double h2 = this.h - 5;
    Z4AffineTransform tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sx, this.sy);

    Array<Z4Point> controlPoints = super.getControlPoints();
    controlPoints.push(tx.transform(w2 * Math.cos(this.startAngle), h2 * Math.sin(this.startAngle)));
    controlPoints.push(tx.transform(w2 * Math.cos(this.startAngle + this.extentAngle), h2 * Math.sin(this.startAngle + this.extentAngle)));
    return controlPoints;
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    Array<Integer> controlPointConnections = super.getControlPointConnections();
    controlPointConnections.push(0, 3, 0, 4);
    return controlPointConnections;
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    return null;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("startAngle", this.startAngle);
    json.$set("extentAngle", this.extentAngle);
    return json;
  }

  /**
   * Creates a Z4EllipseFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4EllipseFrame fromJSON($Object json) {
    return new Z4EllipseFrame(
            json.$get("x"), json.$get("y"),
            json.$get("w"), json.$get("h"),
            json.$get("angle"),
            json.$get("sx"), json.$get("sy"),
            json.$get("startAngle"), json.$get("extentAngle"));
  }

  /**
   * Creates a Z4EllipseFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4EllipseFrame fromSize(int width, int height) {
    return new Z4EllipseFrame(
            width / 2, height / 2,
            width / 4, height / 4,
            0,
            0, 0,
            0, Z4Math.TWO_PI
    );
  }
}
