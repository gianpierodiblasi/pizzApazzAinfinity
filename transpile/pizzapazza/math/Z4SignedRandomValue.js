/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValue {

   sign = new Z4Sign(Z4SignDefinition.RANDOM);

   value = 0.0;

   behavior = null;

   length = 0.0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

  /**
   * Creates the object
   *
   * @param value The value
   * @param behavior The random behavior
   * @param length The polyline/curve length
   */
  constructor(value, behavior, length) {
    this.value = value;
    this.behavior = behavior;
    this.length = length;
    this.step = 1;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();
    if (this.behavior === Z4SignedRandomValueBehavior.BEZIER) {
      this.createBezierCurve();
    }
  }

   createBezierCurve() {
    this.bezierCurve = new Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Returns the value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

  /**
   * Returns The polyline/curve length
   *
   * @return The polyline/curve length
   */
   getLength() {
    return this.length;
  }

  /**
   * Returns the next unsigned random value
   *
   * @return The next unsigned random value (in the range [0,value[)
   */
   nextUnsigned() {
    if (this.behavior === Z4SignedRandomValueBehavior.CLASSIC) {
      return this.value * Math.random();
    } else if (this.behavior === Z4SignedRandomValueBehavior.BEZIER) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.controlRandom = this.controlRandom === 1 ? 0 : 1;
        this.nextRandom = Math.random();
        this.createBezierCurve();
      } else {
        this.step++;
      }
      return this.value * this.bezierCurve.get(this.step / this.length).y;
    } else if (this.behavior === Z4SignedRandomValueBehavior.POLYLINE) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.nextRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
    } else if (this.behavior === Z4SignedRandomValueBehavior.STEPPED) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * this.prevRandom;
    } else {
      return 0;
    }
  }

  /**
   * Returns the next signed random value
   *
   * @return The next signed random value (in the range ]-value,value[)
   */
   nextSigned() {
    return this.sign.next() * this.nextUnsigned();
  }
}
