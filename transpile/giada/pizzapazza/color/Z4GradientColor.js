/* global Z4Color, Z4GradientColor */

/**
 * The gradient color (a sequence of Z4StopColor)
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

  /**
   * Creates a Z4GradientColor
   */
  constructor() {
    super();
  }

  /**
   * Creates a Z4GradientColor from a Z4AbstractGradientColor
   *
   * @param color The Z4AbstractGradientColor
   * @return The Z4GradientColor
   */
  static  fromZ4AbstractGradientColor(color) {
    let z4GradientColor = new Z4GradientColor();
    color.getComponents().forEach(z4StopColor => z4GradientColor.addOrUpdateColor(z4StopColor.getPosition(), z4StopColor.getARGB()));
    return z4GradientColor;
  }

  /**
   * Creates a Z4GradientColor from two Z4AbstractGradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4GradientColor
   */
  static  fromZ4AbstractGradientColors(before, after, div) {
    let z4GradientColor = new Z4GradientColor();
    before.getComponents().forEach(z4StopColorBefore => {
      let z4StopColorAfter = after.getZ4ColorAt(z4StopColorBefore.getPosition(), false, false);
      let color = Z4Color.fromZ4AbstractColors(z4StopColorBefore, z4StopColorAfter, div);
      z4GradientColor.addOrUpdateColor(z4StopColorBefore.getPosition(), color.getARGB());
    });
    return z4GradientColor;
  }
}
