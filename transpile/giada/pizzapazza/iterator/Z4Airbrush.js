/**
 * The airbrush
 *
 * @author gianpiero.di.blasi
 */
class Z4Airbrush extends Z4PointIterator {

   radius = 50;

   speed = 50;

  // private int id;
   currentSpeed = 0;

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.P["x"] = x;
      this.P["y"] = y;
      this.currentSpeed = 0;
      this.hasNext = true;
      // this.onPaint();
      // this.id = setInternal(() -> this.onPaint(), 500 / this.speed.next());
      return true;
    } else if (action === Z4Action.CONTINUE) {
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return true;
    } else if (action === Z4Action.STOP) {
      // clearInterval(this.id);
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentSpeed++;
      this.hasNext = this.currentSpeed < this.speed;
      let currentRadius = this.radius * Math.random();
      let currenAngle = Z4Math.TWO_PI * Math.random();
      let angle = this.rotation.next(currenAngle);
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"] + currentRadius * Math.cos(currenAngle), this.P["y"] + currentRadius * Math.sin(currenAngle), 1, angle));
      this.rotation.nextSide(this.z4Point, null);
      this.progression.next(this.z4Point);
      if (this.progression.isRelativeToPath()) {
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(currentRadius / this.radius);
      }
      return this.z4Point;
    }
  }

   drawDemo(context, painter, gradientColor, width, height) {
  }
  // private void onPaint() {
  // }
}
