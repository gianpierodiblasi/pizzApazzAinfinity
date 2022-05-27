package giada.pizzapazza.painter;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import jsweet.util.union.Union4;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The common parent of all painters
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4Painter<T extends Z4Painter<T>> {

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param point The point where to perform the drawing
   * @param gradientColor The color to use to perform the drawing
   * @return This Z4Painter
   */
  public abstract T draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor);

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  protected String getColor(String color) {
    return color;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param color The color
   * @return NOTHING
   */
  protected Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getColor(String color) {
    return null;
  }
}
