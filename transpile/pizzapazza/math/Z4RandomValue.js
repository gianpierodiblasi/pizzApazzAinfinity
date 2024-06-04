/**
 * A random value
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValue extends Z4Nextable {

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
   * @param behavior The random value behavior
   * @param length The bezier/polyline/step length
   */
  constructor(value, behavior, length) {
    super();
    this.value = value;
    this.behavior = behavior;
    this.length = length;
    this.step = 1;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();
    if (this.behavior === Z4RandomValueBehavior.BEZIER) {
      this.createBezierCurve();
    }
  }

   createBezierCurve() {
    this.bezierCurve = new Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
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
   * Returns the random value behavior
   *
   * @return The random value behavior
   */
   getRandomValueBehavior() {
    return this.behavior;
  }

  /**
   * Returns The bezier/polyline/step length
   *
   * @return The bezier/polyline/step length
   */
   getLength() {
    return this.length;
  }

   next() {
    if (this.behavior === Z4RandomValueBehavior.CLASSIC) {
      return this.value * Math.random();
    } else if (this.behavior === Z4RandomValueBehavior.BEZIER) {
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
    } else if (this.behavior === Z4RandomValueBehavior.POLYLINE) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.nextRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
    } else if (this.behavior === Z4RandomValueBehavior.STEPPED) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * this.prevRandom;
    } else {
      return 0.0;
    }
  }

   toJSON() {
    let json = new Object();
    json["value"] = this.value;
    json["behavior"] = this.behavior;
    json["length"] = this.length;
    return json;
  }

  /**
   * Creates a Z4RandomValue from a JSON object
   *
   * @param json The JSON object
   * @return the random value
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "CLASSIC":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.CLASSIC, json["length"]);
      case "BEZIER":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.BEZIER, json["length"]);
      case "POLYLINE":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.POLYLINE, json["length"]);
      case "STEPPED":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.STEPPED, json["length"]);
      default:
        return null;
    }
  }
}
