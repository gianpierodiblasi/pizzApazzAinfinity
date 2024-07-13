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
