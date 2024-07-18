/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeSequence extends Z4GeometricCurve {

   shapes = null;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  constructor(shapes) {
    super(Z4GeometricShapeType.SEQUENCE);
    this.shapes = shapes;
    this.polyline = this.shapes.map(shape => shape.getPolyline()).reduce((accumulator, current, index, array) => accumulator.concat(current));
  }

   toJSON() {
    let json = super.toJSON();
    let shapesJSON = new Array();
    this.shapes.forEach(shape => shapesJSON.push(shape.toJSON()));
    json["shapes"] = shapesJSON;
    return json;
  }

  /**
   * Creates a Z4GeometricShapeSequence from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    let shapes = new Array();
    (json["shapes"]).forEach(shapeJSON => shapes.push(Z4GeometricShape.fromJSON(shapeJSON)));
    return new Z4GeometricShapeSequence(shapes);
  }
}
