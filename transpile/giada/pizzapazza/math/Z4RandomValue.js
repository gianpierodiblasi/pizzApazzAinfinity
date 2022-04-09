/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
class Z4RandomValue {

  /**
   * The classic random behaviour
   */
  static  CLASSIC = new Z4RandomValue(0, 0);

   type = 0;

   length = 0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

  constructor(type, length) {
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
   * Returns the next random value
   *
   * @return
   */
   next() {
    switch(this.type) {
      case 0:
      default:
        return Math.random();
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
        return this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }
        return (this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom;
      case 3:
        if (this.step === this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }
        return this.prevRandom;
    }
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param length The curve length
   * @return The Z4RandomValue
   */
  static  bezier(length) {
    return new Z4RandomValue(1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  static  polyline(length) {
    return new Z4RandomValue(2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param length The step length
   * @return The Z4RandomValue
   */
  static  stepped(length) {
    return new Z4RandomValue(3, length);
  }
}
