package pizzapazza.math.geometricshape;

import def.js.Array;
import def.js.Number;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Array;

/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
public class Z4Polyline implements Z4GeometricShape {

  private final Array<Z4Point> points;
  private final double len;

  /**
   * Creates the object
   *
   * @param points The points
   */
  public Z4Polyline(Array<Z4Point> points) {
    super();
    this.points = points.map(point -> point);

    this.len = this.points.
            map((point, index, array) -> index == 0 ? 0 : Z4Math.distance(point.x, point.y, array.$get(index - 1).x, array.$get(index - 1).y)).
            reduce((accumulator, current, index, array) -> accumulator + current);
  }

  @Override
  public Z4Polyline getPolyline() {
    return this;
  }

  @Override
  public double distance(double x, double y) {
    return this.points.
            map((point, index, array) -> index == 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array.$get(index - 1).x, array.$get(index - 1).y, x, y)).
            reduce((accumulator, current, index, array) -> Math.min(accumulator, current));
  }

  /**
   * Concatenates this polyline with another polyline
   *
   * @param polyline The other polyline
   * @return The concatenation of this polyline with the other polyline
   */
  public Z4Polyline concat(Z4Polyline polyline) {
    return new Z4Polyline((($Array<Z4Point>) this.points).concat(polyline.points));
  }

  @Override
  public double getLength() {
    return this.len;
  }

  @Override
  public Z4Point getPointAt(double position) {
    double cumLen = 0;
    position *= this.len;

    for (int index = 1; index < this.points.length; index++) {
      double distance = Z4Math.distance(this.points.$get(index).x, this.points.$get(index).y, this.points.$get(index - 1).x, this.points.$get(index - 1).y);

      if (cumLen <= position && position <= cumLen + distance) {
        double div = (position - cumLen) / distance;
        double x = (this.points.$get(index).x - this.points.$get(index - 1).x) * div + this.points.$get(index - 1).x;
        double y = (this.points.$get(index).y - this.points.$get(index - 1).y) * div + this.points.$get(index - 1).y;
        return new Z4Point(x, y);
      } else {
        cumLen += distance;
      }
    }

    return this.points.$get(this.points.length - 1);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    double cumLen = 0;
    position *= this.len;

    for (int index = 1; index < this.points.length; index++) {
      double distance = Z4Math.distance(this.points.$get(index).x, this.points.$get(index).y, this.points.$get(index - 1).x, this.points.$get(index - 1).y);

      if (cumLen <= position && position <= cumLen + distance) {
        return Z4Vector.fromPoints(this.points.$get(index - 1).x, this.points.$get(index - 1).y, this.points.$get(index).x, this.points.$get(index).y);
      } else {
        cumLen += distance;
      }
    }

    return Z4Vector.fromPoints(
            this.points.$get(this.points.length - 2).x, this.points.$get(this.points.length - 2).y,
            this.points.$get(this.points.length - 1).x, this.points.$get(this.points.length - 1).y
    );
  }
}
