package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.bezier.$Bezier;
import simulation.js.$Object;

/**
 * The cubic bezier curve
 *
 * @author gianpiero.diblasi
 */
public class Z4BezierCurve extends Z4AbstractBezierCurve {

  private final double ctrlx1;
  private final double ctrly1;
  private final double ctrlx2;
  private final double ctrly2;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx1 The x-axis coordinate of the first control point of the curve
   * @param ctrly1 The y-axis coordinate of the first control point of the curve
   * @param ctrlx2 The x-axis coordinate of the second control point of the
   * curve
   * @param ctrly2 The y-axis coordinate of the second control point of the
   * curve
   * @param x2 The x-axis coordinate of the end point of the curve
   * @param y2 The y-axis coordinate of the end point of the curve
   */
  public Z4BezierCurve(double x1, double y1, double ctrlx1, double ctrly1, double ctrlx2, double ctrly2, double x2, double y2) {
    super(Z4GeometricShapeType.BEZIER, x1, y1, x2, y2);

    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;

    this.bezier = new $Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return new Array<>(new Z4Point(this.x1, this.y1), new Z4Point(this.ctrlx1, this.ctrly1), new Z4Point(this.ctrlx2, this.ctrly2), new Z4Point(this.x2, this.y2));
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    return new Array<>(0, 1, 1, 2, 2, 3);
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    if (pointIndex == 0) {
      return new Z4BezierCurve(x, y, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
    } else if (pointIndex == 1) {
      return new Z4BezierCurve(this.x1, this.y1, x, y, this.ctrlx2, this.ctrly2, this.x2, this.y2);
    } else if (pointIndex == 2) {
      return new Z4BezierCurve(this.x1, this.y1, this.ctrlx1, this.ctrly1, x, y, this.x2, this.y2);
    } else if (pointIndex == 3) {
      return new Z4BezierCurve(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, x, y);
    } else {
      return this;
    }
  }

  @Override
  public Z4GeometricShape fromRotation(double cx, double cy, double angle) {
    Z4Point p1 = Z4Math.rotoTranslate(this.x1 - cx, this.y1 - cy, angle, cx, cy);
    Z4Point ctrl1 = Z4Math.rotoTranslate(this.ctrlx1 - cx, this.ctrly1 - cy, angle, cx, cy);
    Z4Point ctrl2 = Z4Math.rotoTranslate(this.ctrlx2 - cx, this.ctrly2 - cy, angle, cx, cy);
    Z4Point p2 = Z4Math.rotoTranslate(this.x2 - cx, this.y2 - cy, angle, cx, cy);
    return new Z4BezierCurve(p1.x, p1.y, ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, p2.x, p2.y);
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("x1", this.x1);
    json.$set("y1", this.y1);
    json.$set("ctrlx1", this.ctrlx1);
    json.$set("ctrly1", this.ctrly1);
    json.$set("ctrlx2", this.ctrlx2);
    json.$set("ctrly2", this.ctrly2);
    json.$set("x2", this.x2);
    json.$set("y2", this.y2);
    return json;
  }

  /**
   * Creates a Z4BezierCurve from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  public static Z4BezierCurve fromJSON($Object json) {
    return new Z4BezierCurve(
            json.$get("x1"), json.$get("y1"),
            json.$get("ctrlx1"), json.$get("ctrly1"),
            json.$get("ctrlx2"), json.$get("ctrly2"),
            json.$get("x2"), json.$get("y2")
    );
  }

  /**
   * Creates a Z4BezierCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4BezierCurve fromSize(int width, int height) {
    return new Z4BezierCurve(
            width / 4, height / 2,
            3 * width / 8, height / 4,
            5 * width / 8, height / 4,
            3 * width / 4, height / 2
    );
  }
}
