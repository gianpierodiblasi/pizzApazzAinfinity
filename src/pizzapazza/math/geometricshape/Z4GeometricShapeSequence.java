package pizzapazza.math.geometricshape;

import def.js.Array;

/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeSequence extends Z4GeometricCurve {

  private final Array<Z4GeometricShape> shapes;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  public Z4GeometricShapeSequence(Array<Z4GeometricShape> shapes) {
    this.shapes = shapes;
    this.polyline = this.shapes.map(shape -> shape.getPolyline()).reduce((accumulator, current, index, array) -> accumulator.concat(current));
  }
}
