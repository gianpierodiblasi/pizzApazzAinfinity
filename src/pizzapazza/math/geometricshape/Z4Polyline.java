package pizzapazza.math.geometricshape;

import def.js.Array;
import def.js.Number;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Array;
import static simulation.js.$Globals.$exists;

/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
public class Z4Polyline implements Z4GeometricShape {

  private final Array<Z4Point> points;
  private final Array<Double> cumLen = new $Array<>();

  /**
   * Creates the object
   *
   * @param points The points
   */
  public Z4Polyline(Array<Z4Point> points) {
    super();
    this.points = points.map(point -> point);

    this.points.forEach((point, index, array) -> {
      if (index == 0) {
        this.cumLen.push(0.0);
      } else {
        this.cumLen.push(this.cumLen.$get(index - 1) + Z4Math.distance(point.x, point.y, array.$get(index - 1).x, array.$get(index - 1).y));
      }
    });
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
    return this.cumLen.$get(this.cumLen.length - 1);
  }

  @Override
  public Z4Point getPointAt(double position) {
    double finalPos = position * this.cumLen.$get(this.cumLen.length - 1);
    int index = this.cumLen.findIndex(pos -> pos >= finalPos, null);

    if (this.cumLen.$get(index) == finalPos) {
      return this.points.$get(index);
    } else if (this.cumLen.$get(index - 1) == finalPos) {
      return this.points.$get(index - 1);
    } else {
      double div = (finalPos - this.cumLen.$get(index - 1)) / (this.cumLen.$get(index) - this.cumLen.$get(index - 1));
      double x = (this.points.$get(index).x - this.points.$get(index - 1).x) * div + this.points.$get(index - 1).x;
      double y = (this.points.$get(index).y - this.points.$get(index - 1).y) * div + this.points.$get(index - 1).y;
      return new Z4Point(x, y);
    }
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    double finalPos = position * this.cumLen.$get(this.cumLen.length - 1);
    int index = this.cumLen.findIndex(pos -> pos >= finalPos, null);

    if (this.cumLen.$get(index) == finalPos) {
      if (!$exists(index)) {
        index = 1;
      }

      return Z4Vector.fromPoints(this.points.$get(index - 1).x, this.points.$get(index - 1).y, this.points.$get(index).x, this.points.$get(index).y);
    } else if (this.cumLen.$get(index - 1) == finalPos) {
      return Z4Vector.fromPoints(this.points.$get(index - 1).x, this.points.$get(index - 1).y, this.points.$get(index).x, this.points.$get(index).y);
    } else {
      double div = (finalPos - this.cumLen.$get(index - 1)) / (this.cumLen.$get(index) - this.cumLen.$get(index - 1));
      double x = (this.points.$get(index).x - this.points.$get(index - 1).x) * div + this.points.$get(index - 1).x;
      double y = (this.points.$get(index).y - this.points.$get(index - 1).y) * div + this.points.$get(index - 1).y;
      return Z4Vector.fromPoints(x, y, this.points.$get(index).x, this.points.$get(index).y);
    }
  }
}
