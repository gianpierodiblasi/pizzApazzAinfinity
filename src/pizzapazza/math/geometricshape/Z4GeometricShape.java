package pizzapazza.math.geometricshape;

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
   * @return the geometric shape
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
}
