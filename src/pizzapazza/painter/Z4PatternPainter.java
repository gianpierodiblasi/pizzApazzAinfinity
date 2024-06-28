package pizzapazza.painter;

import def.js.Array;
import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Constants;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The painter representing one or more patterns
 *
 * @author gianpiero.diblasi
 */
public class Z4PatternPainter extends Z4Painter {

  private final Array<$Image> patterns;
  private final boolean randomSequence;
  private final boolean multiSize;

  private int index = -1;

  /**
   * Creates the object
   *
   * @param patterns The patterns
   * @param randomSequence true for a random sequence (the patterns are randomly
   * selected), false otherwise (the patterns are selected in a sequence)
   * @param multiSize true if each pattern can be resized, false otherwise (the
   * original dimensions are used)
   *
   */
  public Z4PatternPainter(Array<$Image> patterns, boolean randomSequence, boolean multiSize) {
    super();

    this.patterns = patterns;
    this.randomSequence = randomSequence;
    this.multiSize = multiSize;
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.PATTERN;
  }

  /**
   * Returns the patterns
   *
   * @return The patterns
   */
  public Array<$Image> getPatterns() {
    return this.patterns;
  }

  /**
   * Check if a random sequence is used
   *
   * @return true for a random sequence (the patterns are randomly selected),
   * false otherwise (the patterns are selected in a sequence)
   */
  public boolean isRandomSequence() {
    return this.randomSequence;
  }

  /**
   * Check if each pattern can be resized
   *
   * @return true if each pattern can be resized, false otherwise (the original
   * dimensions are used)
   */
  public boolean isMultiSize() {
    return this.multiSize;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if ($exists(this.patterns.length)) {
      if (this.randomSequence) {
        this.index = parseInt(this.patterns.length * Math.random());
      } else {
        this.index++;
        this.index %= this.patterns.length;
      }

      double scale = this.multiSize ? Math.random() : 1;
      double currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : scale * this.patterns.$get(this.index).width);
      double currentHeight = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : scale * this.patterns.$get(this.index).height);

      if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
        this.drawBounds(context, currentWidth, currentHeight);
      } else {
        this.drawPattern(context, this.patterns.$get(this.index), currentWidth, currentHeight);
      }
    }
  }

  private void drawPattern($CanvasRenderingContext2D context, $Image image, double currentWidth, double currentHeight) {
    context.save();
    context.drawImage(image, -currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight);
    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double currentWidth, double currentHeight) {
    context.save();

    context.strokeStyle = Z4Constants.$getStyle("gray");
    context.beginPath();
    context.ellipse(0, 0, currentWidth, currentHeight, 0, 0, Z4Math.TWO_PI);
    context.stroke();

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.beginPath();
    context.translate(1, 1);
    context.ellipse(0, 0, currentWidth, currentHeight, 0, 0, Z4Math.TWO_PI);
    context.stroke();

    context.restore();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    Array<String> base64 = new Array<>();
    this.patterns.forEach(pattern -> {
      $Canvas canvas = ($Canvas) document.createElement("canvas");
      canvas.width = pattern.width;
      canvas.height = pattern.height;

      $CanvasRenderingContext2D context = canvas.getContext("2d");
      context.drawImage(pattern, 0, 0);
      base64.push(canvas.toDataURL("image/png", 1));
    });
    json.$set("patterns", base64);

    json.$set("randomSequence", this.randomSequence);
    json.$set("multiSize", this.multiSize);
    return json;
  }

  /**
   * Creates a Z4PatternPainter from a JSON object
   *
   * @param json The JSON object
   * @return the pattern painter
   */
  @SuppressWarnings("unchecked")
  public static Z4PatternPainter fromJSON($Object json) {
    Array<$Image> patterns = new Array<>();
    ((Iterable<String>) json.$get("patterns")).forEach(base64 -> {
      $Image pattern = new $Image();
      pattern.src = base64;
      patterns.push(pattern);
    });

    return new Z4PatternPainter(patterns, json.$get("randomSequence"), json.$get("multiSize"));
  }
}
