/**
 * The path for a Z4Tracer
 *
 * @author gianpiero.di.blasi
 */
class Z4TracerPath {

   surplus = 0.0;

   step = 0.0;

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   x3 = 0.0;

   y3 = 0.0;

   bezierCurve = null;

   bezierCurveLength = 0.0;

   length = 0.0;

   position = 0.0;

  /**
   * Creates a Z4TracerPath from a line
   *
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  static  fromLine(x1, y1, x2, y2, surplus, step) {
    let path = new Z4TracerPath();
    path.x1 = x1;
    path.y1 = y1;
    path.x2 = x2;
    path.y2 = y2;
    return path.init(surplus, step);
  }

  /**
   * Creates a Z4TracerPath from a quadric Bezier curve followed by a line
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx The x-axis coordinate of the control point of the curve
   * @param ctrly The y-axis coordinate of the control point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param x3 The x-axis coordinate of the end point of the line
   * @param y3 The y-axis coordinate of the end point of the line
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  static  fromQuadAndLine(x1, y1, ctrlx, ctrly, x2, y2, x3, y3, surplus, step) {
    let path = new Z4TracerPath();
    path.bezierCurve = new Bezier(x1, y1, ctrlx, ctrly, x2, y2);
    path.bezierCurveLength = path.bezierCurve.length();
    path.x2 = x2;
    path.y2 = y2;
    path.x3 = x3;
    path.y3 = y3;
    return path.init(surplus, step);
  }

   init(surplus, step) {
    this.surplus = surplus;
    this.step = step;
    this.length = this.bezierCurve ? this.bezierCurveLength + Z4Math.distance(this.x2, this.y2, this.x3, this.y3) : Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
    this.position = surplus;
    return this;
  }

  /**
   * Checks if this path has more points
   *
   * @return true if this path has more points, false otherwise
   */
   hasNext() {
    return this.length > this.position;
  }

  /**
   * Returns the next tangent vector
   *
   * @return The next tangent vector, null if the path has no more points
   */
   next() {
    if (!this.hasNext()) {
      return null;
    } else if (!this.bezierCurve) {
      let t = this.position / this.length;
      let x = (this.x2 - this.x1) * t + this.x1;
      let y = (this.y2 - this.y1) * t + this.y1;
      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    } else if (this.position < this.bezierCurveLength) {
      let t = this.position / this.bezierCurveLength;
      let point = this.bezierCurve.get(t);
      let derivative = this.bezierCurve.derivative(t);
      this.position += this.step;
      return Z4Vector.fromPoints(point.x, point.y, point.x + derivative.x, point.y + derivative.y);
    } else {
      let t = (this.position - this.bezierCurveLength) / (this.length - this.bezierCurveLength);
      let x = (this.x3 - this.x2) * t + this.x2;
      let y = (this.y3 - this.y2) * t + this.y2;
      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x2, this.y2, this.x3, this.y3));
    }
  }

  /**
   * Returns the tangent vector in a position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector
   */
   getTangentAt(position) {
    // let tangent = this._gPath.tangentAt(position);
    // return Z4Vector.fromPoints(tangent.start.x, tangent.start.y, tangent.end.x, tangent.end.y);
    return null;
  }

  /**
   * Restarts the path
   *
   * @return This Z4TracerPath
   */
   restart() {
    this.position = this.surplus;
    return this;
  }

  /**
   * Returns the path length
   *
   * @return The path length
   */
   getLength() {
    return this.length;
  }

  /**
   * Returns the new surplus for the next path
   *
   * @return The new surplus for the next path
   */
   getNewSurplus() {
    return this.position - this.length;
  }

  /**
   * Returns the number of available points in the path
   *
   * @return The number of available points in the path
   */
   getPointCount() {
    return parseInt((this.length - this.surplus) / this.step);
  }
}
