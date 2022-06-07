/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainter extends Z4Painter {

   shape = Z4Shape2D.SQUARE;

   width = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE));

   height = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE));

   regular = false;

   shadowShiftX = new Z4FancifulValue();

   shadowShiftY = new Z4FancifulValue();

   shadowColor = new Z4Color(255, 0, 0, 0);

   borderWidth = new Z4FancifulValue();

   borderHeight = new Z4FancifulValue();

   borderColor = new Z4Color(255, 0, 0, 0);

  /**
   * Sets the shape
   *
   * @param shape The shape
   * @return This Z4Shape2DPainter
   */
   setShape2D(shape) {
    this.shape = shape;
    return this;
  }

  /**
   * Returns the shape
   *
   * @return The shape
   */
   getShape() {
    return this.shape;
  }

  /**
   * Sets the size
   *
   * @param width The width
   * @param height The height
   * @param regular true if the shape is regular (width = height), false
   * otherwise
   * @return This Z4Shape2DPainter
   */
   setSize(width, height, regular) {
    this.width = width;
    this.height = height;
    this.regular = regular;
    return this;
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
   * Sets the shadow
   *
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @return This Z4Shape2DPainter
   */
   setShadow(shadowShiftX, shadowShiftY, shadowColor) {
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    return this;
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
   * Sets the border
   *
   * @param borderWidth The border width
   * @param borderHeight The border height
   * @param borderColor The border color
   * @return This Z4Shape2DPainter
   */
   setBorder(borderWidth, borderHeight, borderColor) {
    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.borderColor = borderColor;
    return this;
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

   draw(context, point, gradientColor) {
    if (point.isDrawBounds()) {
      let scaleW = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.width.getConstant().getValue());
      let scaleH = this.regular ? scaleW : point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      let currentWidth = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.width.next());
      let currentHeight = this.regular ? currentWidth : point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.height.next());
      if (currentWidth <= 0 || currentHeight <= 0) {
        return this;
      }
      let currentShadowShiftX = point.getIntensity() * this.shadowShiftX.next();
      let currentShadowShiftY = point.getIntensity() * this.shadowShiftY.next();
      let currentBorderWidth = point.getIntensity() * this.borderWidth.next();
      let currentBorderHeight = point.getIntensity() * this.borderHeight.next();
      if (currentShadowShiftX > 0 || currentShadowShiftY > 0) {
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
      let position = point.getColorPosition();
      let lighting = point.getLighting();
      if (position === -1) {
        let currentSize = Math.max(currentWidth, currentHeight);
        for (let scale = currentSize; scale > 0; scale--) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        }
      } else if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentHeight, gradientColor.getZ4ColorAt(position, true, true));
      } else {
        let currentSize = Math.max(currentWidth, currentHeight);
        let newColor = gradientColor.getZ4ColorAt(position, true, true);
        for (let scale = currentSize; scale > 0; scale--) {
          if (lighting === Z4Lighting.LIGHTED) {
            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
          } else if (lighting === Z4Lighting.DARKENED) {
            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
          }
        }
      }
    }
    return this;
  }

   drawPath(context, scaleW, scaleH, color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = color.getHEX();
    context.fill(this.shape.getPath());
    context.restore();
  }

   drawBounds(context, scaleW, scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);
    context.strokeStyle = this.getColor("gray");
    context.stroke(this.shape.getPath());
    context.strokeStyle = this.getColor("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.shape.getPath());
    context.restore();
  }
}
