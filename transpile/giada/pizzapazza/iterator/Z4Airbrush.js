/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4Airbrush extends Z4PointIterator {

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   radius = 50;

   speed = 5;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

   draw(action, x, y) {
    if (action === Z4Action.START) {
      this.P["x"] = x;
      this.P["y"] = y;
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return true;
    } else if (action === Z4Action.CONTINUE) {
      this.P["x"] = x;
      this.P["y"] = y;
      this.hasNext = true;
      return false;
    } else if (action === Z4Action.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

   next() {
    if (!this.hasNext) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let currentRadius = this.radius * Math.random();
      let currenAngle = Z4Math.TWO_PI * Math.random();
      let angle = this.rotation.next(currenAngle);
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"] + currentRadius * Math.cos(currenAngle), this.P["y"] + currentRadius * Math.sin(currenAngle), 1, angle));
      this.rotation.nextSide(this.z4Point, null);
      if (!this.progression.isTemporal() || this.currentMultiplicityCounter === 1) {
        this.progression.next(this.z4Point);
      } else {
        this.z4Point.setLighting(this.progression.getLighting());
        this.z4Point.setDrawBounds(false);
      }
      if (this.progression.isRelativeToPath()) {
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(currentRadius / this.radius);
      }
      return this.z4Point;
    }
  }

   isInfinitePointGenerator() {
    return true;
  }

   getInfinitePointGeneratorSleep() {
    return 250 / this.speed;
  }

   drawDemo(context, painter, gradientColor, width, height) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalGradientColor = gradientColor ? gradientColor : new Z4GradientColor();
    this.draw(Z4Action.START, width / 2, height / 2);
    let next = null;
    while ((next = this.next()) !== null) {
      let vector = next.getZ4Vector();
      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      finalPainter.draw(context, next, finalGradientColor);
      context.restore();
    }
    this.draw(Z4Action.STOP, width / 2, height / 2);
  }

  /**
   * sets the multiplicity
   * @param multiplicity The multiplicity
   * @return This Z4Airbrush
   */
   setMultiplicity(multiplicity) {
    this.multiplicity = multiplicity;
    return this;
  }

  /**
   * Returns the multiplicity
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Sets the radius
   *
   * @param radius The radius
   * @return This Z4Airbrush
   */
   setRadius(radius) {
    this.radius = radius;
    return this;
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
   * Sets the speed
   *
   * @param speed The speed
   * @return This Z4Airbrush
   */
   setSpeed(speed) {
    this.speed = speed;
    return this;
  }

  /**
   * Returns the speed
   *
   * @return The speed
   */
   getSpeed() {
    return this.speed;
  }
}
