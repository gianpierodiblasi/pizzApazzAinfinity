package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import simulation.js.$Apply_1_V;
import simulation.js.$Array;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

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
    super(Z4GeometricShapeType.SEQUENCE);

    this.shapes = shapes.map(shape -> shape);
    this.polyline = this.shapes.map(shape -> shape.getPolyline()).reduce((accumulator, current, index, array) -> accumulator.concat(current));
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return this.shapes.map(shape -> shape.getControlPoints()).reduce((accumulator, current, index, array) -> (($Array<Z4Point>) accumulator).concat(current));
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    Array<Integer> controlPointConnections = new Array<>();
    this.shapes.map(shape -> shape.getControlPointConnections()).forEach(cpc -> cpc.map(value -> value + controlPointConnections.length).forEach(value -> controlPointConnections.push(value)));
    return controlPointConnections;
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return this.shapes.map(shape -> shape.getSpinnerConfigurations()).reduce((accumulator, current, index, array) -> (($Array<Z4GeometricShapeSpinnerConfiguration>) accumulator).concat(current));
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    $Object objForControlPoints = this.getChangedGeometricShape(pointIndex, index -> this.shapes.$get(index).getControlPoints().length);
    $Object objForSpinnerConfigurations = this.getChangedGeometricShape(spinnerIndex, index -> this.shapes.$get(index).getSpinnerConfigurations().length);

    Array<Z4GeometricShape> newShapes = this.shapes;
    if ($exists(objForControlPoints)) {
      newShapes = newShapes.map(shape -> shape == objForControlPoints.$get("shape") ? shape.fromDataChanged(shape.getControlPoints(), x, y, objForControlPoints.$get("index"), spinnerValue, -1, width, height) : shape);
    }
    if ($exists(objForSpinnerConfigurations)) {
      newShapes = newShapes.map(shape -> shape == objForSpinnerConfigurations.$get("shape") ? shape.fromDataChanged(shape.getControlPoints(), x, y, -1, spinnerValue, objForSpinnerConfigurations.$get("index"), width, height) : shape);
    }
    return newShapes != this.shapes ? new Z4GeometricShapeSequence(newShapes) : this;
  }

  private $Object getChangedGeometricShape(int indexToFind, $Apply_1_V<Integer, Integer> apply) {
    int index = 0;
    Z4GeometricShape shape = null;

    while (indexToFind != -1 && !$exists(shape) && index < this.shapes.length) {
      int len = apply.$apply(index);
      if (indexToFind < len) {
        shape = this.shapes.$get(index);
      } else {
        indexToFind -= len;
        index++;
      }
    }

    $Object obj = new $Object();
    obj.$set("shape", shape);
    obj.$set("index", indexToFind);
    return $exists(shape) ? obj : null;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    Array<$Object> shapesJSON = new Array<>();
    this.shapes.forEach(shape -> shapesJSON.push(shape.toJSON()));
    json.$set("shapes", shapesJSON);

    return json;
  }

  /**
   * Creates a Z4GeometricShapeSequence from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  @SuppressWarnings("unchecked")
  public static Z4GeometricShapeSequence fromJSON($Object json) {
    Array<Z4GeometricShape> shapes = new Array<>();
    ((Iterable<$Object>) json.$get("shapes")).forEach(shapeJSON -> shapes.push(Z4GeometricShape.fromJSON(shapeJSON)));
    return new Z4GeometricShapeSequence(shapes);
  }
}
