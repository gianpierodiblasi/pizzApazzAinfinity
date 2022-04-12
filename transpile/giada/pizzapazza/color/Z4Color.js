/* global RegExp, Z4Color, parseInt */

/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
class Z4Color extends Z4AbstractColor {

  /**
   * Creates a Z4Color
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  constructor(a, r, g, b) {
    super(a, r, g, b);
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
   * Creates a Z4Color from a Z4AbstractColor
   *
   * @param color The color Z4AbstractColor
   * @return The Z4Color
   */
  static  fromZ4AbstractColor(color) {
    return Z4Color.fromARGB(color.getARGB());
  }

  /**
   * Creates a Z4Color from two Z4AbstractColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4Color
   */
  static  fromZ4AbstractColors(before, after, div) {
    let cBefore = before.getComponents();
    let cAfter = after.getComponents();
    return new Z4Color(parseInt((cAfter[0] - cBefore[0]) * div + cBefore[0]), parseInt((cAfter[1] - cBefore[1]) * div + cBefore[1]), parseInt((cAfter[2] - cBefore[2]) * div + cBefore[2]), parseInt((cAfter[3] - cBefore[3]) * div + cBefore[3]));
  }
}
