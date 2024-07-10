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
import simulation.js.$Path2D;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4Shape2DPainter extends Z4Painter {

  private final Z4FancifulValue width;
  private final Z4FancifulValue height;
  private final boolean regular;
  private final boolean star;
  private final int vertices;

  private final Z4FancifulValue shadowShiftX;
  private final Z4FancifulValue shadowShiftY;
  private final Color shadowColor;

  private final Z4FancifulValue borderWidth;
  private final Z4FancifulValue borderHeight;
  private final Color borderColor;

  private final $Path2D path = new $Path2D();

  /**
   * Creates the object
   *
   * @param width The width
   * @param height The height
   * @param regular true if the shape is regular (width = height), false
   * otherwise
   * @param star true if the shape is a star, false otherwise
   * @param vertices The number of vertices, -1 for an ellipse
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderWidth The border width
   * @param borderHeight The border height
   * @param borderColor The border color
   */
  public Z4Shape2DPainter(
          Z4FancifulValue width, Z4FancifulValue height, boolean regular, boolean star, int vertices,
          Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Color shadowColor,
          Z4FancifulValue borderWidth, Z4FancifulValue borderHeight, Color borderColor) {
    super();

    this.width = width;
    this.height = height;
    this.regular = regular;
    this.star = star;
    this.vertices = vertices;

    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;

    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.borderColor = borderColor;

    if (vertices == -1) {
      this.path.arc(0, 0, 1, 0, Z4Math.TWO_PI);
    } else if (star) {
      Z4Math.getStarVertices(vertices).forEach((point, index, array) -> {
        if ($exists(index)) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    } else {
      Z4Math.getPolygonVertices(vertices).forEach((point, index, array) -> {
        if ($exists(index)) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    }
    this.path.closePath();
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.SHAPE_2D;
  }

  /**
   * Returns the width
   *
   * @return The width
   */
  public Z4FancifulValue getWidth() {
    return this.width;
  }

  /**
   * Returns the height
   *
   * @return The height
   */
  public Z4FancifulValue getHeight() {
    return this.height;
  }

  /**
   * Checks if the shape is regular (width = height)
   *
   * @return true if the shape is regular (width = height), false otherwise
   */
  public boolean isRegular() {
    return this.regular;
  }

  /**
   * Checks if the shape is a star
   *
   * @return true if the shape is a star, false otherwise
   */
  public boolean isStar() {
    return this.star;
  }

  /**
   * Returns the number of vertices, -1 for an ellipse
   *
   * @return The number of vertices, -1 for an ellipse
   */
  public int getVertices() {
    return this.vertices;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
  public Z4FancifulValue getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
  public Z4FancifulValue getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
  public Color getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border width
   *
   * @return The border width
   */
  public Z4FancifulValue getBorderWidth() {
    return this.borderWidth;
  }

  /**
   * Returns the border height
   *
   * @return The border height
   */
  public Z4FancifulValue getBorderHeight() {
    return this.borderHeight;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
  public Color getBorderColor() {
    return this.borderColor;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
      double scaleW = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      double scaleH = this.regular ? scaleW : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      double currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      double currentHeight = this.regular ? currentWidth : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.next());

      if (currentWidth > 0 && currentHeight > 0) {
        double currentShadowShiftX = this.shadowShiftX.next();
        double currentShadowShiftY = this.shadowShiftY.next();
        double currentBorderWidth = this.borderWidth.next();
        double currentBorderHeight = this.borderHeight.next();

        if ($exists(currentShadowShiftX) || $exists(currentShadowShiftY)) {
          context.save();
          context.translate(currentShadowShiftX, currentShadowShiftY);
          this.drawPath(context, currentWidth + (currentBorderWidth > 0 ? currentBorderWidth : 0), currentHeight + (currentBorderHeight > 0 ? currentBorderHeight : 0), this.shadowColor);
          context.restore();
        }

        if (currentBorderWidth > 0 || currentBorderHeight > 0) {
          context.save();
          this.drawPath(context, currentWidth + currentBorderWidth, currentHeight + currentBorderHeight, this.borderColor);
          context.restore();
        }

        if (spatioTemporalColor.isColor()) {
          Color color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
            this.drawPathWithColors(context, currentWidth, currentHeight, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

  private void drawPathWithColors($CanvasRenderingContext2D context, double currentWidth, double currentHeight, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    if ($exists(color) && lighting == Z4Lighting.NONE) {
      this.drawPath(context, currentWidth, currentHeight, color);
    } else {
      double currentSize = Math.max(currentWidth, currentHeight);
      for (double scale = currentSize; scale > 0; scale--) {
        if ($exists(spatioTemporalColor)) {
          color = spatioTemporalColor.getColorAt(-1, scale / currentSize);
        } else if ($exists(gradientColor)) {
          color = gradientColor.getColorAt(scale / currentSize, true);
        }

        if (lighting == Z4Lighting.NONE) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color);
        } else if (lighting == Z4Lighting.LIGHTED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(scale / currentSize));
        } else if (lighting == Z4Lighting.DARKENED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(scale / currentSize));
        } else if (lighting == Z4Lighting.LIGHTED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(1 - scale / currentSize));
        } else if (lighting == Z4Lighting.DARKENED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(1 - scale / currentSize));
        }
      }
    }
  }

  private void drawPath($CanvasRenderingContext2D context, double scaleW, double scaleH, Color color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = Z4Constants.$getStyle(color.getRGBA_HEX());
    context.fill(this.path);
    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double scaleW, double scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);

    context.strokeStyle = Z4Constants.$getStyle("gray");
    context.stroke(this.path);

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.path);

    context.restore();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("width", this.width.toJSON());
    json.$set("height", this.height.toJSON());
    json.$set("regular", this.regular);
    json.$set("star", this.star);
    json.$set("vertices", this.vertices);

    json.$set("shadowShiftX", this.shadowShiftX.toJSON());
    json.$set("shadowShiftY", this.shadowShiftY.toJSON());
    json.$set("shadowColor", this.shadowColor.getJSON());

    json.$set("borderWidth", this.borderWidth.toJSON());
    json.$set("borderHeight", this.borderHeight.toJSON());
    json.$set("borderColor", this.borderColor.getJSON());

    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  public static Z4Shape2DPainter fromJSON($Object json) {
    return new Z4Shape2DPainter(
            Z4FancifulValue.fromJSON(json.$get("width")), Z4FancifulValue.fromJSON(json.$get("height")), json.$get("regular"), json.$get("star"), json.$get("vertices"),
            Z4FancifulValue.fromJSON(json.$get("shadowShiftX")), Z4FancifulValue.fromJSON(json.$get("shadowShiftY")), Color.fromJSON(json.$get("shadowColor")),
            Z4FancifulValue.fromJSON(json.$get("borderWidth")), Z4FancifulValue.fromJSON(json.$get("borderHeight")), Color.fromJSON(json.$get("borderColor"))
    );
  }
}
