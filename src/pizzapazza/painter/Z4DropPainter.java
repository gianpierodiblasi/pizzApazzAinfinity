package pizzapazza.painter;

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
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * The painter of drops
 *
 * @author gianpiero.diblasi
 */
public class Z4DropPainter extends Z4Painter {

  private final Z4DropPainterType dropPainterType;
  private final Z4FancifulValue radius;
  private final int intensity;
  private final int gaussianCorrection;

  /**
   * Creates the object
   *
   * @param dropPainterType The type of Z4DropPainter
   * @param radius The radius
   * @param intensity The intensity
   * @param gaussianCorrection The gaussian correction
   */
  public Z4DropPainter(Z4DropPainterType dropPainterType, Z4FancifulValue radius, int intensity, int gaussianCorrection) {
    super();

    this.dropPainterType = dropPainterType;
    this.radius = radius;
    this.intensity = intensity;
    this.gaussianCorrection = gaussianCorrection;
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.DROP;
  }

  /**
   * Returns the type of Z4DropPainter
   *
   * @return The type of Z4DropPainter
   */
  public Z4DropPainterType getDropPainterType() {
    return this.dropPainterType;
  }

  /**
   * Returns the radius
   *
   * @return The radius
   */
  public Z4FancifulValue getRadius() {
    return this.radius;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
  public int getIntensity() {
    return this.intensity;
  }

  /**
   * Returns the gaussian correction
   *
   * @return The gaussian correction
   */
  public int getGaussianCorrection() {
    return this.gaussianCorrection;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
      double currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.getConstant().getValue());
      this.drawBounds(context, currentRadius);
    } else {
      double currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.next());

      if (currentRadius > 0) {
        if (spatioTemporalColor.isColor()) {
          Color color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentRadius, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentRadius, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

  @SuppressWarnings("null")
  private void drawWithColors($CanvasRenderingContext2D context, double currentRadius, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    double val = currentRadius * this.intensity / 2;

    for (int t = 0; t < val; t++) {
      double r = currentRadius * Z4Math.randomCorrected(this.gaussianCorrection / 10.0);

      if ($exists(color) && lighting == Z4Lighting.NONE) {
        this.drawPath(context, r, color);
      } else {
        Color c = null;
        if ($exists(spatioTemporalColor)) {
          c = spatioTemporalColor.getColorAt(-1, r / currentRadius);
        } else if ($exists(gradientColor)) {
          c = gradientColor.getColorAt(r / currentRadius, true);
        }

        if (lighting == Z4Lighting.NONE) {
          this.drawPath(context, r, c);
        } else if (lighting == Z4Lighting.LIGHTED) {
          this.drawPath(context, r, c.lighted(r / currentRadius));
        } else if (lighting == Z4Lighting.DARKENED) {
          this.drawPath(context, r, c.darkened(r / currentRadius));
        }

      }
    }
  }

  private void drawPath($CanvasRenderingContext2D context, double radius, Color color) {
    context.save();
    context.fillStyle = Z4Constants.$getStyle(color.getRGBA_HEX());
    context.strokeStyle = Z4Constants.$getStyle(color.getRGBA_HEX());

    double alfa = Math.random() * Z4Math.TWO_PI;
    double rX = radius * Math.cos(alfa);
    double rY = radius * Math.sin(alfa);

    context.beginPath();
    if (this.dropPainterType == Z4DropPainterType.THOUSAND_POINTS) {
      context.arc(rX, rY, 1, 0, Z4Math.TWO_PI);
      context.fill();
    } else if (this.dropPainterType == Z4DropPainterType.THOUSAND_LINES) {
      context.moveTo(rX + Z4Math.SQRT_OF_2, rY);
      context.lineTo(rX - Z4Math.SQRT_OF_2, rY);
      context.stroke();
    } else if (this.dropPainterType == Z4DropPainterType.THOUSAND_AREAS) {
      context.arc(rX, rY, 2, 0, Z4Math.TWO_PI);
      context.fill();
    }

    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double currentRadius) {
    context.save();

    context.strokeStyle = Z4Constants.$getStyle("gray");
    context.beginPath();
    context.arc(0, 0, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.beginPath();
    context.arc(1, 1, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();

    context.restore();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("dropPainterType", this.dropPainterType);
    json.$set("radius", this.radius.toJSON());
    json.$set("regular", this.intensity);
    json.$set("star", this.gaussianCorrection);
    return json;
  }

  /**
   * Creates a Z4DropPainter from a JSON object
   *
   * @param json The JSON object
   * @return the drop painter
   */
  public static Z4DropPainter fromJSON($Object json) {
    return new Z4DropPainter(json.$get("dropPainterType"), Z4FancifulValue.fromJSON(json.$get("radius")), json.$get("intensity"), json.$get("gaussianCorrection"));
  }
}
