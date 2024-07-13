package pizzapazza.math.geometricshape;

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
}
