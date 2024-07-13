/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeSequence extends Z4GeometricShape {

   shapes = null;

   polyline = null;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  constructor(shapes) {
    this.shapes = shapes;
    this.polyline = this.shapes.map(shape => shape.getPolyline()).reduce((accumulator, current, index, array) => accumulator.concat(current));
  }

   getPolyline() {
    return this.polyline;
  }

   distance(x, y) {
    return this.polyline.distance(x, y);
  }
}
