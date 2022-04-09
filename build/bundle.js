/**
 * The utility library for math
 *
 * @author gianpiero.di.blasi
 */
class Z4Math {

  /**
   * 2*PI value
   */
  static  TWO_PI = 2 * Math.PI;

  /**
   * PI/2 value
   */
  static  HALF_PI = Math.PI / 2;

  /**
   * The gold section
   */
  static  GOLD_SECTION = (1 + Math.sqrt(5)) / 2;

  /**
   * The gold section square
   */
  static  SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;

  /**
   * RAD to DEG conversion
   */
  static  RAD2DEG = 180 / Math.PI;

  /**
   * DEG to RAD conversion
   */
  static  DEG2RAD = Math.PI / 180;

  /**
   * Converts an angle from radiants to degrees
   *
   * @param radians The angle in radians
   * @return The angle in degree
   */
  static  rad2deg(radians) {
    return radians * Z4Math.RAD2DEG;
  }

  /**
   * Converts an angle from degrees to radians
   *
   * @param degrees The angle in degrees
   * @return The angle in radians
   */
  static  deg2rad(degrees) {
    return degrees * Z4Math.DEG2RAD;
  }

  /**
   * Returns the distance between two points
   *
   * @param x1 The x-axis coordinate of the first point
   * @param y1 The y-axis coordinate of the first point
   * @param x2 The x-axis coordinate of the second point
   * @param y2 The y-axis coordinate of the second point
   * @return The distance between two points
   */
  static  distance(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Returns the theta component of a point or a vector, in polar coordinates.
   * The value is normalized in the range [0,2*PI]
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The theta component of a point or a vector, in polar coordinates
   */
  static  atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  /**
   * Generates a ripple around a value
   *
   * @param value The value
   * @param min The minimum allowed value
   * @param max The maximum allowed value
   * @param ripple The ripple (in the range [0,1])
   * @return The rippled value
   */
  static  ripple(value, min, max, ripple) {
    let rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }

  constructor() {
  }
}
/**
 * The signs of a value
 *
 * @author gianpiero.di.blasi
 */
class Z4Sign {

  /**
   * Positive sign
   */
  static  POSITIVE = new Z4Sign(1);

  /**
   * Negative sign
   */
  static  NEGATIVE = new Z4Sign(-1);

  /**
   * Random sign
   */
  static  RANDOM = new Z4Sign(0);

   sign = 0;

  constructor(sign) {
    this.sign = sign;
  }

  /**
   * Returns the next sign
   *
   * @return The next sign
   */
   next() {
    switch(this.sign) {
      case 1:
      case -1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case -2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }

  /**
   * Creates a Z4Sign providing the following sequence 1, -1, 1, -1, ...
   *
   * @return The Z4Sign
   */
  static  alternate() {
    return new Z4Sign(-2);
  }
}
/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
class Z4RandomValue {

   value = 0;

   type = 0;

   length = 0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

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
   * Returns the next random value
   *
   * @return The next random value (in the range [0,value[)
   */
   next() {
    switch(this.type) {
      case 0:
      default:
        return value * Math.random();
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

  /**
   * Returns a Z4RandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4RandomValue
   */
  static  classic(value) {
    return new Z4RandomValue(value, 0, 0);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  static  bezier(value, length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  static  polyline(value, length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  static  stepped(value, length) {
    return new Z4RandomValue(value, 3, length);
  }
}
/**
 * The fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValue {

   constantSign = Z4Sign.RANDOM;

   constantValue = 0;

   randomSign = Z4Sign.RANDOM;

   randomValue = Z4RandomValue.classic(0);

   proportionalSign = Z4Sign.RANDOM;

   proportionalValue = 0;

   uniformSign = false;

  /**
   * Creates a Z4FancifulValue
   */
  constructor() {
  }

  /**
   * Sets the constant component
   *
   * @param constantSign The sign of the constant component
   * @param constantValue The value of the constant component
   * @return This Z4FancifulValue
   */
   setConstant(constantSign, constantValue) {
    this.constantSign = constantSign;
    this.constantValue = constantValue;
    return this;
  }

  /**
   * Sets the random component
   *
   * @param randomSign The sign of the random component
   * @param randomValue The value of the random component
   * @return This Z4FancifulValue
   */
   setRandom(randomSign, randomValue) {
    this.randomSign = randomSign;
    this.randomValue = randomValue;
    return this;
  }

  /**
   * Sets the proportional component
   *
   * @param proportionalSign The sign of the proportional component
   * @param proportionalValue The value of the proportional component
   * @return This Z4FancifulValue
   */
   setProportional(proportionalSign, proportionalValue) {
    this.proportionalSign = proportionalSign;
    this.proportionalValue = proportionalValue;
    return this;
  }

  /**
   * Sets if the computed sign has to be equals for all components; if true then
   * the constant sign is used
   *
   * @param uniformSign true if the computed sign has to be equals for all
   * components, false otherwise
   * @return This Z4FancifulValue
   */
   setUniformSign(uniformSign) {
    this.uniformSign = uniformSign;
    return this;
  }

  /**
   * Returns the next "fanciful" value
   *
   * @param sensibility The sensibility value to apply to the proportional
   * component
   * @return The next "fanciful" value
   */
   next(sensibility) {
    if (this.uniformSign) {
      return this.constantSign.next() * (this.constantValue + this.randomValue.next() + sensibility * this.proportionalValue);
    } else {
      return this.constantSign.next() * this.constantValue + this.randomSign.next() * this.randomValue.next() + this.proportionalSign.next() * sensibility * this.proportionalValue;
    }
  }
}
/**
 * The lighting of a color
 *
 * @author gianpiero.di.blasi
 */
class Z4Lighting {

  /**
   * No lighting
   */
  static  NONE = new Z4Lighting();

  /**
   * lighting
   */
  static  LIGTHED = new Z4Lighting();

  /**
   * darkening
   */
  static  DARKENED = new Z4Lighting();

  constructor() {
  }
}
/**
 * The progression of a color
 *
 * @author gianpiero.di.blasi
 */
class Z4Progression {

  /**
   * The spatial progression
   */
  static  SPATIAL = new Z4Progression();

  /**
   * The temporal progression
   */
  static  TEMPORAL = new Z4Progression();

  /**
   * The progression relative to a path
   */
  static  RELATIVE_TO_PATH = new Z4Progression();

  /**
   * The random progression
   */
  static  RANDOM = new Z4Progression();

  constructor() {
  }
}
/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
class Z4Color {

   a = 0;

   r = 0;

   g = 0;

   b = 0;

   argb = 0;

   hex = null;

  /**
   * Creates a Z4Color
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  constructor(a, r, g, b) {
    this.a = a;
    this.r = r;
    this.g = g;
    this.b = b;
    this.init();
  }

   init() {
    this.argb = this.a << 24 | this.r << 16 | this.g << 8 | this.b;
    this.hex = "#" + new Number(this.r).toString(16).padStart(2, "0") + new Number(this.g).toString(16).padStart(2, "0") + new Number(this.b).toString(16).padStart(2, "0") + new Number(this.a).toString(16).padStart(2, "0");
    return this;
  }

  /**
   * In place converts this Z4Color to gray scaled, the transparency is not
   * changed
   *
   * @return This gray scaled Z4Color
   */
   gray() {
    let gray = parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);
    this.r = gray;
    this.g = gray;
    this.b = gray;
    return this.init();
  }

  /**
   * In place converts this Z4Color to negative, the transparency is not changed
   *
   * @return This negativized Z4Color
   */
   negative() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this.init();
  }

  /**
   * In place lights up this Z4Color, the transparency is not changed
   *
   * @param lightingFactor The lighting factor (in the range [0,1])
   * @return This lighted Z4Color
   */
   lighted(lightingFactor) {
    this.r = parseInt((255 - this.r) * lightingFactor + this.r);
    this.g = parseInt((255 - this.g) * lightingFactor + this.g);
    this.b = parseInt((255 - this.b) * lightingFactor + this.b);
    return this.init();
  }

  /**
   * In place darkens this Z4Color, the transparency is not changed
   *
   * @param darkeningFactor The darkening factor (in the range [0,1])
   * @return This darkened Z4Color
   */
   darkened(darkeningFactor) {
    darkeningFactor = 1 - darkeningFactor;
    this.r = parseInt(darkeningFactor * this.r);
    this.g = parseInt(darkeningFactor * this.g);
    this.b = parseInt(darkeningFactor * this.b);
    return this.init();
  }

  /**
   * Creates a Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return The Z4Color
   */
  static  fromColor(color) {
    return new Z4Color(color >>> 24 & 0xff, color >>> 16 & 0xff, color >>> 8 & 0xff, color & 0xff);
  }

  /**
   * Creates a Z4Color from an RGB hex string
   *
   * @param color The color
   * @param a The transparency component
   * @return The Z4Color
   */
  static  fromHEX(color, a) {
    let result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4Color(a, parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
  }
}
