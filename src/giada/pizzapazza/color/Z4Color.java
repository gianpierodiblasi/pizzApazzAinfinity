package giada.pizzapazza.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import def.js.RegExp;
import def.js.RegExpExecArray;
import jsweet.util.union.Union4;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Number;

/**
 * The color
 *
 * @author gianpiero.di.blasi
 */
public class Z4Color {

  /**
   * The standard colors
   */
  public static Array<String> STANDARD_COLOR = new Array<>(
          "#FFFFFF", // white
          "#CCCCCC", // light gray
          "#888888", // gray
          "#444444", // dark gray
          "#000000", // black
          "#FF6600", // orange    
          "#FF0000", // red
          "#00FF00", // green
          "#0000FF", // blue
          "#00FFFF", // cyan
          "#FF00FF", // magenta
          "#FFFF00" // yellow
  );

  private int a;
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
   * Sets this Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return This Z4Color
   */
  public Z4Color set(int color) {
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
  public Z4Color gray() {
    int gray = parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);

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
  public Z4Color darkened(double darkeningFactor) {
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
  public Array<Integer> getComponents() {
    return new Array<>(this.a, this.r, this.g, this.b);
  }

  /**
   * Returns the ARGB integer representing this Z4Color
   *
   * @return The ARGB integer representing this Z4Color
   */
  public int getARGB() {
    return this.argb;
  }

  /**
   * Returns the RGB hex string representing this Z4Color
   *
   * @return The RGB hex string representing this Z4Color
   */
  public String getHEX() {
    return this.hex;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getHEX() {
    return null;
  }

  /**
   * Creates a Z4Color from an ARGB integer color
   *
   * @param color The color
   * @return The Z4Color
   */
  public static Z4Color fromARGB(int color) {
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
    return new Z4Color(a, parseInt(result.$get(1), 16), parseInt(result.$get(2), 16), parseInt(result.$get(3), 16));
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  public static String getFillStyle(String color) {
    return color;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param color The color
   * @return NOTHING
   */
  public static Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String color) {
    return null;
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
  public static Z4Color fromZ4Colors(Z4Color before, Z4Color after, double div) {
    Array<Integer> cBefore = before.getComponents();
    Array<Integer> cAfter = after.getComponents();

    return new Z4Color(
            parseInt((cAfter.$get(0) - cBefore.$get(0)) * div + cBefore.$get(0)),
            parseInt((cAfter.$get(1) - cBefore.$get(1)) * div + cBefore.$get(1)),
            parseInt((cAfter.$get(2) - cBefore.$get(2)) * div + cBefore.$get(2)),
            parseInt((cAfter.$get(3) - cBefore.$get(3)) * div + cBefore.$get(3))
    );
  }
}
