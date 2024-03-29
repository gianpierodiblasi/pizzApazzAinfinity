/**
 * The tracer
 *
 * @author gianpiero.diblasi
 */
class Z4Tracer extends Z4PointIterator {

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   attack = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   sustain = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   release = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   endlessSustain = true;

   step = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(10).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   path = null;

   before = new Object();

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
   * Creates a Z4Tracer
   */
  constructor() {
    super();
    this.before["x"] = 0;
    this.before["y"] = 0;
  }

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.P["x"] = x;
      this.P["y"] = y;
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
    } else if (action === Z4Action.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      let distance = Z4Math.distance(this.P["x"], this.P["y"], x, y);
      if (distance >= 10) {
        let angle = Z4Math.atan(this.P["x"], this.P["y"], x, y);
        let vector = Z4Vector.fromVector(this.P["x"], this.P["y"], 2 * distance / 3, angle);
        let end = new Object();
        end["x"] = vector.getX();
        end["y"] = vector.getY();
        if (this.connect) {
          vector = Z4Vector.fromVector(this.P["x"], this.P["y"], distance / 3, angle);
          this.path = Z4TracerPath.fromQuadAndLine(this.before["x"], this.before["y"], this.P["x"], this.P["y"], vector.getX(), vector.getY(), end["x"], end["y"], this.surplus, this.envelopeStep);
        } else {
          this.path = Z4TracerPath.fromLine(this.P["x"], this.P["y"], vector.getX(), vector.getY(), this.surplus, this.envelopeStep);
        }
        this.connect = true;
        this.before = end;
        this.P["x"] = x;
        this.P["y"] = y;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else {
        this.hasNext = false;
      }
      return true;
    } else if (action === Z4Action.STOP) {
      this.fromClones = true;
      this.clonePos = 0;
      this.hasNext = this.clonePos < this.clones.length;
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
      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return clone;
    } else {
      if (!this.currentMultiplicityCounter) {
        this.currentVector = this.path.next();
      }
      let angle = this.rotation.next(this.currentVector.getPhase());
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentVector.getX0(), this.currentVector.getY0(), currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.currentVector.getX0(), this.currentVector.getY0(), 1, angle));
      }
      this.z4Point.setIntensity(this.nextEnvelope());
      this.rotation.nextSide(this.z4Point, this.currentVector);
      this.progression.next(this.z4Point);
      if (this.z4Point.isDrawBounds() && this.z4Point.getIntensity() > 0) {
        this.clones.push(this.z4Point.clone());
      }
      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }
      return this.z4Point;
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

   drawDemo(context, painter, gradientColor, width, height) {
    painter = painter ? painter : new Z4ArrowPainter();
    gradientColor = gradientColor ? gradientColor : new Z4GradientColor();
    let bezier = width > height ? new Bezier(width / 10, height / 3, width / 2, 3 * height / 2, width / 2, -height / 2, 9 * width / 10, height / 2) : new Bezier(width / 3, 9 * height / 10, 3 * width / 2, height / 2, -width / 2, height / 2, width / 2, height / 10);
    let p = bezier.get(0);
    this.draw(Z4Action.START, p.x, p.y);
    for (let s = 0.1; s < 1; s += 0.1) {
      p = bezier.get(s);
      this.draw(Z4Action.CONTINUE, p.x, p.y);
      this.drawDemoPoint(context, p, painter, gradientColor);
    }
    p = bezier.get(1);
    this.draw(Z4Action.CONTINUE, p.x, p.y);
    this.drawDemoPoint(context, p, painter, gradientColor);
    this.draw(Z4Action.STOP, p.x, p.y);
    this.drawDemoPoint(context, p, painter, gradientColor);
  }

   drawDemoPoint(context, p, painter, gradientColor) {
    context.save();
    context.lineWidth = 1;
    context.fillStyle = Z4Color.getFillStyle("black");
    context.beginPath();
    context.arc(p.x, p.y, 2, 0, Z4Math.TWO_PI);
    context.fill();
    context.restore();
    let next = null;
    while ((next = this.next()) !== null) {
      if (!next.isDrawBounds()) {
        let vector = next.getZ4Vector();
        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        painter.draw(context, next, gradientColor);
        context.restore();
      }
    }
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
   * Sets the multiplicity
   *
   * @param multiplicity The multiplicity
   * @return This Z4Tracer
   */
   setMultiplicity(multiplicity) {
    this.multiplicity = multiplicity;
    return this;
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
   * Sets the push
   *
   * @param push The push
   * @return This Z4Tracer
   */
   setPush(push) {
    this.push = push;
    return this;
  }

  /**
   * Sets the envelope
   *
   * @param attack The attack
   * @param sustain The sustain
   * @param release The release
   * @param endlessSustain true for an endless sustain, false otherwise
   * @return This Z4Tracer
   */
   setEnvelope(attack, sustain, release, endlessSustain) {
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    return this;
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
   * Sets the step
   *
   * @param step The step
   * @return This Z4Tracer
   */
   setStep(step) {
    this.step = step;
    return this;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
   getStep() {
    return this.step;
  }
}
