/**
 * The common parent of all random values
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractRandomValue {

   value = 0.0;

   type = 0;

   length = 0.0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

  /**
   * Creates a Z4AbstractRandomValue
   * @param value The value
   * @param type The type
   * @param length The length
   */
  constructor(value, type, length) {
    this.value = value;
    this.type = type;
    this.length = length;
    this.step = 0;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();
    if (this.type === 1) {
      this.createBezierCurve();
    }
  }

   createBezierCurve() {
    this.bezierCurve = new Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Checks if this Z4AbstractRandomValue generates "classic "random values
   *
   * @return true if this Z4AbstractRandomValue generates "classic "random
   * values, false otherwise
   */
   isClassic() {
    return this.type === 0;
  }

  /**
   * Checks if this Z4AbstractRandomValue generates random values on a bezier
   * curve
   *
   * @return true if this Z4AbstractRandomValue generates random values on a
   * bezier curve, false otherwise
   */
   isBezier() {
    return this.type === 1;
  }

  /**
   * Checks if this Z4AbstractRandomValue generates random values on a polyline
   *
   * @return true if this Z4AbstractRandomValue generates random values on a
   * polyline, false otherwise
   */
   isPolyline() {
    return this.type === 2;
  }

  /**
   * Returns if this Z4AbstractRandomValue generates random values on a stepped
   * line
   *
   * @return true if this Z4AbstractRandomValue generates random values on a
   * stepped line, false otherwise
   */
   isStepped() {
    return this.type === 3;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }

  /**
   * Returns the length
   *
   * @return The length
   */
   getLength() {
    return this.length;
  }

  /**
   * Returns the next random value
   *
   * @return The next random value (in the range [0,value[)
   */
   next() {
    switch(this.type) {
      case 0:
      default:
        return this.value * Math.random();
      case 1:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.controlRandom = this.controlRandom === 1 ? 0 : 1;
          this.nextRandom = Math.random();
          this.createBezierCurve();
        } else {
          this.step++;
        }
        return value * this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }
        return value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
      case 3:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }
        return value * this.prevRandom;
    }
  }
}
