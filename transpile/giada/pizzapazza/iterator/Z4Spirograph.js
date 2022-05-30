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
      if (this.progression === Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(false);
        this.nextColorPosition();
      } else if (this.progression === Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression === Z4Progression.RELATIVE_TO_PATH) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(true);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression === Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(Math.random());
      }
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
    this.draw(Z4Action.START, width / 2, height / 2);
    this.draw(Z4Action.CONTINUE, 3 * width / 4, 3 * height / 4);
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
