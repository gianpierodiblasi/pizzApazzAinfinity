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

   assistedDrawing = false;

   ruler = false;

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

   startPoint = null;

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
   * @param assistedDrawing true to use the assisted drawing, false otherwise
   * @param ruler true to use a ruler, false otherwise
   * @param rotation The rotation
   */
  constructor(multiplicity, push, attack, sustain, release, endlessSustain, step, assistedDrawing, ruler, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    this.step = step;
    this.assistedDrawing = assistedDrawing;
    this.ruler = ruler;
  }

   getType() {
    return Z4PointIteratorType.TRACER;
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

  /**
   * Returns the attack
   *
   * @return The attack
   */
   getAttack() {
    return this.attack;
  }

  /**
   * Returns the release
   *
   * @return The release
   */
   getRelease() {
    return this.release;
  }

  /**
   * Returns the sustain
   *
   * @return The sustain
   */
   getSustain() {
    return this.sustain;
  }

  /**
   * Checks if the sustain is endless
   *
   * @return true for an endless sustain, false otherwise
   */
   isEndlessSustain() {
    return this.endlessSustain;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
   getStep() {
    return this.step;
  }

  /**
   * Checks if the assisted drawing is active
   *
   * @return true if the assisted drawing is active, false otherwise
   */
   isAssistedDrawing() {
    return this.assistedDrawing;
  }

  /**
   * Checks if the ruler is active
   *
   * @return true if the ruler is active, false otherwise
   */
   isRuler() {
    return this.ruler;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = false;
      this.startPoint = this.currentPoint;
      this.reset(progression);
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      let distance = Z4Math.distance(this.currentPoint.x, this.currentPoint.y, x, y);
      if (this.ruler) {
        this.reset(progression);
        this.path = Z4TracerPath.fromLine(this.startPoint.x, this.startPoint.y, x, y, this.surplus, this.envelopeStep);
        this.hasNext = this.path.hasNext();
      } else if (!this.assistedDrawing) {
        this.path = Z4TracerPath.fromLine(this.currentPoint.x, this.currentPoint.y, x, y, this.surplus, this.envelopeStep);
        this.currentPoint = new Z4Point(x, y);
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else if (distance >= 10) {
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

   reset(progression) {
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
    if (progression.isResetOnStartMoving()) {
      this.nextdDrawingPoint = null;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      let clone = this.clones[this.clonePos];
      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return new Z4DrawingPoint(clone.z4Vector, clone.intensity, progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH ? this.clonePos / this.clones.length : clone.temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, clone.side, clone.useVectorModuleAsSize);
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
      let intent = this.ruler ? Z4DrawingPointIntent.DRAW_BOUNDS : Z4DrawingPointIntent.DRAW_OBJECTS;
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        intent = Z4DrawingPointIntent.DRAW_BOUNDS;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, this.nextEnvelope(), temporalPosition, intent, this.rotation.computeSide(vector, this.currentVector), false);
      if (this.nextdDrawingPoint.intent === Z4DrawingPointIntent.DRAW_BOUNDS && this.nextdDrawingPoint.intensity > 0) {
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

   getNextCountOnSTOP() {
    return this.clones.length;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   isDrawBoundsWhileMoving() {
    return this.ruler;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    painter = painter ? painter : new Z4ArrowPainter();
    spatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    progression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    let bezier = width > height ? new Bezier(width / 10, height / 3, width / 2, 3 * height / 2, width / 2, -height / 2, 9 * width / 10, height / 2) : new Bezier(width / 3, 9 * height / 10, 3 * width / 2, height / 2, -width / 2, height / 2, width / 2, height / 10);
    let p = bezier.get(0);
    this.drawAction(Z4PointIteratorDrawingAction.START, progression, p.x, p.y);
    for (let s = 0.1; s < 1; s += 0.1) {
      p = bezier.get(s);
      this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, progression, p.x, p.y);
      this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
    }
    p = bezier.get(1);
    this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, progression, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
    this.drawAction(Z4PointIteratorDrawingAction.STOP, progression, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
  }

   drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting) {
    context.save();
    context.lineWidth = 1;
    context.fillStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(p.x, p.y, 2, 0, Z4Math.TWO_PI);
    context.fill();
    context.restore();
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (valueIsAdjusting) {
        next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
      }
      if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS || valueIsAdjusting) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        painter.draw(context, next, spatioTemporalColor, progression);
        context.restore();
      }
    }
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
    json["assistedDrawing"] = this.assistedDrawing;
    json["ruler"] = this.ruler;
    return json;
  }

  /**
   * Creates a Z4Tracer from a JSON object
   *
   * @param json The JSON object
   * @return the tracer
   */
  static  fromJSON(json) {
    return new Z4Tracer(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["push"]), Z4FancifulValue.fromJSON(json["attack"]), Z4FancifulValue.fromJSON(json["sustain"]), Z4FancifulValue.fromJSON(json["release"]), json["endlessSustain"], Z4FancifulValue.fromJSON(json["step"]), json["assistedDrawing"], json["ruler"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
