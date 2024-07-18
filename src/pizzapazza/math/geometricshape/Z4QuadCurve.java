package pizzapazza.math.geometricshape;

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
   * @return the geometric shape
   */
  public static Z4QuadCurve fromJSON($Object json) {
    return new Z4QuadCurve(
            json.$get("x1"), json.$get("y1"),
            json.$get("ctrlx"), json.$get("ctrly"),
            json.$get("x2"), json.$get("y2")
    );
  }
}
