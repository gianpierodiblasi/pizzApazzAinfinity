package giada.pizzapazza.painter;

import def.js.Array;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.math.Z4Whirlpool;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * 
 *
 * @author gianpiero.diblasi
 */
public class Z4CenteredFigurePainter extends Z4Painter<Z4CenteredFigurePainter> {

  @Override
  public Z4CenteredFigurePainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    if (point.isDrawBounds()) {
      
    } else {
      double currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next());
      if (currentSize <= 0) {
        return this;
      }

      double currentHole = this.hole;
      double currentCover = this.cover / 100;
      point.setZ4Vector(Z4Vector.fromVector(currentHole, 0, currentSize, 0));
//      this.checkWhirlpool(point,currentHole);

      $Object pF;
      switch (this.type) {
        case 0:
        case 1:
        case 2:
          pF = this.type0_1_2(point, currentCover);
          break;
        case 3:
        case 4:
        case 5:
          pF = this.type3_4_5(point, currentHole, currentCover);
          break;
      }

      for (int i = 0; i < this.multiplicity.next(); i++) {
        switch (type) {
          case 0:
          case 1:
          case 2:
//          this.drawPath(point,pathForShadowBorderE,c1e,c2e,path1e,path2e,newColor);
            break;
          case 3:
          case 4:
          case 5:
//          this.drawPath(point,pathForShadowBorderI,c1i,c2i,path1i,path2i,newColor);
//          this.drawPath(point,pathForShadowBorderE,c1e,c2e,path1e,path2e,newColor);
            break;
        }
//            
//      canvas.rotate(360f/multiplicity);
      }

      //DA Z4Shape2D
//      double position = point.getColorPosition();
//      Z4Lighting lighting = point.getLighting();
//      if (position == -1) {
//        double currentSize = Math.max(currentWidth, currentHeight);
//
//        for (double scale = currentSize; scale > 0; scale--) {
//          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
//        }
//      } else if (lighting == Z4Lighting.NONE) {
//        this.drawPath(context, currentWidth, currentHeight, gradientColor.getZ4ColorAt(position, true, true));
//      } else {
//        double currentSize = Math.max(currentWidth, currentHeight);
//        Z4Color newColor = gradientColor.getZ4ColorAt(position, true, true);
//
//        for (double scale = currentSize; scale > 0; scale--) {
//          if (lighting == Z4Lighting.LIGHTED) {
//            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
//          } else if (lighting == Z4Lighting.DARKENED) {
//            this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
//          }
//        }
//      }
    }
  }

  

  

  private void drawPath($CanvasRenderingContext2D context, double scaleW, double scaleH, Z4Color color) {
//    context.save();
//    context.scale(scaleW, scaleH);
//    context.fillStyle = color.$getHEX();
//    context.fill(this.shape.getPath());
//    context.restore();
  }
}
