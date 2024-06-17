/**
 * The spirograph
 *
 * @author gianpiero.diblasi
 */
class Z4Spirograph extends Z4PointIterator {

   center = null;

   clones = new Array();

   clonePos = 0;

   fromClones = false;

  /**
   * Creates the object
   *
   * @param rotation The rotation
   */
  constructor(rotation) {
    super(rotation);
  }

   getType() {
    return Z4PointIteratorType.SPIROGRAPH;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.center = new Z4Point(x, y);
      this.hasNext = false;
      this.clones = new Array();
      this.fromClones = false;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = this.clones.length - 1;
      this.hasNext = this.clonePos !== -1;
      return true;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      let clone = this.clones[this.clonePos];
      this.clonePos--;
      this.hasNext = this.clonePos !== -1;
      return new Z4DrawingPoint(clone.z4Vector, clone.intensity, this.clonePos / this.clones.length, clone.spatialPosition, false, clone.side, clone.useVectorModuleAsSize);
    } else {
      let currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);
      let drawBounds = false;
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      let spatialPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.spatialPosition : -1;
      if (color.isColor()) {
      } else if (color.isGradientColor()) {
        switch("" + progression.getColorProgressionBehavior()) {
          case "SPATIAL":
            break;
          case "TEMPORAL":
            temporalPosition = progression.next(temporalPosition);
            break;
          case "RELATIVE_TO_PATH":
            drawBounds = true;
            break;
          case "RANDOM":
            temporalPosition = Math.random();
            break;
        }
      } else if (color.isBiGradientColor()) {
        switch("" + progression.getColorProgressionBehavior()) {
          case "TEMPORAL":
            temporalPosition = progression.next(temporalPosition);
            break;
          case "RELATIVE_TO_PATH":
            drawBounds = true;
            break;
          case "RANDOM":
            temporalPosition = Math.random();
            break;
        }
      }
      this.hasNext = false;
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, spatialPosition, drawBounds, this.rotation.computeSide(vector, currentVector), true);
      if (this.nextdDrawingPoint.drawBounds) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }
}
