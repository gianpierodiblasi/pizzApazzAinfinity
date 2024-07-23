/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeSequence extends Z4GeometricShape {

   shapes = null;

   polylines = null;

   polyline = null;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  constructor(shapes) {
    super(Z4GeometricShapeType.SEQUENCE);
    this.shapes = shapes.map(shape => shape);
    this.polylines = this.shapes.map(shape => shape.getPolyline());
    this.polyline = this.shapes.map(shape => shape.getPolyline()).reduce((accumulator, current, index, array) => accumulator.concat(new Z4Polyline(new Array(null))).concat(current));
  }

   getPolyline() {
    return this.polyline;
  }

   distance(x, y) {
    return this.polylines.map(poly => poly.distance(x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

   getLength() {
    return this.polylines.map(poly => poly.getLength()).reduce((accumulator, current, index, array) => accumulator + current);
  }

   getPointAt(position) {
    return this.getAt(position, (index, pos) => this.polylines[index].getPointAt(pos));
  }

   getTangentAt(position) {
    return this.getAt(position, (index, pos) => this.polylines[index].getTangentAt(pos));
  }

   getAt(position, apply) {
    position *= this.getLength();
    let index = 0;
    let len = this.polylines[index].getLength();
    while (len < position) {
      position -= len;
      index++;
      len = this.polylines[index].getLength();
    }
    return apply(index, position / len);
  }

   getControlPoints() {
    return this.shapes.map(shape => shape.getControlPoints()).reduce((accumulator, current, index, array) => (accumulator).concat(current));
  }

   getControlPointConnections() {
    let controlPointConnections = new Array();
    this.shapes.map(shape => shape.getControlPointConnections()).forEach(cpc => cpc.map(value => value + controlPointConnections.length).forEach(value => controlPointConnections.push(value)));
    return controlPointConnections;
  }

   getSpinnerConfigurations() {
    return this.shapes.map(shape => shape.getSpinnerConfigurations()).reduce((accumulator, current, index, array) => (accumulator).concat(current));
  }

   getButtonConfigurations() {
    return this.shapes.map(shape => shape.getButtonConfigurations()).reduce((accumulator, current, index, array) => (accumulator).concat(current));
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    let objForControlPoints = this.getChangedGeometricShape(pointIndex, index => this.shapes[index].getControlPoints().length);
    let objForSpinnerConfigurations = this.getChangedGeometricShape(spinnerIndex, index => this.shapes[index].getSpinnerConfigurations().length);
    let newShapes = this.shapes;
    if (objForControlPoints) {
      newShapes = newShapes.map(shape => shape === objForControlPoints["shape"] ? shape.fromDataChanged(shape.getControlPoints(), x, y, objForControlPoints["index"], spinnerValue, -1, width, height) : shape);
    }
    if (objForSpinnerConfigurations) {
      newShapes = newShapes.map(shape => shape === objForSpinnerConfigurations["shape"] ? shape.fromDataChanged(shape.getControlPoints(), x, y, -1, spinnerValue, objForSpinnerConfigurations["index"], width, height) : shape);
    }
    return newShapes !== this.shapes ? new Z4GeometricShapeSequence(newShapes) : this;
  }

   getChangedGeometricShape(indexToFind, apply) {
    let index = 0;
    let shape = null;
    while (indexToFind !== -1 && !shape && index < this.shapes.length) {
      let len = apply(index);
      if (indexToFind < len) {
        shape = this.shapes[index];
      } else {
        indexToFind -= len;
        index++;
      }
    }
    let obj = new Object();
    obj["shape"] = shape;
    obj["index"] = indexToFind;
    return shape ? obj : null;
  }

   fromResize(width, height) {
    return new Z4GeometricShapeSequence(this.shapes.map(shape => shape.fromResize(width, height)));
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
