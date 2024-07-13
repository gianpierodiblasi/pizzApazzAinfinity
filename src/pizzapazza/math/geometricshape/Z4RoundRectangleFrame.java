package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

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
    super(x, y, w, h, angle, sx, sy);

    double min = Math.min(w, h);
    double advance = min * Z4RoundRectangleFrame.ADVANCE;
    Array<Z4Point> points = new Array<>();

    //First point NW
    Z4Point p = Z4Math.shear(advance, 0, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));

    //Second point NE
    p = Z4Math.shear(w - 1 - advance, 0, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));

    //Arc NE
    this.createArc(points, advance, Z4Math.HALF_THREE_PI, w - 1 - advance, advance, x, y, sx, sy);

    //Third point SE
    p = Z4Math.shear(w - 1, h - 1 - advance, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));

    //Arc SE
    this.createArc(points, advance, 0, w - 1 - advance, h - 1 - advance, x, y, sx, sy);

    //fourth point SW
    p = Z4Math.shear(advance, h - 1, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));

    //Arc SW
    this.createArc(points, advance, Z4Math.HALF_PI, advance, h - 1 - advance, x, y, sx, sy);

    //fifth point NW
    p = Z4Math.shear(0, advance, sx, sy);
    points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));

    //Arc NW
    this.createArc(points, advance, Math.PI, advance, advance, x, y, sx, sy);

    points.push(points.$get(0));
    this.polyline = new Z4Polyline(points);
  }

  private void createArc(Array<Z4Point> points, double advance, double startAngle, double dx, double dy, double x, double y, double sx, double sy) {
    for (int i = 1; i < Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS; i++) {
      double angle = startAngle + Z4Math.HALF_PI * i / Z4RoundRectangleFrame.ROUND_APPROX_SEGMENTS;
      double xx = advance * Math.cos(angle);
      double yy = advance * Math.sin(angle);

      Z4Point p = Z4Math.shear(xx + dx, yy + dy, sx, sy);
      points.push(Z4Math.rotoTranslate(p.x, p.y, angle, x, y));
    }
  }
}
