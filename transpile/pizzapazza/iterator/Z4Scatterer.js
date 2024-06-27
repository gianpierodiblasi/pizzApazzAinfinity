/**
 * The scatterer
 *
 * @author gianpiero.diblasi
 */
class Z4Scatterer extends Z4PointIterator {

   multiplicity = null;

   scattering = null;

   before = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param scattering The scattering
   * @param rotation The rotation
   */
  constructor(multiplicity, scattering, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.scattering = scattering;
  }

   getType() {
    return Z4PointIteratorType.SCATTERER;
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
   * Returns the scattering
   *
   * @return The scattering
   */
   getScattering() {
    return this.scattering;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.before = this.currentPoint;
      this.hasNext = false;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      return false;
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
      let nextScattering = this.scattering.next() / 10;
      let currentVector = Z4Vector.fromPoints(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.currentPoint.x + currentVector.module * nextScattering * Math.cos(angle), this.currentPoint.y + currentVector.module * nextScattering * Math.sin(angle), 1, angle);
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, this.rotation.computeSide(vector, currentVector), false);
      return this.nextdDrawingPoint;
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
    this.initDraw(width, height).forEach((point, index, array) => {
      this.drawAction(index ? Z4PointIteratorDrawingAction.CONTINUE : Z4PointIteratorDrawingAction.START, point.x, point.y);
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
    let coordinates = new Array(1, 49, 2, 48, 4, 47, 7, 42, 10, 40, 12, 38, 15, 42);
    for (let i = 0; i < coordinates.length; i += 2) {
      array.push(new Z4Point(w * coordinates[i] / 50, h * coordinates[i + 1] / 50));
    }
    return array;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["scattering"] = this.scattering.toJSON();
    return json;
  }

  /**
   * Creates a Z4Scatterer from a JSON object
   *
   * @param json The JSON object
   * @return the scatterer
   */
  static  fromJSON(json) {
    return new Z4Scatterer(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["scattering"]), Z4Rotation.fromJSON(json["rotation"]));
  }
}
