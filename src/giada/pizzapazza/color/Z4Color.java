package giada.pizzapazza.color;

import def.js.RegExp;
import def.js.RegExpExecArray;
import static simulation.js.$Globals.$parseInt;

/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
public class Z4Color extends Z4AbstractColor<Z4Color> {

  /**
   * Creates a Z4Color
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  public Z4Color(int a, int r, int g, int b) {
    super(a, r, g, b);
  }

  /**
   * Creates a Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return The Z4Color
   */
  public static Z4Color fromColor(int color) {
    return new Z4Color(color >>> 24 & 0xff, color >>> 16 & 0xff, color >>> 8 & 0xff, color & 0xff);
  }

  /**
   * Creates a Z4Color from an RGB hex string
   *
   * @param color The color
   * @param a The transparency component
   * @return The Z4Color
   */
  public static Z4Color fromHEX(String color, int a) {
    RegExpExecArray result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4Color(a, $parseInt(result.$get(1), 16), $parseInt(result.$get(2), 16), $parseInt(result.$get(3), 16));
  }
}
