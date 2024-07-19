package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.js.$Object;

/**
 * A rectangular curve with rounded vertices
 *
 * @author gianpiero.diblasi
 */
public class Z4RoundRectangleFrame extends Z4GeometricFrame {

  private final static double ADVANCE = 0.15;
  private final static int ROUND_APPROX_SEGMENTS = 16;

  /**
   * Creates the object
   *
   * @param x The x location of the rounded rectangle (not rotated)
   * @param y The y location of the rounded rectangle (not rotated)
   * @param w The width of the rounded rectangle (not sheared)
   * @param h The height of the rounded rectangle (not sheared)
   * @param angle The rotation angle of the rounded rectangle
   * @param sx The x shear of the rounded rectangle
   * @param sy The y shear of the rounded rectangle
   */
  public Z4RoundRectangleFrame(double x, double y, double w, double h, double angle, double sx, double sy) {
    super(Z4GeometricShapeType.ROUND_RECTANGLE, x, y, w, h, angle, sx, sy);

    double min = Math.min(w, h);
    double advance = min * Z4RoundRectangleFrame.ADVANCE;
    Z4AffineTransform tx = Z4AffineTransform.translate(x, y).concatenateRotate(angle).concatenateShear(sx, sy);

    Array<Z4Point> points = new Array<>();
    points.push(tx.transform(advance, 0)); //First point NW
    points.push(tx.transform(w - 1 - advance, 0)); //Second point NE
    this.createArc(points, tx, advance, Z4Math.HALF_THREE_PI, w - 1 - advance, advance); //Arc NE
    points.push(tx.transform(w - 1, h - 1 - advance)); //Third point SE
    this.createArc(points, tx, advance, 0, w - 1 - advance, h - 1 - advance); //Arc SE
    points.push(tx.transform(advance, h - 1)); //fourth point SW
    this.createArc(points, tx, advance, Z4Math.HALF_PI, advance, h - 1 - advance); //Arc SW
    points.push(tx.transform(0, advance)); //fifth point NW
    this.createArc(points, tx, advance, Math.PI, advance, advance); //Arc NW
    points.push(points.$get(0));
    this.polyline = new Z4Polyline(points);
  }

  private void createArc(Array<Z4Point> points, Z4AffineTransform tx, double advance, double startAngle, double dx, double dy) {
    for (int i = 1; i < Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS; i++) {
      double angle = startAngle + Z4Math.HALF_PI * i / Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS;
      double xx = advance * Math.cos(angle);
      double yy = advance * Math.sin(angle);

      points.push(tx.transform(xx + dx, yy + dy));
    }
  }

  @Override
  public Z4GeometricShape fromDataChanged(double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    return null;
  }
  
  /**
   * Creates a Z4RoundRectangleFrame from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4RoundRectangleFrame fromJSON($Object json) {
    return new Z4RoundRectangleFrame(
            json.$get("x"), json.$get("y"),
            json.$get("w"), json.$get("h"),
            json.$get("angle"),
            json.$get("sx"), json.$get("sy"));
  }

  /**
   * Creates a Z4RoundRectangleFrame contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4RoundRectangleFrame fromSize(int width, int height) {
    return new Z4RoundRectangleFrame(
            width / 4, height / 4,
            width / 2, height / 2,
            0,
            0, 0
    );
  }
}
