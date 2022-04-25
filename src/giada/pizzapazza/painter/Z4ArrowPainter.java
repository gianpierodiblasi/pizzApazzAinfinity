package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
public class Z4ArrowPainter implements Z4Painter<Z4ArrowPainter> {

  @Override
  public Z4ArrowPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    return this;
  }
}
