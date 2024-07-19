/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
class Z4Polyline extends Z4GeometricShape {

   points = null;

   cumLen = new Array();

  /**
   * Creates the object
   *
   * @param points The points
   */
  constructor(points) {
    super(Z4GeometricShapeType.POLYLINE);
    this.points = points.map(point => point);
    this.points.forEach((point, index, array) => {
      if (index === 0) {
        this.cumLen.push(0.0);
      } else {
        this.cumLen.push(this.cumLen[index - 1] + Z4Math.distance(point.x, point.y, array[index - 1].x, array[index - 1].y));
      }
    });
  }

   getPolyline() {
    return this;
  }

   distance(x, y) {
    return this.points.map((point, index, array) => index === 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array[index - 1].x, array[index - 1].y, x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

  /**
   * Concatenates this polyline with another polyline
   *
   * @param polyline The other polyline
   * @return The concatenation of this polyline with the other polyline
   */
   concat(polyline) {
    return new Z4Polyline((this.points).concat(polyline.points));
  }

   getLength() {
    return this.cumLen[this.cumLen.length - 1];
  }

   getPointAt(position) {
    let finalPos = position * this.cumLen[this.cumLen.length - 1];
    let index = this.cumLen.findIndex(pos => pos >= finalPos, null);
    if (this.cumLen[index] === finalPos) {
      return this.points[index];
    } else if (this.cumLen[index - 1] === finalPos) {
      return this.points[index - 1];
    } else {
      let div = (finalPos - this.cumLen[index - 1]) / (this.cumLen[index] - this.cumLen[index - 1]);
      let x = (this.points[index].x - this.points[index - 1].x) * div + this.points[index - 1].x;
      let y = (this.points[index].y - this.points[index - 1].y) * div + this.points[index - 1].y;
      return new Z4Point(x, y);
    }
  }

   getTangentAt(position) {
    let finalPos = position * this.cumLen[this.cumLen.length - 1];
    let index = this.cumLen.findIndex(pos => pos >= finalPos, null);
    if (this.cumLen[index] === finalPos) {
      if (!index) {
        index = 1;
      }
      return Z4Vector.fromPoints(this.points[index - 1].x, this.points[index - 1].y, this.points[index].x, this.points[index].y);
    } else if (this.cumLen[index - 1] === finalPos) {
      return Z4Vector.fromPoints(this.points[index - 1].x, this.points[index - 1].y, this.points[index].x, this.points[index].y);
    } else {
      let div = (finalPos - this.cumLen[index - 1]) / (this.cumLen[index] - this.cumLen[index - 1]);
      let x = (this.points[index].x - this.points[index - 1].x) * div + this.points[index - 1].x;
      let y = (this.points[index].y - this.points[index - 1].y) * div + this.points[index - 1].y;
      return Z4Vector.fromPoints(x, y, this.points[index].x, this.points[index].y);
    }
  }

   getControlPoints() {
    return this.points.map(point => point);
  }

   getControlPointConnections() {
    let controlPointConnections = new Array();
    this.points.forEach((point, index, array) => {
      controlPointConnections.push(index);
      if (0 < index && index < this.points.length - 1) {
        controlPointConnections.push(index);
      }
    });
    return controlPointConnections;
  }

   getSpinnerConfigurations() {
    return new Array();
  }

   toJSON() {
    let json = super.toJSON();
    let pointsJSON = new Array();
    this.points.forEach(point => {
      let pointJSON = new Object();
      pointJSON["x"] = point.x;
      pointJSON["y"] = point.y;
      pointsJSON.push(pointJSON);
    });
    json["points"] = pointsJSON;
    return json;
  }

  /**
   * Creates a Z4Polyline from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  static  fromJSON(json) {
    let points = new Array();
    (json["points"]).forEach(pointJSON => points.push(new Z4Point(pointJSON["x"], pointJSON["y"])));
    return new Z4Polyline(points);
  }

  /**
   * Creates a Z4Polyline contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  static  fromSize(width, height) {
    return new Z4Polyline(new Array(new Z4Point(width / 4, height / 2), new Z4Point(width / 2, height / 4), new Z4Point(3 * width / 4, height / 2)));
  }
}
