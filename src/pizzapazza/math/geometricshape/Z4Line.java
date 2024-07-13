package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

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
}
