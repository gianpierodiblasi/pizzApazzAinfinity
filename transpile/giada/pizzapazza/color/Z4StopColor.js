/* global RegExp, Z4StopColor, parseInt */

/**
 * The stop color in a sequence
 *
 * @author gianpiero.di.blasi
 */
class Z4StopColor extends Z4AbstractColor {

   position = 0.0;

  /**
   * Creates a Z4StopColor
   *
   * @param a The transparency component
   * @param r The red component
   * @param g The green component
   * @param b The blue component
   * @param position The position in a sequence (in the range [0,1])
   */
  constructor(a, r, g, b, position) {
    super(a, r, g, b);
    this.position = position;
  }

  /**
   * Returns the position
   * @return The position in a sequence (in the range [0,1])
   */
   getPosition() {
    return position;
  }

  /**
   * Sets the position
   * @param position The position in a sequence (in the range [0,1])
   */
   setPosition(position) {
    this.position = position;
  }

  /**
   * Creates a Z4StopColor from an ARGB integer color
   *
   * @param color The color
   * @param position The position in a sequence (in the range [0,1])
   * @return The Z4StopColor
   */
  static  fromARGB(color, position) {
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
  static  fromHEX(color, a, position) {
    let result = new RegExp("^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$", "i").exec(color);
    return new Z4StopColor(a, parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), position);
  }
}
