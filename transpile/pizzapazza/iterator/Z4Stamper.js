/**
 * The stamper
 *
 * @author gianpiero.diblasi
 */
class Z4Stamper extends Z4PointIterator {

   multiplicity = null;

   push = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param rotation The rotation
   */
  constructor(multiplicity, push, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
  }

   getType() {
    return Z4PointIteratorType.STAMPER;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
   getPush() {
    return this.push;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let vector = null;
      let angle = this.rotation.next(0.0);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 1, angle);
      }
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, false, this.rotation.computeSide(vector, null), false);
      return nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return 0;
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
    this.initDraw(width, height).forEach(point => {
      this.drawAction(Z4PointIteratorDrawingAction.START, point.x, point.y);
      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Constants.getStyle("black");
      context.beginPath();
      context.arc(this.currentPoint.x, this.currentPoint.y, 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();
      let next = null;
      while ((next = this.next(spatioTemporalColor, finalColorProgression)) !== null) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        finalPainter.draw(context, next, finalSpatioTemporalColor, finalColorProgression);
        context.restore();
      }
    });
  }

   initDraw(w, h) {
    let array = new Array();
    for (let x = 50; x <= w; x += 100) {
      for (let y = 50; y <= h; y += 100) {
        array.push(new Z4Point(x, y));
      }
    }
    return array;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["push"] = this.push.toJSON();
    return json;
  }

  /**
   * Creates a Z4Stamper from a JSON object
   *
   * @param json The JSON object
   * @return the stamper
   */
  static  fromJSON(json) {
    return new Z4Stamper(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["push"]), Z4Rotation.fromJSON(json["rotation"]));
  }
}
