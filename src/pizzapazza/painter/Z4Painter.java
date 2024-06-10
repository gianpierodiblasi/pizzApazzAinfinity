package pizzapazza.painter;

import pizzapazza.util.Z4JSONable;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The common parent of all painters
 *
 * @author gianpiero.diblasi
 */
public interface Z4Painter extends Z4JSONable {

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   * @param spatioTemporalColor The color to use to perform the drawing
   */
  public abstract void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor);
}
