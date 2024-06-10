package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

public abstract class Z4Painter {

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param point The point where to perform the drawing
   * @param gradientColor The color to use to perform the drawing
   */
  public abstract void draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor);
}
