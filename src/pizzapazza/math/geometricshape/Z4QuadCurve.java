package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import simulation.bezier.$Bezier;
import simulation.js.$Object;

/**
 * The quadratic bezier curve
 *
 * @author gianpiero.diblasi
 */
public class Z4QuadCurve extends Z4AbstractBezierCurve {

  private final double ctrlx;
  private final double ctrly;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx The x-axis coordinate of the first control point of the curve
   * @param ctrly The y-axis coordinate of the first control point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  public Z4QuadCurve(double x1, double y1, double ctrlx, double ctrly, double x2, double y2) {
    super(Z4GeometricShapeType.QUAD, x1, y1, x2, y2);

    this.ctrlx = ctrlx;
    this.ctrly = ctrly;

    this.bezier = new $Bezier(this.x1, this.y1, this.ctrlx, this.ctrly, this.x2, this.y2);
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return new Array<>(new Z4Point(this.x1, this.y1), new Z4Point(this.ctrlx, this.ctrly), new Z4Point(this.x2, this.y2));
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1, 1, 2);
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    if (pointIndex == 0) {
      return new Z4QuadCurve(x, y, this.ctrlx, this.ctrly, this.x2, this.y2);
    } else if (pointIndex == 1) {
      return new Z4QuadCurve(this.x1, this.y1, x, y, this.x2, this.y2);
    } else if (pointIndex == 2) {
      return new Z4QuadCurve(this.x1, this.y1, this.ctrlx, this.ctrly, x, y);
    } else {
      return this;
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("ctrlx", this.ctrlx);
    json.$set("ctrly", this.ctrly);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    return json;
  }

  /**
   * Creates a Z4QuadCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4QuadCurve fromJSON($Object json) {
    return new Z4QuadCurve(
            json.$get("x1"), json.$get("y1"),
            json.$get("ctrlx"), json.$get("ctrly"),
            json.$get("x2"), json.$get("y2")
    );
  }

  /**
   * Creates a Z4QuadCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4QuadCurve fromSize(int width, int height) {
    return new Z4QuadCurve(
            width / 4, height / 2,
            width / 2, height / 4,
            3 * width / 4, height / 2
    );
  }
}
