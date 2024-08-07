/**
 * The painter representing a brush
 *
 * @author gianpiero.diblasi
 */
class Z4BrushPainter extends Z4Painter {

   width = null;

   thickness = null;

   pattern = null;

  /**
   * Creates the object
   *
   * @param width The width of the brush
   * @param thickness The thickness of the brush
   * @param pattern The pattern, it can be null
   */
  constructor(width, thickness, pattern) {
    super();
    this.width = width;
    this.thickness = thickness;
    this.pattern = pattern;
  }

   getType() {
    return Z4PainterType.BRUSH;
  }

  /**
   * Returns the width of the brush
   *
   * @return The width of the brush
   */
   getWidth() {
    return this.width;
  }

  /**
   * Returns the thickness of the brush
   *
   * @return The thickness of the brush
   */
   getThickness() {
    return this.thickness;
  }

  /**
   * Returns the pattern
   *
   * @return The pattern
   */
   getPattern() {
    return this.pattern;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      let currentThickness = drawingPoint.intensity * this.thickness.getConstant().getValue();
      this.drawBounds(context, currentWidth, currentThickness);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      let currentThickness = drawingPoint.intensity * this.thickness.next();
      if (currentWidth > 0 && currentThickness > 0) {
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, spatioTemporalColor.getGradientColorAt(-1), null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, drawingPoint, currentWidth, currentThickness, gradientColor, color, lighting) {
    if (color) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, color.getRGBA_HEX());
      } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#FFFFFFFF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#000000FF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, "#FFFFFFFF");
        linearGradient.addColorStop(1, color.getRGBA_HEX());
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, "#000000FF");
        linearGradient.addColorStop(1, color.getRGBA_HEX());
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      }
    } else if (gradientColor) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted(true).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened(true).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted(false).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened(false).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      }
    }
    if (this.pattern) {
      this.drawPattern(context, drawingPoint, currentWidth, currentThickness, context.createPattern(this.pattern, "repeat"));
    }
  }

   drawPath(context, currentWidth, currentThickness, color) {
    context.save();
    context.rotate(Z4Math.HALF_PI);
    context.lineCap = "round";
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.getStyle(color);
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.restore();
  }

   drawPattern(context, drawingPoint, currentWidth, currentThickness, color) {
    context.save();
    context.rotate(-drawingPoint.z4Vector.phase);
    context.translate(-drawingPoint.z4Vector.x0, -drawingPoint.z4Vector.y0);
    context.lineCap = "round";
    context.lineWidth = currentThickness + 2;
    context.strokeStyle = Z4Constants.getStyle(color);
    context.beginPath();
    let point = Z4Math.rotoTranslate(-currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.moveTo(point.x, point.y);
    point = Z4Math.rotoTranslate(currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
  }

   drawBounds(context, currentWidth, currentThickness) {
    context.save();
    context.rotate(Z4Math.HALF_PI);
    context.lineCap = "round";
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.translate(1, 1);
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["width"] = this.width.toJSON();
    json["thickness"] = this.thickness.toJSON();
    if (this.pattern) {
      let canvas = document.createElement("canvas");
      canvas.width = this.pattern.width;
      canvas.height = this.pattern.height;
      let context = canvas.getContext("2d");
      context.drawImage(this.pattern, 0, 0);
      json["pattern"] = canvas.toDataURL("image/png", 1);
    }
    return json;
  }

  /**
   * Creates a Z4BrushPainter from a JSON object
   *
   * @param json The JSON object
   * @return the brush painter
   */
  static  fromJSON(json) {
    let pattern = null;
    if (json["pattern"]) {
      pattern = new Image();
      pattern.src = json["pattern"];
    }
    return new Z4BrushPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["thickness"]), pattern);
  }
}
