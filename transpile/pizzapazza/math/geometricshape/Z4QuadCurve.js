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

   getControlPoints() {
    return new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.ctrlx, this.ctrly), new Z4Point(this.x2, this.y2));
  }

   getControlPointConnections() {
    return new Array(0, 1, 1, 2);
  }

   fromDataChanged(x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 0) {
      return new Z4QuadCurve(x, y, this.ctrlx, this.ctrly, this.x2, this.y2);
    } else if (pointIndex === 1) {
      return new Z4QuadCurve(this.x1, this.y1, x, y, this.x2, this.y2);
    } else if (pointIndex === 2) {
      return new Z4QuadCurve(this.x1, this.y1, this.ctrlx, this.ctrly, x, y);
    } else {
      return this;
    }
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
   * @return The geometric shape
   */
  static  fromJSON(json) {
    return new Z4QuadCurve(json["x1"], json["y1"], json["ctrlx"], json["ctrly"], json["x2"], json["y2"]);
  }

  /**
   * Creates a Z4QuadCurve contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4QuadCurve(width / 4, height / 2, width / 2, height / 4, 3 * width / 4, height / 2);
  }
}
