package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Shape2D;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4Shape2DPainter extends Z4Painter<Z4Shape2DPainter> {

  private Z4Shape2D shape = Z4Shape2D.SQUARE;
  private Z4FancifulValue width = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue height = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private boolean regular;

  private Z4FancifulValue shadowShiftX = new Z4FancifulValue();
  private Z4FancifulValue shadowShiftY = new Z4FancifulValue();
  private Z4Color shadowColor = new Z4Color(255, 0, 0, 0);

  private Z4FancifulValue borderWidth = new Z4FancifulValue().setConstant(new Z4SignedValue().setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue borderHeight = new Z4FancifulValue().setConstant(new Z4SignedValue().setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4Color borderColor = new Z4Color(255, 0, 0, 0);

  /**
   * Sets the shape
   *
   * @param shape The shape
   * @return This Z4Shape2DPainter
   */
  public Z4Shape2DPainter setShape2D(Z4Shape2D shape) {
    this.shape = shape;
    return this;
  }

  /**
   * Returns the shape
   *
   * @return The shape
   */
  public Z4Shape2D getShape() {
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
  public Z4Shape2DPainter setSize(Z4FancifulValue width, Z4FancifulValue height, boolean regular) {
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
   * Sets the shadow
   *
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @return This Z4Shape2DPainter
   */
  public Z4Shape2DPainter setShadow(Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Z4Color shadowColor) {
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
  public Z4Color getShadowColor() {
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
  public Z4Shape2DPainter setBorder(Z4FancifulValue borderWidth, Z4FancifulValue borderHeight, Z4Color borderColor) {
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
  public Z4Color getBorderColor() {
    return this.borderColor;
  }

  @Override
  public Z4Shape2DPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    if (point.isDrawBounds()) {
      double scaleW = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.width.getConstant().getValue());
      double scaleH = this.regular ? scaleW : point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      double currentWidth = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.width.next());
      double currentHeight = this.regular ? currentWidth : point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.height.next());
      if (currentWidth <= 0 || currentHeight <= 0) {
        return this;
      }

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

      double position = point.getColorPosition();
      Z4Lighting lighting = point.getLighting();
      if (position == -1) {
        double currentSize = Math.max(currentWidth, currentHeight);

        for (double scale = currentSize; scale > 0; scale--) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        }
      } else if (lighting == Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentHeight, gradientColor.getZ4ColorAt(position, true, true));
      } else {
        double currentSize = Math.max(currentWidth, currentHeight);
        Z4Color newColor = gradientColor.getZ4ColorAt(position, true, true);

        for (double scale = currentSize; scale > 0; scale--) {
          if (lighting == Z4Lighting.LIGHTED) {
            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
          } else if (lighting == Z4Lighting.DARKENED) {
            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
          }
        }
      }
    }

    return this;
  }

  private void drawPath($CanvasRenderingContext2D context, double scaleW, double scaleH, Z4Color color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = color.$getHEX();
    context.fill(this.shape.getPath());
    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double scaleW, double scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);

    context.strokeStyle = Z4Color.$getFillStyle("gray");
    context.stroke(this.shape.getPath());

    context.strokeStyle = Z4Color.$getFillStyle("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.shape.getPath());

    context.restore();
  }
}
