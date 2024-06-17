/**
 * The tracer
 *
 * @author gianpiero.diblasi
 */
class Z4Tracer extends Z4PointIterator {

   multiplicity = null;

   push = null;

   attack = null;

   sustain = null;

   release = null;

   endlessSustain = false;

   step = null;

   path = null;

   before = null;

   envelopeA = 0.0;

   envelopeS = 0.0;

   envelopeR = 0.0;

   envelopeAS = 0.0;

   envelopeASR = 0.0;

   envelopePosition = 0.0;

   envelopeStep = 0.0;

   clones = new Array();

   clonePos = 0;

   fromClones = false;

   surplus = 0.0;

   connect = false;

   currentVector = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param attack The attack
   * @param sustain The sustain
   * @param release The release
   * @param endlessSustain true for an endless sustain, false otherwise
   * @param step The step
   * @param rotation The rotation
   */
  constructor(multiplicity, push, attack, sustain, release, endlessSustain, step, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    this.step = step;
  }

   getType() {
    return Z4PointIteratorType.TRACER;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = false;
      this.path = null;
      this.envelopeA = this.attack.next();
      this.envelopeS = this.sustain.next();
      this.envelopeR = this.release.next();
      this.envelopeAS = this.envelopeA + this.envelopeS;
      this.envelopeASR = this.envelopeA + this.envelopeS + this.envelopeR;
      this.envelopePosition = 0;
      this.envelopeStep = this.step.next();
      this.clones = new Array();
      this.fromClones = false;
      this.surplus = 0;
      this.connect = false;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      let distance = Z4Math.distance(this.currentPoint.x, this.currentPoint.y, x, y);
      if (distance >= 10) {
        let angle = Z4Math.atan(this.currentPoint.x, this.currentPoint.y, x, y);
        let vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 2 * distance / 3, angle);
        let end = new Z4Point(vector.x, vector.y);
        if (this.connect) {
          vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, distance / 3, angle);
          this.path = Z4TracerPath.fromQuadAndLine(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, end.x, end.y, this.surplus, this.envelopeStep);
        } else {
          this.path = Z4TracerPath.fromLine(this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, this.surplus, this.envelopeStep);
        }
        this.connect = true;
        this.before = end;
        this.currentPoint = new Z4Point(x, y);
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else {
        this.hasNext = false;
      }
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = 0;
      this.hasNext = this.clonePos < this.clones.length;
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
      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return new Z4DrawingPoint(clone.z4Vector, clone.intensity, this.clonePos / this.clones.length, clone.spatialPosition, false, clone.side, clone.useVectorModuleAsSize);
    } else {
      if (!this.currentMultiplicityCounter) {
        this.currentVector = this.path.next();
      }
      let vector = null;
      let angle = this.rotation.next(this.currentVector.phase);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, 1, angle);
      }
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
      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, this.nextEnvelope(), temporalPosition, spatialPosition, drawBounds, this.rotation.computeSide(vector, this.currentVector), false);
      if (this.nextdDrawingPoint.drawBounds && this.nextdDrawingPoint.intensity > 0) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

   nextEnvelope() {
    if (this.envelopePosition < this.envelopeA) {
      this.envelopePosition++;
      return this.envelopePosition / this.envelopeA;
    } else if (this.envelopePosition < this.envelopeAS || this.endlessSustain) {
      this.envelopePosition++;
      return 1;
    } else if (this.envelopePosition < this.envelopeASR) {
      this.envelopePosition++;
      return 1 - (this.envelopePosition - this.envelopeAS) / this.envelopeR;
    } else {
      return 0;
    }
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["push"] = this.push.toJSON();
    json["attack"] = this.attack.toJSON();
    json["sustain"] = this.sustain.toJSON();
    json["release"] = this.release.toJSON();
    json["endlessSustain"] = this.endlessSustain;
    json["step"] = this.step.toJSON();
    return json;
  }
}
