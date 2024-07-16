/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
class Z4Polyline extends Z4GeometricShape {

   points = null;

  /**
   * Creates the object
   *
   * @param points The points
   */
  constructor(points) {
    super();
    this.points = points.map(point => point);
  }

   getPolyline() {
    return this;
  }

   distance(x, y) {
    return this.points.map((point, index, array) => index === 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array[index - 1].x, array[index - 1].x, x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

  /**
   * Concatenates this polyline with another polyline
   *
   * @param polyline The other polyline
   * @return The concatenation of this polyline with the other polyline
   */
   concat(polyline) {
    return new Z4Polyline((this.points).concat(polyline.points));
  }
}