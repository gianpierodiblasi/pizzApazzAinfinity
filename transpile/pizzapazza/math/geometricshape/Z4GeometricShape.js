/**
 * The common interface of all geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricShape extends Z4JSONable {

   type = null;

  /**
   * Creates the object
   *
   * @param type The type
   */
  constructor(type) {
    super();
    this.type = type;
  }

  /**
   * Returns the nearest polyline
   *
   * @return The nearest polyline
   */
   getPolyline() {
  }

  /**
   * Returns the distance from a given point of this geometric shape
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance from a given point of this geometric shape
   */
   distance(x, y) {
  }

  /**
   * Returns The length of this geometric shape
   *
   * @return The length of this geometric shape
   */
   getLength() {
  }

  /**
   * Returns the point of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The point of this geometric shape at a given position
   */
   getPointAt(position) {
  }

  /**
   * Returns the tangent vector of this geometric shape at a given position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector of this geometric shape at a given position
   */
   getTangentAt(position) {
  }

  /**
   * Returns the points to control/edit the geometric shape
   *
   * @return The points to control/edit the geometric shape
   */
   getControlPoints() {
  }

  /**
   * Returns the connections between the control points
   *
   * @return The connections between the control points, as an array where even
   * positions contains the indices of the starting point of the connections and
   * odd positions contains the indices of the ending point of the connections
   */
   getControlPointConnections() {
  }

  /**
   * Returns the spinner configurations to control/edit the geometri shape
   *
   * @return The spinner configurations to control/edit the geometri shape
   */
   getSpinnerConfigurations() {
  }

   toJSON() {
    let json = new Object();
    json["type"] = this.type;
    return json;
  }

  /**
   * Creates a Z4GeometricShape from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    switch("" + json["type"]) {
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
