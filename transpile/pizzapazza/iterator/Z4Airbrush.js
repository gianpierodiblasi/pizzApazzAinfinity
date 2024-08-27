/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4Airbrush extends Z4PointIterator {

   multiplicity = null;

   radius = 0;

   speed = 0;

   gaussianCorrection = 0;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param radius The radius
   * @param speed The speed
   * @param gaussianCorrection The gaussian correction
   * @param rotation The rotation
   */
  constructor(multiplicity, radius, speed, gaussianCorrection, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.radius = radius;
    this.speed = speed;
    this.gaussianCorrection = gaussianCorrection;
  }

   getType() {
    return Z4PointIteratorType.AIRBRUSH;
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
   * Returns the radius
   *
   * @return The radius
   */
   getRadius() {
    return this.radius;
  }

  /**
   * Returns the speed
   *
   * @return The speed
   */
   getSpeed() {
    return this.speed;
  }

  /**
   * Returns the gaussian correction
   *
   * @return The gaussian correction
   */
   getGaussianCorrection() {
    return this.gaussianCorrection;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return true;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let currentRadius = this.radius * Z4Math.randomCorrected(this.gaussianCorrection / 10.0);
      let currenAngle = Z4Math.TWO_PI * Math.random();
      let angle = this.rotation.next(currenAngle);
      let vector = Z4Vector.fromVector(this.currentPoint.x + currentRadius * Math.cos(currenAngle), currentRadius * Math.sin(currenAngle) + this.currentPoint.y, 1, angle);
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL && this.currentMultiplicityCounter === 1) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        temporalPosition = currentRadius / this.radius;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, this.rotation.computeSide(vector, null), false);
      return this.nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return 0;
  }

   isInfinitePointGenerator() {
    return true;
  }

   getInfinitePointGeneratorSleep() {
    return parseInt(250 / this.speed);
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    painter = painter ? painter : new Z4ArrowPainter();
    spatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    progression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    this.drawAction(Z4PointIteratorDrawingAction.START, progression, width / 2, height / 2);
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (valueIsAdjusting) {
        next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
      }
      context.save();
      context.translate(next.z4Vector.x0, next.z4Vector.y0);
      context.rotate(next.z4Vector.phase);
      painter.draw(context, next, spatioTemporalColor, progression);
      context.restore();
    }
    this.drawAction(Z4PointIteratorDrawingAction.STOP, progression, width / 2, height / 2);
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["radius"] = this.radius;
    json["speed"] = this.speed;
    json["gaussianCorrection"] = this.gaussianCorrection;
    return json;
  }

  /**
   * Creates a Z4Airbrush from a JSON object
   *
   * @param json The JSON object
   * @return the airbrush
   */
  static  fromJSON(json) {
    return new Z4Airbrush(Z4FancifulValue.fromJSON(json["multiplicity"]), json["radius"], json["speed"], json["gaussianCorrection"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
