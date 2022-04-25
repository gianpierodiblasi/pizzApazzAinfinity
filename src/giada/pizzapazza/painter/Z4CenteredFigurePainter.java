package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of centered figures
 *
 * @author gianpiero.di.blasi
 */
public class Z4CenteredFigurePainter extends Z4Painter<Z4CenteredFigurePainter> {

  @Override
  public Z4CenteredFigurePainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    return this;
  }
}
