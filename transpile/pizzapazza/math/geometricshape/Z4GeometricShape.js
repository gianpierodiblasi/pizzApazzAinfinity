/**
 * The common interface of all geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShape {

  /**
   * Returns the nearest polyline
   *
   * @return The nearest polyline
   */
   getPolyline() {
  }

  /**
   * Returns the distance from a given point of this geometric shape
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance from a given point of this geometric shape
   */
   distance(x, y) {
  }

  /**
   * Returns The length of this geometric shape
   *
   * @return The length of this geometric shape
   */
   getLength() {
  }

  /**
   * Returns the point of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The point of this geometric shape at a given position
   */
   getPointAt(position) {
  }

  /**
   * Returns the tangent vector of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector of this geometric shape at a given position
   */
   getTangentAt(position) {
  }
}
