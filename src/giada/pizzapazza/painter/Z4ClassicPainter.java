package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The classic painter
 *
 * @author gianpiero.di.blasi
 */
public class Z4ClassicPainter extends Z4Painter<Z4ClassicPainter> {

  @Override
  public Z4ClassicPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    return this;
  }
}
