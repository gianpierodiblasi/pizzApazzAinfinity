package pizzapazza.painter;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
public class Z4NaturalFigurePainter extends Z4Painter {

  /**
   * Creates the object
   */
  public Z4NaturalFigurePainter() {
    super();
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  @Override
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {

  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  public static Z4NaturalFigurePainter fromJSON($Object json) {
    return new Z4NaturalFigurePainter();
  }
}
