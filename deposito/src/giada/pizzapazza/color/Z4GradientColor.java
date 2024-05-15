package giada.pizzapazza.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import giada.pizzapazza.math.Z4Math;
import jsweet.util.union.Union4;
import simulation.dom.$CanvasRenderingContext2D;

public class Z4GradientColor {
  /**
   * Returns a linear gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @return The linear gradient
   */
  public CanvasGradient getLinearGradient($CanvasRenderingContext2D context, double x1, double y1, double x2, double y2) {
    CanvasGradient gradient = context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getLinearGradient($CanvasRenderingContext2D context, double x1, double y1, double x2, double y2) {
    return null;
  }

  /**
   * Returns a radial gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start circle
   * @param y1 The y-axis coordinate of the start circle
   * @param r1 The radius of the start circle
   * @param x2 The x-axis coordinate of the end circle
   * @param y2 The y-axis coordinate of the end circle
   * @param r2 The radius of the end circle
   * @return The radial gradient
   */
  public CanvasGradient getRadialGradient($CanvasRenderingContext2D context, double x1, double y1, double r1, double x2, double y2, double r2) {
    CanvasGradient gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x1 The x-axis coordinate of the start circle
   * @param y1 The y-axis coordinate of the start circle
   * @param r1 The radius of the start circle
   * @param x2 The x-axis coordinate of the end circle
   * @param y2 The y-axis coordinate of the end circle
   * @param r2 The radius of the end circle
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getRadialGradient($CanvasRenderingContext2D context, double x1, double y1, double r1, double x2, double y2, double r2) {
    return null;
  }

  /**
   * Returns a conic gradient (without ripple and mirroring)
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return The conic gradient
   */
  public CanvasGradient getConicGradient($CanvasRenderingContext2D context, double x, double y, double angle) {
    CanvasGradient gradient = context.createConicGradient(angle, x, y);
    gradient.addColorStop(0, this.start.getHEX());
    gradient.addColorStop(1, this.stop.getHEX());
    return gradient;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param context The context to create the gradient
   * @param x The x-axis coordinate of the centre of the gradient
   * @param y The y-axis coordinate of the centre of the gradient
   * @param angle The angle at which to begin the gradient, in radians
   * @return NOTHING
   */
  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getConicGradient($CanvasRenderingContext2D context, double x, double y, double angle) {
    return null;
  }

  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between before and after (in the range [0,1],
   * 0=before, 1=after)
   * @return The Z4GradientColor
   */
  public static Z4GradientColor fromZ4GradientColors(Z4GradientColor before, Z4GradientColor after, double div) {
    return new Z4GradientColor().
            setStartColor(Z4Color.fromZ4Colors(before.getStartColor(), after.getStartColor(), div).getARGB()).
            setStopColor(Z4Color.fromZ4Colors(before.getStopColor(), after.getStopColor(), div).getARGB()).
            setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }

  /**
   * Creates a Z4GradientColor from two Z4GradientColor
   *
   * @param before The color before
   * @param after The color after
   * @param div The percentage between start and stop in the before and after
   * colors (in the range [0,1], 0=start, 1=stop)
   * @return The Z4GradientColor
   */
  public static Z4GradientColor fromStartStopZ4GradientColors(Z4GradientColor before, Z4GradientColor after, double div) {
    return new Z4GradientColor().
            setStartColor(before.getZ4ColorAt(div, false, false).getARGB()).
            setStopColor(after.getZ4ColorAt(div, false, false).getARGB()).
            setRipple(before.getRipple()).setMirrored(before.isMirrored());
  }
}
