package giada.pizzapazza.color;

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
    String[] result = new $RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4Color(a, $parseInt(result[1], 16), $parseInt(result[2], 16), $parseInt(result[3], 16));
  }

  private static int $parseInt(String str, int radix) {
    return 0;
  }

  private static class $RegExp {

    private $RegExp(String pattern, String flags) {
    }

    private String[] exec(String string) {
      return null;
    }
  }
}
