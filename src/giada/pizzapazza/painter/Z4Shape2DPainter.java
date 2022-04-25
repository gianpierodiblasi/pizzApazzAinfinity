package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
public class Z4Shape2DPainter implements Z4Painter<Z4Shape2DPainter> {

  @Override
  public Z4Shape2DPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    return this;
  }
}
