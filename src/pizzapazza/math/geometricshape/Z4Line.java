package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;

/**
 * The line
 *
 * @author gianpiero.diblasi
 */
public class Z4Line implements Z4GeometricShape {

  public final double x1;
  public final double y1;
  public final double x2;
  public final double y2;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  public Z4Line(double x1, double y1, double x2, double y2) {
    super();

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  @Override
  public Z4Polyline getPolyline() {
    return new Z4Polyline(new Array<>(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2)));
  }

  @Override
  public double distance(double x, double y) {
    return Z4Math.ptSegDist(this.x1, this.y1, this.x2, this.y2, x, y);
  }

  @Override
  public double getLength() {
    return Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
  }

  @Override
  public Z4Point getPointAt(double position) {
    double x = (this.x2 - this.x1) * position + this.x1;
    double y = (this.y2 - this.y1) * position + this.y1;
    return new Z4Point(x, y);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    if (position != 1) {
      Z4Point point = this.getPointAt(position);
      return Z4Vector.fromPoints(point.x, point.y, this.x2, this.y2);
    } else {
      return Z4Vector.fromVector(this.x2, this.y2, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    }
  }
}
