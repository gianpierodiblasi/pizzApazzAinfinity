package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4AffineTransform;
import pizzapazza.math.Z4InfiniteLine;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.ui.panel.math.geometricshape.Z4GeometricShapePreview;
import pizzapazza.util.Z4JSONable;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The common interface of all geometric shapes (and paths)
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4GeometricShape implements Z4JSONable {

  private final Z4GeometricShapeType type;
  private Z4GeometricShapePreview geometricShapePreview;

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
   * Connects this geometric shape with another geometric shape by means of a
   * bezier curve
   *
   * @param shape The other shape
   * @param width The available area width
   * @param height The available area height
   * @return The new geometric shape
   */
  public Z4GeometricShape connect(Z4GeometricShape shape, int width, int height) {
    Z4Vector p1 = this.getTangentAt(1);
    Z4InfiniteLine line1 = new Z4InfiniteLine(p1.x0, p1.y0, p1.x, p1.y);
    Z4Vector p2 = shape.getTangentAt(0);
    Z4InfiniteLine line2 = new Z4InfiniteLine(p2.x0, p2.y0, p2.x, p2.y);

    Z4Point ctrl = line1.getIntersectionPoint(line2);
    if (!$exists(ctrl)) {
      ctrl = new Z4Point((p1.x0 + p2.x0) / 2, (p1.y0 + p2.y0) / 2);
    }
    ctrl = this.getPoint(p1.x0, p1.y0, ctrl.x, ctrl.y, Z4Math.distance(p1.x0, p1.y0, ctrl.x, ctrl.y), Z4Math.atan(p1.x0, p1.y0, ctrl.x, ctrl.y), width, height);

    return new Z4GeometricShapeSequence(new Array<>(this, new Z4BezierCurve(p1.x0, p1.y0, ctrl.x, ctrl.y, ctrl.x, ctrl.y, p2.x0, p2.y0), shape));
  }

  private Z4Point getPoint(double cx, double cy, double x, double y, double radius, double angle, int width, int height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

  /**
   * Checks if this geometric shape is a path (it is not closed)
   *
   * @return true this geometric shape is a path (it is not closed), false
   * otherwise
   */
  public abstract boolean isPath();

  /**
   * Returns the path describing this geometric shape
   *
   * @param withDirection true to show an arrow representing the direction of
   * the path, false otherwise
   * @return The path describing this geometric shape
   */
  public abstract $Path2D getPath2D(boolean withDirection);

  /**
   * Draws a direction arrow in a path
   *
   * @param path The path
   */
  protected void drawDirection($Path2D path) {
    Z4Vector vector = this.getTangentAt(0.5);

    Z4AffineTransform tx = Z4AffineTransform.translate(vector.x0, vector.y0).concatenateRotate(vector.phase);
    path.moveTo(vector.x0, vector.y0);

    Z4Point p = tx.transform(-20, -10);
    path.lineTo(p.x, p.y);
    p = tx.transform(-20, +10);
    path.lineTo(p.x, p.y);

    path.lineTo(vector.x0, vector.y0);
  }

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
   * Returns the button configurations to control/edit the geometri shape
   *
   * @return The button configurations to control/edit the geometri shape
   */
  public abstract Array<Z4GeometricShapeButtonConfiguration> getButtonConfigurations();

  /**
   * Returns a Z4GeometricShape obtained by this Z4GeometricShape when a data
   * (point or spinner) is changed
   *
   * @param controlPoints The control points
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
  public abstract Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height);

  /**
   * Returns a Z4GeometricShape obtained after a canvas resize in order to fit
   * the new dimensions
   *
   * @param width The new width
   * @param height The new height
   * @return The geometric shape
   */
  public Z4GeometricShape fromResize(int width, int height) {
    switch ("" + this.type) {
      case "POINT":
      case "LINE":
      case "POLYLINE":
      case "ELLIPSE":
      case "RECTANGLE":
      case "ROUND_RECTANGLE":
      case "QUAD":
      case "BEZIER":
      case "SINUSOIDAL":
      case "SPIRAL":
        return $exists(this.getControlPoints().find((point, index, array) -> point.x >= width || point.y >= height)) ? Z4GeometricShape.fromSize(this.type, width, height) : this;
      case "SEQUENCE":
      default:
        return null;
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("type", this.type);
    return json;
  }

  /**
   * Sets the geometric shape preview
   *
   * @param geometricShapePreview The geometric shape preview
   */
  public void setGeometricShapePreview(Z4GeometricShapePreview geometricShapePreview) {
    this.geometricShapePreview = geometricShapePreview;
  }

  /**
   * Returns the geometric shape preview
   *
   * @return The geometric shape preview
   */
  public Z4GeometricShapePreview getGeometricShapePreview() {
    return this.geometricShapePreview;
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
      case "ELLIPSE":
        return Z4EllipseFrame.fromJSON(json);
      case "RECTANGLE":
        return Z4RectangleFrame.fromJSON(json);
      case "ROUND_RECTANGLE":
        return Z4RoundRectangleFrame.fromJSON(json);
      case "QUAD":
        return Z4QuadCurve.fromJSON(json);
      case "BEZIER":
        return Z4BezierCurve.fromJSON(json);
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
      case "ELLIPSE":
        return Z4EllipseFrame.fromSize(width, height);
      case "RECTANGLE":
        return Z4RectangleFrame.fromSize(width, height);
      case "ROUND_RECTANGLE":
        return Z4RoundRectangleFrame.fromSize(width, height);
      case "QUAD":
        return Z4QuadCurve.fromSize(width, height);
      case "BEZIER":
        return Z4BezierCurve.fromSize(width, height);
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
