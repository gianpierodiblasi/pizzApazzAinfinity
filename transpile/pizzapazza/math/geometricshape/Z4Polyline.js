/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
class Z4Polyline extends Z4GeometricShape {

   points = new Array();

  /**
   * Returns the start point
   *
   * @return The start point
   */
   getP1() {
    return this.points[0];
  }

  /**
   * Returns the end point
   *
   * @return The end point
   */
   getP2() {
    return this.points[this.points.length - 1];
  }

  /**
   * Returns the internal points
   *
   * @return The internal points
   */
   getInternalPoints() {
    return this.points.slice(1, this.points.length - 1);
  }

   getPolyline() {
    return this;
  }

   distance(x, y) {
    return this.points.map((point, index, array) => index === 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array[index - 1].x, array[index - 1].x, x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }
}
