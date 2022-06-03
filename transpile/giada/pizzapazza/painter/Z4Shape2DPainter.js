/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainter extends Z4Painter {

   shape = Z4Shape2D.SQUARE;

   size = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE));

   shadowShiftX = new Z4FancifulValue();

   shadowShiftY = new Z4FancifulValue();

   shadowColor = new Z4Color(255, 0, 0, 0);

   borderSize = new Z4FancifulValue();

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
   * @param size The size
   * @return This Z4Shape2DPainter
   */
   setSize(size) {
    this.size = size;
    return this;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return this.size;
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
   * Sets the border
   *
   * @param borderSize The border size
   * @param borderColor The border color
   * @return This Z4Shape2DPainter
   */
   setBorder(borderSize, borderColor) {
    this.borderSize = borderSize;
    this.borderColor = borderColor;
    return this;
  }

   draw(context, point, gradientColor) {
    if (point.isDrawBounds()) {
      this.drawBounds(context, point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstant().getValue()));
    } else {
      let currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next());
      if (currentSize <= 0) {
        return this;
      }
      let currentShadowShiftX = point.getIntensity() * this.shadowShiftX.next();
      let currentShadowShiftY = point.getIntensity() * this.shadowShiftY.next();
      let currentBorderSize = point.getIntensity() * this.borderSize.next();
      if (currentShadowShiftX || currentShadowShiftY) {
        context.save();
        context.translate(currentShadowShiftX, currentShadowShiftY);
        this.drawPath(context, currentSize + (currentBorderSize > 0 ? currentBorderSize : 0), this.shadowColor);
        context.restore();
      }
      if (currentBorderSize) {
        context.save();
        this.drawPath(context, currentSize + currentBorderSize, this.borderColor);
        context.restore();
      }
      let position = point.getColorPosition();
      let lighting = point.getLighting();
      if (position === -1) {
        for (let scale = currentSize; scale > 0; scale--) {
          this.drawPath(context, scale, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        }
      } else if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentSize, gradientColor.getZ4ColorAt(position, true, true));
      } else {
        let newColor = gradientColor.getZ4ColorAt(position, true, true);
        for (let scale = currentSize; scale > 0; scale--) {
          if (lighting === Z4Lighting.LIGHTED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
          } else if (lighting === Z4Lighting.DARKENED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
          }
        }
      }
    }
    return this;
  }

   drawPath(context, scale, color) {
    context.save();
    context.scale(scale, scale);
    context.fillStyle = color.getHEX();
    context.fill(this.shape.getPath());
    context.restore();
  }

   drawBounds(context, scale) {
    context.save();
    context.scale(scale, scale);
    context.lineWidth = 1 / scale;
    context.strokeStyle = this.getColor("gray");
    context.stroke(this.shape.getPath());
    context.strokeStyle = this.getColor("black");
    context.translate(1 / scale, 1 / scale);
    context.stroke(this.shape.getPath());
    context.restore();
  }
}
