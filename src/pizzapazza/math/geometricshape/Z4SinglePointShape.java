package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

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
}
