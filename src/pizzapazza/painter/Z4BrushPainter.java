package pizzapazza.painter;

import def.dom.CanvasGradient;
import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.util.Z4Constants;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import simulation.js.$Object;

/**
 * The painter representing a brush
 *
 * @author gianpiero.diblasi
 */
public class Z4BrushPainter extends Z4Painter {

  private final Z4FancifulValue width;
  private final Z4FancifulValue thickness;
  private final $Image pattern;

  /**
   * Creates the object
   *
   * @param width The width of the brush
   * @param thickness The thickness of the brush
   * @param pattern The pattern, it can be null
   */
  public Z4BrushPainter(Z4FancifulValue width, Z4FancifulValue thickness, $Image pattern) {
    super();

    this.width = width;
    this.thickness = thickness;
    this.pattern = pattern;
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.BRUSH;
  }

  /**
   * Returns the width of the brush
   *
   * @return The width of the brush
   */
  public Z4FancifulValue getWidth() {
    return this.width;
  }

  /**
   * Returns the thickness of the brush
   *
   * @return The thickness of the brush
   */
  public Z4FancifulValue getThickness() {
    return this.thickness;
  }

  /**
   * Returns the pattern
   *
   * @return The pattern
   */
  public $Image getPattern() {
    return this.pattern;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
      double currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      this.drawBounds(context, currentWidth);
    } else {
      double currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      double currentThickness = drawingPoint.intensity * this.thickness.next();

      if (currentWidth > 0 && currentThickness > 0) {
        if (spatioTemporalColor.isColor()) {
          Color color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, spatioTemporalColor.getGradientColorAt(-1), null, progression.getLighting());
          } else {
            Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

  private void drawWithColors($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, double currentWidth, double currentThickness, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    if ($exists(color)) {
      if (lighting == Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, color.getRGBA_HEX());
      } else if (lighting == Z4Lighting.LIGHTED) {
        CanvasGradient linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#FFFFFFFF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting == Z4Lighting.DARKENED) {
        CanvasGradient linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#000000FF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      }
    } else if ($exists(gradientColor)) {
      if (lighting == Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting == Z4Lighting.LIGHTED) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted().createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting == Z4Lighting.DARKENED) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened().createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      }
    }

    if ($exists(this.pattern)) {
      this.drawPattern(context, drawingPoint, currentWidth, currentThickness, context.createPattern(this.pattern, "repeat"));
    }
  }

  private void drawPath($CanvasRenderingContext2D context, double currentWidth, double currentThickness, Object color) {
    context.save();
    context.rotate(Z4Math.HALF_PI);
    context.lineCap = "round";
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.$getStyle(color);

    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();

    context.restore();
  }

  private void drawPattern($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, double currentWidth, double currentThickness, Object color) {
    context.save();
    context.rotate(-drawingPoint.z4Vector.phase);
    context.translate(-drawingPoint.z4Vector.x0, -drawingPoint.z4Vector.y0);

    context.lineCap = "round";
    context.lineWidth = currentThickness + 2;
    context.strokeStyle = Z4Constants.$getStyle(color);

    context.beginPath();
    Z4Point point = Z4Math.rotoTranslate(-currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.moveTo(point.x, point.y);
    point = Z4Math.rotoTranslate(currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.lineTo(point.x, point.y);
    context.stroke();

    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double currentWidth) {
    context.save();
    context.rotate(Z4Math.HALF_PI);

    context.strokeStyle = Z4Constants.$getStyle("gray");
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.beginPath();
    context.translate(1, 1);
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();

    context.restore();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("width", this.width.toJSON());
    json.$set("thickness", this.thickness.toJSON());

    if ($exists(this.pattern)) {
      $Canvas canvas = ($Canvas) document.createElement("canvas");
      canvas.width = this.pattern.width;
      canvas.height = this.pattern.height;

      $CanvasRenderingContext2D context = canvas.getContext("2d");
      context.drawImage(this.pattern, 0, 0);
      json.$set("pattern", canvas.toDataURL("image/png", 1));
    }

    return json;
  }

  /**
   * Creates a Z4BrushPainter from a JSON object
   *
   * @param json The JSON object
   * @return the brush painter
   */
  public static Z4BrushPainter fromJSON($Object json) {
    $Image pattern = null;
    if ($exists(json.$get("pattern"))) {
      pattern = new $Image();
      pattern.src = json.$get("pattern");
    }

    return new Z4BrushPainter(Z4FancifulValue.fromJSON(json.$get("width")), Z4FancifulValue.fromJSON(json.$get("thickness")), pattern);
  }
}
