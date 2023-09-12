/**
 * The color
 *
 * @author gianpiero.diblasi
 */
class Z4Color {

  /**
   * The standard colors
   */
  static  STANDARD_COLOR = new Array(// white
  "#FFFFFF", // light gray
  "#CCCCCC", // gray
  "#888888", // dark gray
  "#444444", // black
  "#000000", // orange
  "#FF6600", // red
  "#FF0000", // green
  "#00FF00", // blue
  "#0000FF", // cyan
  "#00FFFF", // magenta
  "#FF00FF", // yellow
  "#FFFF00");

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
   * Sets this Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4Color
   */
   set(color) {
    this.a = color >>> 24 & 0xff;
    this.r = color >>> 16 & 0xff;
    this.g = color >>> 8 & 0xff;
    this.b = color & 0xff;
    return this.init();
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
   * Returns the components of this Z4Color (a, r, g, b)
   *
   * @return The six components of this Z4Color
   */
   getComponents() {
    return new Array(this.a, this.r, this.g, this.b);
  }

  /**
   * Returns the ARGB integer representing this Z4Color
   *
   * @return The ARGB integer representing this Z4Color
   */
   getARGB() {
    return this.argb;
  }

  /**
   * Returns the RGB hex string representing this Z4Color
   *
   * @return The RGB hex string representing this Z4Color
   */
   getHEX() {
    return this.hex;
  }
  /**
   * Creates a Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return The Z4Color
   */
  static  fromARGB(color) {
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

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  static  getFillStyle(color) {
    return color;
  }
  /**
   * Creates a Z4Color from two Z4Color
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4Color
   */
  static  fromZ4Colors(before, after, div) {
    let cBefore = before.getComponents();
    let cAfter = after.getComponents();
    return new Z4Color(parseInt((cAfter[0] - cBefore[0]) * div + cBefore[0]), parseInt((cAfter[1] - cBefore[1]) * div + cBefore[1]), parseInt((cAfter[2] - cBefore[2]) * div + cBefore[2]), parseInt((cAfter[3] - cBefore[3]) * div + cBefore[3]));
  }
}
