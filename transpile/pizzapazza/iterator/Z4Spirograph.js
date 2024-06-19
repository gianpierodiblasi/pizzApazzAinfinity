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
      this.nextdDrawingPoint = new Z4DrawingPoint(clone.z4Vector, clone.intensity, this.clonePos / this.clones.length, false, clone.side, clone.useVectorModuleAsSize);
      this.clonePos--;
      this.hasNext = this.clonePos !== -1;
      return this.nextdDrawingPoint;
    } else {
      let currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);
      let drawBounds = false;
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        drawBounds = true;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.hasNext = false;
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, drawBounds, this.rotation.computeSide(vector, currentVector), true);
      if (this.nextdDrawingPoint.drawBounds) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

   getNextCount() {
    return this.clones.length;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalSpatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    let finalColorProgression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);
    let points = this.initDraw(width, height);
    let start = points[0];
    this.drawAction(Z4PointIteratorDrawingAction.START, start.x, start.y);
    points.slice(1).forEach(point => {
      this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, point.x, point.y);
      this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression);
    });
    let stop = points[points.length - 1];
    this.drawAction(Z4PointIteratorDrawingAction.STOP, stop.x, stop.y);
    this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression);
  }

   initDraw(w, h) {
    let w2 = w / 2;
    let h2 = h / 2;
    let wh8 = Math.min(w, h) / 16;
    let size = parseInt(w * h / (100 * 100));
    let array = new Array();
    for (let i = 0; i < size; i++) {
      let theta = Z4Math.TWO_PI * i / size;
      array.push(new Z4Point(w2 + wh8 * theta * Math.cos(theta), h2 + wh8 * theta * Math.sin(theta)));
    }
    return array;
  }

   drawDemoPoint(context, arrowPainter, spatioTemporalColor, progression) {
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (!next.drawBounds) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        arrowPainter.draw(context, next, spatioTemporalColor, progression);
        context.restore();
      }
    }
  }

  /**
   * Creates a Z4Spirograph from a JSON object
   *
   * @param json The JSON object
   * @return the spirograph
   */
  static  fromJSON(json) {
    return new Z4Spirograph(Z4Rotation.fromJSON(json["rotation"]));
  }
}
