package pizzapazza.math.geometricshape;

import def.js.Array;
import def.js.Number;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
public class Z4Polyline implements Z4GeometricShape {

  private final Array<Z4Point> points;

  /**
   * Creates the object
   *
   * @param points The points
   */
  public Z4Polyline(Array<Z4Point> points) {
    super();
    this.points = points.map(point -> point);
  }

  /**
   * Returns the start point
   *
   * @return The start point
   */
  public Z4Point getP1() {
    return this.points.$get(0);
  }

  /**
   * Returns the end point
   *
   * @return The end point
   */
  public Z4Point getP2() {
    return this.points.$get(this.points.length - 1);
  }

  /**
   * Returns the internal points
   *
   * @return The internal points
   */
  public Array<Z4Point> getInternalPoints() {
    return this.points.slice(1, this.points.length - 1);
  }

  @Override
  public Z4Polyline getPolyline() {
    return this;
  }

  @Override
  public double distance(double x, double y) {
    return this.points.
            map((point, index, array) -> index == 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array.$get(index - 1).x, array.$get(index - 1).x, x, y)).
            reduce((accumulator, current, index, array) -> Math.min(accumulator, current));
  }

}
