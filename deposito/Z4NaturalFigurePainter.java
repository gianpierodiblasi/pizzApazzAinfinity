package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of natural figures
 *
 * @author gianpiero.di.blasi
 */
public class Z4NaturalFigurePainter extends Z4Painter<Z4NaturalFigurePainter> {

  @Override
  public Z4NaturalFigurePainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    return this;
  }

}
