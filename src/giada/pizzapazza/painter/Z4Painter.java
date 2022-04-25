package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The common parent of all painters
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public interface Z4Painter<T extends Z4Painter<T>> {

  /**
   * Performs a drawing
   * @param context The context to perform the drawing
   * @param point The point where to perform the drawing
   * @param gradientColor The color to use to perform the drawing
   * @return This Z4Painter
   */
  public T draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor);
}
