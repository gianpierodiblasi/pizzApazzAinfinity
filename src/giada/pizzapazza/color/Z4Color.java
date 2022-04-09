package giada.pizzapazza.color;

/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
public class Z4Color {

  private final int a;
  private int r;
  private int g;
  private int b;
  private int argb;
  private String hex;

  /**
   * Creates a Z4Color
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  public Z4Color(int a, int r, int g, int b) {
    this.a = a;
    this.r = r;
    this.g = g;
    this.b = b;

    this.init();
  }

  private Z4Color init() {
    this.argb = this.a << 24 | this.r << 16 | this.g << 8 | this.b;

    this.hex
            = "#"
            + new $Number(this.r).toString(16).padStart(2, "0")
            + new $Number(this.g).toString(16).padStart(2, "0")
            + new $Number(this.b).toString(16).padStart(2, "0")
            + new $Number(this.a).toString(16).padStart(2, "0");

    return this;
  }

  /**
   * In place converts this Z4Color to gray scaled, the transparency is not
   * changed
   *
   * @return This gray scaled Z4Color
   */
  public Z4Color gray() {
    int gray = $parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);

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
  public Z4Color negative() {
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
  public Z4Color lighted(double lightingFactor) {
    this.r = $parseInt((255 - this.r) * lightingFactor + this.r);
    this.g = $parseInt((255 - this.g) * lightingFactor + this.g);
    this.b = $parseInt((255 - this.b) * lightingFactor + this.b);

    return this.init();
  }

  /**
   * In place darkens this Z4Color, the transparency is not changed
   *
   * @param darkeningFactor The darkening factor (in the range [0,1])
   * @return This darkened Z4Color
   */
  public Z4Color darkened(double darkeningFactor) {
    darkeningFactor = 1 - darkeningFactor;

    this.r = $parseInt(darkeningFactor * this.r);
    this.g = $parseInt(darkeningFactor * this.g);
    this.b = $parseInt(darkeningFactor * this.b);

    return this.init();
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

  private static int $parseInt(double v) {
    return 0;
  }

  private static int $parseInt(String str, int radix) {
    return 0;
  }

  private static class $Number {

    private $Number(double value) {
    }

    private $InternalString toString(int radix) {
      return null;
    }
  }

  private static class $InternalString {

    private $InternalString padStart(int targetLength, String padString) {
      return null;
    }
  }

  private static class $RegExp {

    private $RegExp(String pattern, String flags) {
    }

    private String[] exec(String string) {
      return null;
    }
  }
}
