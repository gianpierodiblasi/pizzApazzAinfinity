package pizzapazza.painter;

import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 *
 * @author gianpiero.diblasi
 */
public class Z4ArrowPainter implements Z4Painter {

  private final double module = 15;
  private boolean bool;

  @Override
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor) {
    this.bool = !this.bool;
    double x = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.module);

    context.save();
    context.lineWidth = 3;

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();

    context.strokeStyle = Z4Constants.$getStyle(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -2.5);
    context.lineTo(x - 5, +2.5);
    context.lineTo(x, 0);
    context.stroke();

    context.restore();
  }

  @Override
  public $Object toJSON() {
    return new $Object();
  }
}
