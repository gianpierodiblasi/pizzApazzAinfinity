package pizzapazza.math.geometricshape;

import def.js.Array;

/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeSequence implements Z4GeometricShape {

  private final Array<Z4GeometricShape> shapes;
  private final Z4Polyline polyline;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  public Z4GeometricShapeSequence(Array<Z4GeometricShape> shapes) {
    this.shapes = shapes;
    this.polyline = this.shapes.map(shape -> shape.getPolyline()).reduce((accumulator, current, index, array) -> accumulator.concat(current));
  }

  @Override
  public Z4Polyline getPolyline() {
    return this.polyline;
  }

  @Override
  public double distance(double x, double y) {
    return this.polyline.distance(x, y);
  }
}
