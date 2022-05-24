package giada.pizzapazza.color;

import def.js.RegExp;
import def.js.RegExpExecArray;
import static simulation.js.$Globals.parseInt;

/**
 * The stop color in a sequence
 *
 * @author gianpiero.di.blasi
 */
public class Z4StopColor extends Z4AbstractColor<Z4StopColor> {

  private double position;

  /**
   * Creates a Z4StopColor
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   * @param position The position in a sequence (in the range [0,1])
   */
  public Z4StopColor(int a, int r, int g, int b, double position) {
    super(a, r, g, b);

    this.position = position;
  }

  /**
   * Returns the position
   *
   * @return The position in a sequence (in the range [0,1])
   */
  public double getPosition() {
    return this.position;
  }

  /**
   * Sets the position
   *
   * @param position The position in a sequence (in the range [0,1])
   * @return This Z4StopColor
   */
  public Z4StopColor setPosition(double position) {
    this.position = position;
    return this;
  }

  /**
   * Creates a Z4StopColor from an ARGB integer color
   *
   * @param color The color
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  public static Z4StopColor fromARGB(int color, double position) {
    return new Z4StopColor(color >>> 24 & 0xff, color >>> 16 & 0xff, color >>> 8 & 0xff, color & 0xff, position);
  }

  /**
   * Creates a Z4StopColor from an RGB hex string
   *
   * @param color The color
   * @param a The transparency component
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  public static Z4StopColor fromHEX(String color, int a, double position) {
    RegExpExecArray result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4StopColor(a, parseInt(result.$get(1), 16), parseInt(result.$get(2), 16), parseInt(result.$get(3), 16), position);
  }

  /**
   * Creates a Z4StopColor from a Z4AbstractColor
   *
   * @param color The Z4AbstractColor
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  public static Z4StopColor fromZ4AbstractColor(Z4AbstractColor<?> color, double position) {
    return Z4StopColor.fromARGB(color.getARGB(), position);
  }
}