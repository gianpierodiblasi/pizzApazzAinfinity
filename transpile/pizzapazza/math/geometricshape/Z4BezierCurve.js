/**
 * The cubic bezier curve
 *
 * @author gianpiero.diblasi
 */
class Z4BezierCurve extends Z4AbstractBezierCurve {

   ctrlx1 = 0.0;

   ctrly1 = 0.0;

   ctrlx2 = 0.0;

   ctrly2 = 0.0;

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
  constructor(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
    super(Z4GeometricShapeType.BEZIER, x1, y1, x2, y2);
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

   toJSON() {
    let json = super.toJSON();
    json["x1"] = this.x1;
    json["y1"] = this.y1;
    json["ctrlx1"] = this.ctrlx1;
    json["ctrly1"] = this.ctrly1;
    json["ctrlx2"] = this.ctrlx2;
    json["ctrly2"] = this.ctrly2;
    json["x2"] = this.x2;
    json["y2"] = this.y2;
    return json;
  }

  /**
   * Creates a Z4BezierCurve from a JSON object
   *
   * @param json The JSON object
   * @return the geometric shape
   */
  static  fromJSON(json) {
    return new Z4BezierCurve(json["x1"], json["y1"], json["ctrlx1"], json["ctrly1"], json["ctrlx2"], json["ctrly2"], json["x2"], json["y2"]);
  }
}
