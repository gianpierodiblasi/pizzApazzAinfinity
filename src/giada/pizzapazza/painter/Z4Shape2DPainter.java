package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Shape2D;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedValue;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
public class Z4Shape2DPainter extends Z4Painter<Z4Shape2DPainter> {

  private Z4Shape2D shape = Z4Shape2D.SQUARE;
  private Z4FancifulValue size = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE));

  private Z4FancifulValue shadowShiftX = new Z4FancifulValue();
  private Z4FancifulValue shadowShiftY = new Z4FancifulValue();
  private Z4Color shadowColor = new Z4Color(255, 0, 0, 0);

  private Z4FancifulValue borderSize = new Z4FancifulValue();
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
   * Sets the size
   *
   * @param size The size
   * @return This Z4Shape2DPainter
   */
  public Z4Shape2DPainter setSize(Z4FancifulValue size) {
    this.size = size;
    return this;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
  public Z4FancifulValue getSize() {
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
  public Z4Shape2DPainter setShadow(Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Z4Color shadowColor) {
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
  public Z4Shape2DPainter setBorder(Z4FancifulValue borderSize, Z4Color borderColor) {
    this.borderSize = borderSize;
    this.borderColor = borderColor;
    return this;
  }

  @Override
  public Z4Shape2DPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    if (point.isDrawBounds()) {
      this.drawBounds(context, point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstant().getValue()));
    } else {
      double currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next());
      if (currentSize <= 0) {
        return this;
      }

      double currentShadowShiftX = point.getIntensity() * this.shadowShiftX.next();
      double currentShadowShiftY = point.getIntensity() * this.shadowShiftY.next();
      double currentBorderSize = point.getIntensity() * this.borderSize.next();

      if ($exists(currentShadowShiftX) || $exists(currentShadowShiftY)) {
        context.save();
        context.translate(currentShadowShiftX, currentShadowShiftY);
        this.drawPath(context, currentSize + (currentBorderSize > 0 ? currentBorderSize : 0), this.shadowColor);
        context.restore();
      }

      if ($exists(currentBorderSize)) {
        context.save();
        this.drawPath(context, currentSize + currentBorderSize, this.borderColor);
        context.restore();
      }

      double position = point.getColorPosition();
      Z4Lighting lighting = point.getLighting();
      if (position == -1) {
        for (double scale = currentSize; scale > 0; scale--) {
          this.drawPath(context, scale, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        }
      } else if (lighting == Z4Lighting.NONE) {
        this.drawPath(context, currentSize, gradientColor.getZ4ColorAt(position, true, true));
      } else {
        Z4Color newColor = gradientColor.getZ4ColorAt(position, true, true);

        for (double scale = currentSize; scale > 0; scale--) {
          if (lighting == Z4Lighting.LIGTHED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
          } else if (lighting == Z4Lighting.DARKENED) {
            this.drawPath(context, scale, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
          }
        }
      }
    }

    return this;
  }

  private void drawPath($CanvasRenderingContext2D context, double scale, Z4Color color) {
    context.save();
    context.scale(scale, scale);
    context.fillStyle = color.$getHEX();
    context.fill(this.shape.getPath());
    context.restore();
  }

  private void drawBounds($CanvasRenderingContext2D context, double scale) {
    context.save();
    context.scale(scale, scale);
    context.lineWidth = 1 / scale;

    context.strokeStyle = this.$getColor("gray");
    context.stroke(this.shape.getPath());

    context.strokeStyle = this.$getColor("black");
    context.translate(1 / scale, 1 / scale);
    context.stroke(this.shape.getPath());

    context.restore();
  }
}
