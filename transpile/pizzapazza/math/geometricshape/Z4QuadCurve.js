/**
 * The quadratic bezier curve
 *
 * @author gianpiero.diblasi
 */
class Z4QuadCurve extends Z4AbstractBezierCurve {

   ctrlx = 0.0;

   ctrly = 0.0;

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
  constructor(x1, y1, ctrlx, ctrly, x2, y2) {
    super(Z4GeometricShapeType.QUAD, x1, y1, x2, y2);
    this.ctrlx = ctrlx;
    this.ctrly = ctrly;
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx, this.ctrly, this.x2, this.y2);
  }

   toJSON() {
    let json = super.toJSON();
    json["x1"] = this.x1;
    json["y1"] = this.y1;
    json["ctrlx"] = this.ctrlx;
    json["ctrly"] = this.ctrly;
    json["x2"] = this.x2;
    json["y2"] = this.y2;
    return json;
  }

  /**
   * Creates a Z4QuadCurve from a JSON object
   *
   * @param json The JSON object
   * @return the geometric shape
   */
  static  fromJSON(json) {
    return new Z4QuadCurve(json["x1"], json["y1"], json["ctrlx"], json["ctrly"], json["x2"], json["y2"]);
  }
}
