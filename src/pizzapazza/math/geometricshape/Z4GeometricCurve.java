package pizzapazza.math.geometricshape;

import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Path2D;

/**
 * Common abstract object for geometric curves. A <i>Z4GeometricCurve</i> is a
 * geometric shape representing a generic curve
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4GeometricCurve extends Z4GeometricShape {

  /**
   * The nearest polyline representing the curve
   */
  protected Z4Polyline polyline;

  /**
   * The number of segments to approximate the curve with a polyline
   */
  protected final static int APPROX_SEGMENTS = 64;

  /**
   * Creates the object
   *
   * @param type The type
   */
  public Z4GeometricCurve(Z4GeometricShapeType type) {
    super(type);
  }

  @Override
  public $Path2D getPath2D(boolean withDirection) {
    return this.polyline.getPath2D(withDirection);
  }

  @Override
  public double distance(double x, double y) {
    return this.polyline.distance(x, y);
  }

  @Override
  public double getLength() {
    return this.polyline.getLength();
  }

  @Override
  public Z4Point getPointAt(double position) {
    return this.polyline.getPointAt(position);
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    return this.polyline.getTangentAt(position);
  }
}
