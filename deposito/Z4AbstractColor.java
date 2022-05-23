package giada.pizzapazza.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import jsweet.util.union.Union4;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Number;

/**
 * The abstract color
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4AbstractColor<T extends Z4AbstractColor<T>> {

  private int a;
  private int r;
  private int g;
  private int b;
  private int argb;
  private String hex;

  /**
   * Creates a Z4AbstractColor
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   */
  public Z4AbstractColor(int a, int r, int g, int b) {
    this.a = a;
    this.r = r;
    this.g = g;
    this.b = b;

    this.init();
  }

  @SuppressWarnings("unchecked")
  private T init() {
    this.argb = this.a << 24 | this.r << 16 | this.g << 8 | this.b;

    this.hex
            = "#"
            + new $Number(this.r).toString(16).padStart(2, "0")
            + new $Number(this.g).toString(16).padStart(2, "0")
            + new $Number(this.b).toString(16).padStart(2, "0")
            + new $Number(this.a).toString(16).padStart(2, "0");

    return (T) this;
  }

  /**
   * Returns the components of this Z4AbstractColor (a, r, g, b)
   *
   * @return The six components of this Z4AbstractColor
   */
  public Array<Integer> getComponents() {
    return new Array<>(this.a, this.r, this.g, this.b);
  }

  /**
   * Returns the ARGB integer representing this Z4AbstractColor
   *
   * @return The ARGB integer representing this Z4AbstractColor
   */
  public int getARGB() {
    return this.argb;
  }

  /**
   * Returns the RGB hex string representing this Z4AbstractColor
   *
   * @return The RGB hex string representing this Z4AbstractColor
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
   * Sets this Z4AbstractColor from an ARGB integer color
   *
   * @param color The color
   * @return This Z4AbstractColor
   */
  public T set(int color) {
    this.a = color >>> 24 & 0xff;
    this.r = color >>> 16 & 0xff;
    this.g = color >>> 8 & 0xff;
    this.b = color & 0xff;

    return this.init();
  }

  /**
   * In place converts this Z4AbstractColor to gray scaled, the transparency is
   * not changed
   *
   * @return This gray scaled Z4AbstractColor
   */
  public T gray() {
    int gray = parseInt(0.21 * this.r + 0.71 * this.g + 0.08 * this.b);

    this.r = gray;
    this.g = gray;
    this.b = gray;

    return this.init();
  }

  /**
   * In place converts this Z4AbstractColor to negative, the transparency is not
   * changed
   *
   * @return This negativized Z4AbstractColor
   */
  public T negative() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;

    return this.init();
  }

  /**
   * In place lights up this Z4AbstractColor, the transparency is not changed
   *
   * @param lightingFactor The lighting factor (in the range [0,1])
   * @return This lighted Z4AbstractColor
   */
  public T lighted(double lightingFactor) {
    this.r = parseInt((255 - this.r) * lightingFactor + this.r);
    this.g = parseInt((255 - this.g) * lightingFactor + this.g);
    this.b = parseInt((255 - this.b) * lightingFactor + this.b);

    return this.init();
  }

  /**
   * In place darkens this Z4AbstractColor, the transparency is not changed
   *
   * @param darkeningFactor The darkening factor (in the range [0,1])
   * @return This darkened Z4AbstractColor
   */
  public T darkened(double darkeningFactor) {
    darkeningFactor = 1 - darkeningFactor;

    this.r = parseInt(darkeningFactor * this.r);
    this.g = parseInt(darkeningFactor * this.g);
    this.b = parseInt(darkeningFactor * this.b);

    return this.init();
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
}
