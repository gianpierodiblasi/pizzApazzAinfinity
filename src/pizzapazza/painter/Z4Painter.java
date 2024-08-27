package pizzapazza.painter;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.util.Z4JSONable;
import pizzapazza.util.Z4Kaleidoscope;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The common parent of all painters
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4Painter implements Z4JSONable {

  /**
   * Returns the painter type
   *
   * @return The painter type
   */
  public abstract Z4PainterType getType();

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   * @param spatioTemporalColor The color to use to perform the drawing
   * @param progression The color progression to use to perform the drawing
   * @param kaleidoscope The kaleidoscope to use to perform the drawing
   */
  public abstract void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression, Z4Kaleidoscope kaleidoscope);

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("type", this.getType());
    return json;
  }
}
