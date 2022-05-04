/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4Stamper extends Z4PointIterator {

   intensity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(15).setSign(Z4Sign.POSITIVE));

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE));

   push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE));

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

   currentPush = 0.0;

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next(0));
      this.currentPush = this.push.next(0);
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return this.intensity;
  }

  /**
   * Sets the intensity
   *
   * @param intensity The intensity
   * @return This Z4Stamper
   */
   setIntensity(intensity) {
    this.intensity = intensity;
    return this;
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
   * @return This Z4Stamper
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
   * @return This Z4Stamper
   */
   setPush(push) {
    this.push = push;
    return this;
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let angle = this.rotation.next(0);
      if (this.currentPush) {
        let pushed = Z4Vector.fromVector(this.P["x"], this.P["y"], this.currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"], this.P["y"], 1, angle));
      }
      this.rotation.nextSide(this.z4Point, null);
      if (this.progression === Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        let colorPosition = this.z4Point.getColorPosition();
        colorPosition = colorPosition === -1 ? 0 : colorPosition + this.temporalStepProgression;
        if (colorPosition > 1) {
          colorPosition -= 1;
        }
        this.z4Point.setColorPosition(colorPosition);
      } else if (this.progression === Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression === Z4Progression.RELATIVE_TO_PATH || this.progression === Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setColorPosition(Math.random());
      }
      return this.z4Point.setIntensity(this.intensity.next(0));
    }
  }

   drawDemo(context, width, height) {
    let arrowPainter = new Z4ArrowPainter();
    let gradientColor = new Z4GradientColor();
    this.initDraw(width, height).forEach(point => {
      this.draw(Z4Action.START, point["x"], point["y"]);
      if (this.currentPush && !this.currentMultiplicityCounter) {
        context.save();
        context.lineWidth = 1;
        context.fillStyle = Z4AbstractColor.getFillStyle("black");
        context.beginPath();
        context.arc(this.P["x"], this.P["y"], 2, 0, Z4Math.TWO_PI);
        context.fill();
        context.restore();
      }
      let next = null;
      while ((next = this.next()) !== null) {
        let vector = next.getZ4Vector();
        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        arrowPainter.draw(context, next, gradientColor);
        context.restore();
      }
    });
  }

   initDraw(w, h) {
    let array = new Array();
    for (let x = 50; x <= w - 50; x += 100) {
      for (let y = 50; y <= h - 50; y += 100) {
        let point = new Object();
        point["x"] = x;
        point["y"] = y;
        array.push(point);
      }
    }
    return array;
  }
}
