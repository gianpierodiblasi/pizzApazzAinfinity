/**
 * The spirograph
 *
 * @author gianpiero.di.blasi
 */
class Z4Spirograph extends Z4PointIterator {

   center = new Object();

   clones = new Array();

   clonePos = 0;

   fromClones = false;

  /**
   * Creates a Z4Spirograph
   */
  constructor() {
    super();
    this.z4Point.setUseVectorModuleAsSize(true);
    this.P["x"] = 0;
    this.P["y"] = 0;
  }

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.center["x"] = x;
      this.center["y"] = y;
      this.hasNext = false;
      this.clones = new Array();
      this.fromClones = false;
      return false;
    } else if (action === Z4Action.CONTINUE) {
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return true;
    } else if (action === Z4Action.STOP) {
      this.fromClones = true;
      this.clonePos = this.clones.length - 1;
      this.hasNext = this.clonePos !== -1;
      return true;
    } else {
      return false;
    }
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      let clone = this.clones[this.clonePos];
      clone.setColorPosition(this.clonePos / this.clones.length);
      clone.setDrawBounds(false);
      this.clonePos--;
      this.hasNext = this.clonePos !== -1;
      return clone;
    } else {
      let vector = Z4Vector.fromPoints(this.center["x"], this.center["y"], this.P["x"], this.P["y"]);
      let angle = this.rotation.next(vector.getPhase());
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.center["x"], this.center["y"], vector.getModule(), angle));
      this.rotation.nextSide(this.z4Point, vector);
      this.progression.next(this.z4Point);
      if (this.z4Point.isDrawBounds()) {
        this.clones.push(this.z4Point.clone());
      }
      this.hasNext = false;
      return this.z4Point;
    }
  }

   drawDemo(context, width, height) {
    let arrowPainter = new Z4ArrowPainter();
    let gradientColor = new Z4GradientColor();
    let points = this.initDraw(width, height);
    let start = points[0];
    this.draw(Z4Action.START, start["x"], start["y"]);
    points.slice(1).forEach(point => {
      this.draw(Z4Action.CONTINUE, point["x"], point["y"]);
      this.drawDemoPoint(context, arrowPainter, gradientColor);
    });
    let stop = points[points.length - 1];
    this.draw(Z4Action.STOP, stop["x"], stop["y"]);
    this.drawDemoPoint(context, arrowPainter, gradientColor);
  }

   initDraw(w, h) {
    let w2 = w / 2;
    let h2 = h / 2;
    let wh8 = Math.min(w, h) / 16;
    let array = new Array();
    let size = parseInt(w * h / (100 * 100));
    for (let i = 0; i < size; i++) {
      let theta = Z4Math.TWO_PI * i / size;
      let point = new Object();
      point["x"] = w2 + wh8 * theta * Math.cos(theta);
      point["y"] = h2 + wh8 * theta * Math.sin(theta);
      array.push(point);
    }
    return array;
  }

   drawDemoPoint(context, arrowPainter, gradientColor) {
    let next = null;
    while ((next = this.next()) !== null) {
      let vector = next.getZ4Vector();
      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      arrowPainter.draw(context, next, gradientColor);
      context.restore();
    }
  }
}
