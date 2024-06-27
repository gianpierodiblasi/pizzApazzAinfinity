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
  private final Z4FancifulValue radius; // 10
  private final int intensity; // 20
  private final int gaussianCorrection; // 10

  /**
   * Creates the object
   *
   * @param dropPainterType The type of Z4DropPainter
   * @param radius The radius
   * @param intensity The intensity
   * @param gaussianCorrection The gaussian correction
   */
  public Z4DropPainter(Z4DropPainterType dropPainterType, Z4FancifulValue radius, int intensity, int gaussianCorrection) {
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
          this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

  private void drawWithColors($CanvasRenderingContext2D context, double currentRadius, double angle, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    double val = currentRadius * this.intensity / 2;
    double cos = Z4Math.SQRT_OF_2 * Math.cos(angle);
    double sin = Z4Math.SQRT_OF_2 * Math.sin(angle);

    for (int t = 0; t < val; t++) {
      if ($exists(color) && lighting == Z4Lighting.NONE) {

      } else {
        double rand = Z4Math.randomCorrected(gaussianCorrection / 10.0);
        if ($exists(spatioTemporalColor)) {
          color = spatioTemporalColor.getColorAt(-1, rand);
        } else if ($exists(gradientColor)) {
          color = gradientColor.getColorAt(rand, true);
        }

        if (lighting == Z4Lighting.NONE) {
          this.drawPath(context, currentRadius, rand, cos, sin, color);
        } else if (lighting == Z4Lighting.LIGHTED) {
          this.drawPath(context, currentRadius, rand, cos, sin, color.lighted(rand));
        } else if (lighting == Z4Lighting.DARKENED) {
          this.drawPath(context, currentRadius, rand, cos, sin, color.darkened(rand));
        }

      }
    }

  }

  private void drawPath($CanvasRenderingContext2D context, double currentRadius, double rand, double cos, double sin, Color color) {
    context.save();
    context.fillStyle = Z4Constants.$getStyle(color.getRGBA_HEX());

    double rr = rand * currentRadius;
    double alfa = Math.random() * Z4Math.TWO_PI;
    double rX = rr * Math.cos(alfa);
    double rY = rr * Math.sin(alfa);

    context.beginPath();
    if (this.dropPainterType == Z4DropPainterType.THOUSAND_POINTS) {
      context.arc(rX, rY, 1, 0, Z4Math.TWO_PI);
    } else if (this.dropPainterType == Z4DropPainterType.THOUSAND_LINES) {
      context.moveTo(rX + cos, rY + sin);
      context.lineTo(rX - cos, rY - sin);
    } else if (this.dropPainterType == Z4DropPainterType.THOUSAND_AREAS) {
      context.arc(rX, rY, 2, 0, Z4Math.TWO_PI);
    }
    context.fill();

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
    context.arc(0, 0, currentRadius, 0, Z4Math.TWO_PI);
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
