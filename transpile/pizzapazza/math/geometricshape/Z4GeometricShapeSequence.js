/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShapeSequence extends Z4GeometricShape {

   shapes = null;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  constructor(shapes) {
    super(Z4GeometricShapeType.SEQUENCE);
    this.shapes = shapes.map(shape => shape);
  }

   getPath2D() {
    let path = new Path2D();
    this.shapes.forEach(shape => path.addPath(shape.getPath2D()));
    return path;
  }

   distance(x, y) {
    return this.shapes.map(shape => shape.distance(x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

   getLength() {
    return this.shapes.map(shape => shape.getLength()).reduce((accumulator, current, index, array) => accumulator + current);
  }

   getPointAt(position) {
    return this.getAt(position, (index, pos) => this.shapes[index].getPointAt(pos));
  }

   getTangentAt(position) {
    return this.getAt(position, (index, pos) => this.shapes[index].getTangentAt(pos));
  }

   getAt(position, apply) {
    position *= parseInt(this.getLength());
    for (let index = 0; index < this.shapes.length; index++) {
      let len = this.shapes[index].getLength();
      if (position < len) {
        return apply(index, position / len);
      } else {
        position -= len;
      }
    }
    return apply(this.shapes.length - 1, 1.0);
  }

   getControlPoints() {
    return this.shapes.map(shape => shape.getControlPoints()).reduce((accumulator, current, index, array) => (accumulator).concat(current));
  }

   getControlPointConnections() {
    let cumCount = new Array();
    let controlPointConnections = new Array();
    this.shapes.forEach((shape, index, array) => {
      if (index === 0) {
        cumCount.push(shape.getControlPoints().length);
        shape.getControlPointConnections().forEach(value => controlPointConnections.push(value));
      } else {
        cumCount.push(cumCount[index - 1] + shape.getControlPoints().length);
        shape.getControlPointConnections().forEach(value => controlPointConnections.push(value + cumCount[index - 1]));
      }
    });
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
