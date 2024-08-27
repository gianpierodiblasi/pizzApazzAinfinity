/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2DPainter extends Z4Painter {

   width = null;

   height = null;

   regular = false;

   star = false;

   vertices = 0;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderWidth = null;

   borderHeight = null;

   borderColor = null;

   path = new Path2D();

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
  constructor(width, height, regular, star, vertices, shadowShiftX, shadowShiftY, shadowColor, borderWidth, borderHeight, borderColor) {
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
    if (vertices === -1) {
      this.path.arc(0, 0, 1, 0, Z4Math.TWO_PI);
    } else if (star) {
      Z4Math.getStarVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    } else {
      Z4Math.getPolygonVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    }
    this.path.closePath();
  }

   getType() {
    return Z4PainterType.SHAPE_2D;
  }

  /**
   * Returns the width
   *
   * @return The width
   */
   getWidth() {
    return this.width;
  }

  /**
   * Returns the height
   *
   * @return The height
   */
   getHeight() {
    return this.height;
  }

  /**
   * Checks if the shape is regular (width = height)
   *
   * @return true if the shape is regular (width = height), false otherwise
   */
   isRegular() {
    return this.regular;
  }

  /**
   * Checks if the shape is a star
   *
   * @return true if the shape is a star, false otherwise
   */
   isStar() {
    return this.star;
  }

  /**
   * Returns the number of vertices, -1 for an ellipse
   *
   * @return The number of vertices, -1 for an ellipse
   */
   getVertices() {
    return this.vertices;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
   getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
   getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
   getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border width
   *
   * @return The border width
   */
   getBorderWidth() {
    return this.borderWidth;
  }

  /**
   * Returns the border height
   *
   * @return The border height
   */
   getBorderHeight() {
    return this.borderHeight;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
   getBorderColor() {
    return this.borderColor;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let scaleW = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      let scaleH = this.regular ? scaleW : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      let currentHeight = this.regular ? currentWidth : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.next());
      if (currentWidth > 0 && currentHeight > 0) {
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderWidth = this.borderWidth.next();
        let currentBorderHeight = this.borderHeight.next();
        if (currentShadowShiftX || currentShadowShiftY) {
          context.save();
          context.translate(currentShadowShiftX, currentShadowShiftY);
          this.drawPath(context, currentWidth + (currentBorderWidth > 0 ? currentBorderWidth : 0), currentHeight + (currentBorderHeight > 0 ? currentBorderHeight : 0), this.shadowColor);
          context.restore();
        }
        if (currentBorderWidth > 0 || currentBorderHeight > 0) {
          this.drawPath(context, currentWidth + currentBorderWidth, currentHeight + currentBorderHeight, this.borderColor);
        }
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawPathWithColors(context, currentWidth, currentHeight, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawPathWithColors(context, currentWidth, currentHeight, spatioTemporalColor, gradientColor, color, lighting) {
    if (color && lighting === Z4Lighting.NONE) {
      this.drawPath(context, currentWidth, currentHeight, color);
    } else {
      let currentSize = Math.max(currentWidth, currentHeight);
      for (let scale = currentSize; scale > 0; scale--) {
        if (spatioTemporalColor) {
          color = spatioTemporalColor.getColorAt(-1, scale / currentSize);
        } else if (gradientColor) {
          color = gradientColor.getColorAt(scale / currentSize, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color);
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(scale / currentSize));
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(scale / currentSize));
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(1 - scale / currentSize));
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(1 - scale / currentSize));
        }
      }
    }
  }

   drawPath(context, scaleW, scaleH, color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.fill(this.path);
    context.restore();
  }

   drawBounds(context, scaleW, scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.stroke(this.path);
    context.strokeStyle = Z4Constants.getStyle("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.path);
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["width"] = this.width.toJSON();
    json["height"] = this.height.toJSON();
    json["regular"] = this.regular;
    json["star"] = this.star;
    json["vertices"] = this.vertices;
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    json["shadowColor"] = this.shadowColor.getJSON();
    json["borderWidth"] = this.borderWidth.toJSON();
    json["borderHeight"] = this.borderHeight.toJSON();
    json["borderColor"] = this.borderColor.getJSON();
    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  static  fromJSON(json) {
    return new Z4Shape2DPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["height"]), json["regular"], json["star"], json["vertices"], Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), Color.fromJSON(json["shadowColor"]), Z4FancifulValue.fromJSON(json["borderWidth"]), Z4FancifulValue.fromJSON(json["borderHeight"]), Color.fromJSON(json["borderColor"]));
  }
}
