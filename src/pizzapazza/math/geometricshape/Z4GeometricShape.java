package pizzapazza.math.geometricshape;

import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;

/**
 * The common interface of all geometric shapes
 *
 * @author gianpiero.diblasi
 */
public interface Z4GeometricShape {

  /**
   * Returns the nearest polyline
   *
   * @return The nearest polyline
   */
  public Z4Polyline getPolyline();

  /**
   * Returns the distance from a given point of this geometric shape
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance from a given point of this geometric shape
   */
  public double distance(double x, double y);

  /**
   * Returns The length of this geometric shape
   *
   * @return The length of this geometric shape
   */
  public double getLength();

  /**
   * Returns the point of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The point of this geometric shape at a given position
   */
  public Z4Point getPointAt(double position);

  /**
   * Returns the tangent vector of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector of this geometric shape at a given position
   */
  public Z4Vector getTangentAt(double position);
}
