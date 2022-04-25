package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4AbstractColor;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Shape2D;
import giada.pizzapazza.math.Z4Sign;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.di.blasi
 */
public class Z4Shape2DPainter extends Z4Painter<Z4Shape2DPainter> {

  private Z4Shape2D shape = Z4Shape2D.SQUARE;
  private final Z4FancifulValue size = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 50);

  private final Z4FancifulValue shadowShiftX = new Z4FancifulValue();
  private final Z4FancifulValue shadowShiftY = new Z4FancifulValue();
  private final Z4Color shadowColor = new Z4Color(255, 0, 0, 0);

  private final Z4FancifulValue borderSize = new Z4FancifulValue();
  private final Z4Color borderColor = new Z4Color(255, 0, 0, 0);

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
   * @param {number} fixedComponent The fixed component of the size
   * @param {number} randomComponent The random component of the size
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @return {} This Z4Shape2DPainter
   */
//  setSize(fixedComponent, randomComponent, z4RandomComponentSign) {
//    this.size = new Z4FancifulValue(fixedComponent, randomComponent, z4RandomComponentSign, Z4Sign.POSITIVE);
//    return this;
//  }
  /**
   * Sets the random component of the size
   *
   * @param {number} randomComponent The random component of the value
   * @param {Z4RandomBehaviour} randomComponentBehaviour The behaviour of the
   * random component
   * @param {number} randomComponentStep The step of the random component
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @return {} This Z4Shape2DPainter
   */
//  setRandomComponentSize(randomComponent, randomComponentBehaviour, randomComponentStep, z4RandomComponentSign) {
//    this.size.setRandom(randomComponent, randomComponentBehaviour, randomComponentStep, z4RandomComponentSign);
//    return this;
//  }
  /**
   * Sets the shadow
   *
   * @param {number} fixedComponentX The fixed component of the X shadow shift
   * @param {number} randomComponentX The random component of the X shadow shift
   * @param {number} fixedComponentY The fixed component of the Y shadow shift
   * @param {number} randomComponentY The random component of the Y shadow shift
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @param {Z4Color} shadowColor The shadow color
   * @return {} This Z4Shape2DPainter
   */
//  setShadow(fixedComponentX, randomComponentX, fixedComponentY, randomComponentY, z4RandomComponentSign, shadowColor) {
//    this.shadowShiftX = new Z4FancifulValue(fixedComponentX, randomComponentX, z4RandomComponentSign, Z4Sign.POSITIVE);
//    this.shadowShiftY = new Z4FancifulValue(fixedComponentY, randomComponentY, z4RandomComponentSign, Z4Sign.POSITIVE);
//    this.shadowColor = shadowColor;
//    return this;
//  }
  /**
   * Sets the border
   *
   * @param {number} fixedComponent The fixed component of the border size
   * @param {number} randomComponent The random component of the border size
   * @param {Z4Sign} z4RandomComponentSign The sign of the random component
   * @param {Z4Color} borderColor The border color
   * @return {} This Z4Shape2DPainter
   */
//  setBorder(fixedComponent, randomComponent, z4RandomComponentSign, borderColor) {
//    this.borderSize = new Z4FancifulValue(fixedComponent, randomComponent, z4RandomComponentSign, Z4Sign.POSITIVE);
//    this.borderColor = borderColor;
//    return this;
//  }
  @Override
  public Z4Shape2DPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    if (point.isDrawBounds()) {
      this.drawBounds(context, point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstantValue()));
    } else {
      double currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next(0));
      if (currentSize <= 0) {
        return this;
      }

      double currentShadowShiftX = point.getIntensity() * this.shadowShiftX.next(0);
      double currentShadowShiftY = point.getIntensity() * this.shadowShiftY.next(0);
      double currentBorderSize = point.getIntensity() * this.borderSize.next(0);

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
        Z4AbstractColor<?> newColor = gradientColor.getZ4ColorAt(position, true, true);

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

  private void drawPath($CanvasRenderingContext2D context, double scale, Z4AbstractColor<?> color) {
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

    context.strokeStyle = this.$getColor("white");
    context.stroke(this.shape.getPath());

    context.strokeStyle = this.$getColor("black");
    context.translate(1 / scale, 1 / scale);
    context.stroke(this.shape.getPath());

    context.restore();
  }
}
