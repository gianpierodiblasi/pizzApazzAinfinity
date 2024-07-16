package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;

/**
 * A geometric shape described by a single point
 *
 * @author gianpiero.diblasi
 */
public class Z4SinglePointShape implements Z4GeometricShape {

  private final double x;
  private final double y;

  public Z4SinglePointShape(double x, double y) {
    this.x = x;
    this.y = y;
  }

  @Override
  public Z4Polyline getPolyline() {
    return new Z4Polyline(new Array<>(new Z4Point(x, y), new Z4Point(x, y)));
  }

  @Override
  public double distance(double x, double y) {
    return Z4Math.distance(this.x, this.y, x, y);
  }

  @Override
  public double getLength() {
    return 0;
  }

  @Override
  public Z4Point getPointAt(double position) {
    return new Z4Point(this.x, this.y);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    return Z4Vector.fromVector(this.x, this.y, 0, 0);
  }
}
