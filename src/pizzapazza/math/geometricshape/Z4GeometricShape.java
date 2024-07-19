package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.util.Z4JSONable;
import simulation.js.$Object;

/**
 * The common interface of all geometric shapes
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4GeometricShape implements Z4JSONable {

  private final Z4GeometricShapeType type;

  /**
   * Creates the object
   *
   * @param type The type
   */
  public Z4GeometricShape(Z4GeometricShapeType type) {
    super();
    this.type = type;
  }

  /**
   * Returns the nearest polyline
   *
   * @return The nearest polyline
   */
  public abstract Z4Polyline getPolyline();

  /**
   * Returns the distance from a given point of this geometric shape
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance from a given point of this geometric shape
   */
  public abstract double distance(double x, double y);

  /**
   * Returns The length of this geometric shape
   *
   * @return The length of this geometric shape
   */
  public abstract double getLength();

  /**
   * Returns the point of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The point of this geometric shape at a given position
   */
  public abstract Z4Point getPointAt(double position);

  /**
   * Returns the tangent vector of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector of this geometric shape at a given position
   */
  public abstract Z4Vector getTangentAt(double position);

  /**
   * Returns the points to control/edit the geometric shape
   *
   * @return The points to control/edit the geometric shape
   */
  public abstract Array<Z4Point> getControlPoints();

  /**
   * Returns the connections between the control points
   *
   * @return The connections between the control points, as an array where even
   * positions contains the indices of the starting point of the connections and
   * odd positions contains the indices of the ending point of the connections
   */
  public abstract Array<Integer> getControlPointConnections();

  /**
   * Returns the spinner configurations to control/edit the geometri shape
   *
   * @return The spinner configurations to control/edit the geometri shape
   */
  public abstract Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations();

  /**
   * Returns a Z4GeometricShape obtained by this Z4GeometricShape when a data
   * (point or spinner) is changed
   *
   * @param x The x-axis coordinate of the changed point
   * @param y The y-axis coordinate of the changed point
   * @param pointIndex The index of the changed point, -1 if no point is changed
   * @param spinnerValue The changed spinner value
   * @param spinnerIndex The index of the changed spinner value, -1 if no
   * spinner is changed
   * @param width The available area width
   * @param height The available area height
   * @return The geometric shape
   */
  public abstract Z4GeometricShape fromDataChanged(double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height);

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("type", this.type);
    return json;
  }

  /**
   * Creates a Z4GeometricShape from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4GeometricShape fromJSON($Object json) {
    switch ("" + json.$get("type")) {
      case "POINT":
        return Z4SinglePointShape.fromJSON(json);
      case "LINE":
        return Z4Line.fromJSON(json);
      case "POLYLINE":
        return Z4Polyline.fromJSON(json);
      case "BEZIER":
        return Z4BezierCurve.fromJSON(json);
      case "ELLIPSE":
        return Z4EllipseFrame.fromJSON(json);
      case "RECTANGLE":
        return Z4RectangleFrame.fromJSON(json);
      case "ROUND_RECTANGLE":
        return Z4RoundRectangleFrame.fromJSON(json);
      case "SINUSOIDAL":
        return Z4SinusoidalCurve.fromJSON(json);
      case "SPIRAL":
        return Z4SpiralCurve.fromJSON(json);
      case "SEQUENCE":
        return Z4GeometricShapeSequence.fromJSON(json);
      default:
        return null;
    }
  }

  /**
   * Creates a Z4GeometricShape contained in a given size
   *
   * @param type The type
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4GeometricShape fromSize(Z4GeometricShapeType type, int width, int height) {
    switch ("" + type) {
      case "POINT":
        return Z4SinglePointShape.fromSize(width, height);
      case "LINE":
        return Z4Line.fromSize(width, height);
      case "POLYLINE":
        return Z4Polyline.fromSize(width, height);
      case "BEZIER":
        return Z4BezierCurve.fromSize(width, height);
      case "ELLIPSE":
        return Z4EllipseFrame.fromSize(width, height);
      case "RECTANGLE":
        return Z4RectangleFrame.fromSize(width, height);
      case "ROUND_RECTANGLE":
        return Z4RoundRectangleFrame.fromSize(width, height);
      case "SINUSOIDAL":
        return Z4SinusoidalCurve.fromSize(width, height);
      case "SPIRAL":
        return Z4SpiralCurve.fromSize(width, height);
      case "SEQUENCE":
      default:
        return null;
    }
  }
}
