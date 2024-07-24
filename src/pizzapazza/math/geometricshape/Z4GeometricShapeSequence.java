package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import simulation.js.$Apply_1_V;
import simulation.js.$Apply_2_V;
import simulation.js.$Array;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * A sequence of geometric shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeSequence extends Z4GeometricShape {

  private final Array<Z4GeometricShape> shapes;

  /**
   * Creates the object
   *
   * @param shapes The sequence of geometric shapes
   */
  public Z4GeometricShapeSequence(Array<Z4GeometricShape> shapes) {
    super(Z4GeometricShapeType.SEQUENCE);

    this.shapes = shapes.map(shape -> shape);
  }

  @Override
  public boolean isPath() {
    return this.shapes.map(shape -> shape.isPath()).reduce((accumulator, current, index, array) -> accumulator && current);
  }

  @Override
  public $Path2D getPath2D() {
    $Path2D path = new $Path2D();
    this.shapes.forEach(shape -> path.addPath(shape.getPath2D()));
    return path;
  }

  @Override
  public double distance(double x, double y) {
    return this.shapes.map(shape -> shape.distance(x, y)).reduce((accumulator, current, index, array) -> Math.min(accumulator, current));
  }

  @Override
  public double getLength() {
    return this.shapes.map(shape -> shape.getLength()).reduce((accumulator, current, index, array) -> accumulator + current);
  }

  @Override
  public Z4Point getPointAt(double position) {
    return this.getAt(position, (index, pos) -> this.shapes.$get(index).getPointAt(pos));
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    return this.getAt(position, (index, pos) -> this.shapes.$get(index).getTangentAt(pos));
  }

  private <T> T getAt(double position, $Apply_2_V<Integer, Double, T> apply) {
    position *= parseInt(this.getLength());
    for (int index = 0; index < this.shapes.length; index++) {
      double len = this.shapes.$get(index).getLength();
      if (position < len) {
        return apply.$apply(index, position / len);
      } else {
        position -= len;
      }
    }

    return apply.$apply(this.shapes.length - 1, 1.0);
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return this.shapes.map(shape -> shape.getControlPoints()).reduce((accumulator, current, index, array) -> (($Array<Z4Point>) accumulator).concat(current));
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    Array<Integer> cumCount = new $Array<>();
    Array<Integer> controlPointConnections = new Array<>();
    this.shapes.forEach((shape, index, array) -> {
      if (index == 0) {
        cumCount.push(shape.getControlPoints().length);
        shape.getControlPointConnections().forEach(value -> controlPointConnections.push(value));
      } else {
        cumCount.push(cumCount.$get(index - 1) + shape.getControlPoints().length);
        shape.getControlPointConnections().forEach(value -> controlPointConnections.push(value + cumCount.$get(index - 1)));
      }
    });
    return controlPointConnections;
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return this.shapes.map(shape -> shape.getSpinnerConfigurations()).reduce((accumulator, current, index, array) -> (($Array<Z4GeometricShapeSpinnerConfiguration>) accumulator).concat(current));
  }

  @Override
  public Array<Z4GeometricShapeButtonConfiguration> getButtonConfigurations() {
    return this.shapes.map(shape -> shape.getButtonConfigurations()).reduce((accumulator, current, index, array) -> (($Array<Z4GeometricShapeButtonConfiguration>) accumulator).concat(current));
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
  public Z4GeometricShape fromResize(int width, int height) {
    return new Z4GeometricShapeSequence(this.shapes.map(shape -> shape.fromResize(width, height)));
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
