package giada.pizzapazza.color;

/**
 * The gradient color (a sequence of Z4StopColor)
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColor extends Z4AbstractGradientColor<Z4GradientColor> {

  /**
   * Creates a Z4GradientColor
   */
  public Z4GradientColor() {
    super();
  }

  /**
   * Creates a Z4GradientColor from a Z4AbstractGradientColor
   *
   * @param color The Z4AbstractGradientColor
   * @return The Z4GradientColor
   */
  public static Z4GradientColor fromZ4AbstractGradientColor(Z4AbstractGradientColor<?> color) {
    Z4GradientColor z4GradientColor = new Z4GradientColor();
    color.getComponents().forEach(z4StopColor -> z4GradientColor.addOrUpdateColor(z4StopColor.getPosition(), z4StopColor.getARGB()));
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
  public static Z4GradientColor fromZ4AbstractGradientColors(Z4AbstractGradientColor<?> before, Z4AbstractGradientColor<?> after, double div) {
    Z4GradientColor z4GradientColor = new Z4GradientColor();

    before.getComponents().forEach(z4StopColorBefore -> {
      Z4AbstractColor<?> z4StopColorAfter = after.getZ4ColorAt(z4StopColorBefore.getPosition(), false, false);
      Z4Color color = Z4Color.fromZ4AbstractColors(z4StopColorBefore, z4StopColorAfter, div);
      z4GradientColor.addOrUpdateColor(z4StopColorBefore.getPosition(), color.getARGB());
    });

    return z4GradientColor;
  }
}
