/**
 * The painter representing a brush
 *
 * @author gianpiero.diblasi
 */
class Z4BrushPainter extends Z4Painter {

  // =new CRPvalue(10,0,0);
   width = null;

  // =new CRPvalue(2,1,0);
   thickness = null;

  /**
   * Creates the object
   *
   * @param width The width of the brush
   * @param thickness The thickness of the brush
   */
  constructor(width, thickness) {
    super();
    this.width = width;
    this.thickness = thickness;
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

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      this.drawBounds(context, currentWidth);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      let currentThickness = drawingPoint.intensity * this.thickness.next();
      if (currentWidth > 0 && currentThickness > 0) {
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, currentWidth, currentThickness, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentWidth, currentThickness, spatioTemporalColor.getGradientColorAt(-1), null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentWidth, currentThickness, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentWidth, currentThickness, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, currentWidth, currentThickness, gradientColor, color, lighting) {
    // if (ww > halfWidth) { // dovrei aggiungere la property border
    // double cos = Math.cos(rot + randAddingRotation);
    // double sen = Math.sin(rot + randAddingRotation);
    // double x1 = point.x + cos * ww;
    // double y1 = point.y + sen * ww;
    // double x2 = point.x - cos * ww;
    // double y2 = point.y - sen * ww;
    // Line2D line = new Line2D.Double(x1, y1, x2, y2);
    // 
    // g2.setStroke(new BasicStroke((int) Math.ceil(tt), BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
    // if (effect == this.NO_EFFECT) {
    // g2.setPaint(addingColor.getLocalColor(color).getMultiLinearPaint(point, new Point2D.Double(x2, y2), false));
    // } else if (effect == this.PATTERN_EFFECT) {
    // g2.setPaint(new TexturePaint(pattern, rect));
    // }
    // g2.draw(line);
    // }
    // 
    // if (effect == this.NO_EFFECT) {
    // g2.setPaint(color.getMultiLinearPaint(point, new Point2D.Double(x2, y2), false));
    // } else if (effect == this.PATTERN_EFFECT) {
    // g2.setPaint(new TexturePaint(pattern, rect));
    // }
    // 
    if (color) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, color.getRGBA_HEX());
      } else if (lighting === Z4Lighting.LIGHTED) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#FFFFFFFF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.DARKENED) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#000000FF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      }
    } else if (gradientColor) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.LIGHTED) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted().createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.DARKENED) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened().createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      }
    }
  }

   drawPath(context, currentWidth, currentThickness, color) {
    context.save();
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.getStyle(color);
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.restore();
  }

   drawBounds(context, currentWidth) {
    context.save();
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
    return json;
  }

  /**
   * Creates a Z4BrushPainter from a JSON object
   *
   * @param json The JSON object
   * @return the brush painter
   */
  static  fromJSON(json) {
    return new Z4BrushPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["thickness"]));
  }
}