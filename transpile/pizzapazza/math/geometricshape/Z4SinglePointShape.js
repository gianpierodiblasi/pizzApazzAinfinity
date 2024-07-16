/**
 * A geometric shape described by a single point
 *
 * @author gianpiero.diblasi
 */
class Z4SinglePointShape extends Z4GeometricShape {

   x = 0.0;

   y = 0.0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

   getPolyline() {
    return new Z4Polyline(new Array(new Z4Point(x, y), new Z4Point(x, y)));
  }

   distance(x, y) {
    return Z4Math.distance(this.x, this.y, x, y);
  }

   getLength() {
    return 0;
  }

   getPointAt(position) {
    return new Z4Point(this.x, this.y);
  }

   getTangentAt(position) {
    return Z4Vector.fromVector(this.x, this.y, 0, 0);
  }
}
