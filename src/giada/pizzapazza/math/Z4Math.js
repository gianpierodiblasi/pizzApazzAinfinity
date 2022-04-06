class Z4Math {
  static TWO_PI = 2 * Math.PI;
  static HALF_PI = Math.PI / 2;
  static GOLD_SECTION = (1 + Math.sqrt(5)) / 2;
  static SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;
  static RAD2DEG = 180 / Math.PI;
  static DEG2RAD = Math.PI / 180;

  constructor() {

  }

  static rad2deg(radians) {
    return radians * Z4Math.RAD2DEG;
  }

  static deg2rad(degrees) {
    return degrees * Z4Math.DEG2RAD;
  }

  static distance(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  static atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  static ripple(value, min, max, ripple) {
    let rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }
}
