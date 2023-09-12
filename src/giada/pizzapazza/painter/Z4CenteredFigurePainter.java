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
 * The painter of centered figures
 *
 * @author gianpiero.diblasi
 */
public class Z4CenteredFigurePainter extends Z4Painter<Z4CenteredFigurePainter> {

  private final int type;

  private Z4FancifulValue size = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private Z4FancifulValue angle1 = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue angle2 = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private Z4FancifulValue tension = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(3).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(3).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private int hole;
  private Z4Whirlpool whirlpool = Z4Whirlpool.none();
  private int cover = 100;

  private Z4CenteredFigurePainter(int type) {
    this.type = type;
  }

  @Override
  public Z4CenteredFigurePainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    if (point.isDrawBounds()) {
      double currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstant().getValue());

      double currentHole = this.hole;
      point.setZ4Vector(Z4Vector.fromVector(currentHole, 0, currentSize, 0));
//      this.checkWhirlpool(point, currentHole);
      this.drawBounds(context, point, currentHole);
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

    return this;
  }

  private void drawBounds($CanvasRenderingContext2D context, Z4Point point, double currentHole) {
    //ANDROID
    //for (int i=0;i<multiplicity;i++)
//    {
//      transparentLayerWhiteCanvas.drawLine(currentHole,0,point.vector[2],point.vector[3],paint);
//      transparentLayerWhiteCanvas.rotate(360f/multiplicity);
//    }
//    
//    paint.setPathEffect(dashPathEffect);
//    for (int i=0;i<multiplicity;i++)
//    {
//      transparentLayerBlackCanvas.drawLine(currentHole,0,point.vector[2],point.vector[3],paint);
//      transparentLayerBlackCanvas.rotate(360f/multiplicity);
//    }

//Z4Shape2D
//    context.save();
//    context.scale(scaleW, scaleH);
//    context.lineWidth = 1 / Math.min(scaleW, scaleH);
//
//    context.strokeStyle = Z4Color.$getFillStyle("gray");
//    context.stroke(this.shape.getPath());
//
//    context.strokeStyle = Z4Color.$getFillStyle("black");
//    context.translate(1 / scaleW, 1 / scaleH);
//    context.stroke(this.shape.getPath());
//
//    context.restore();
  }

  //One Bezier curve. Start and end point coincide in the fulcrum
  private $Object type0_1_2(Z4Point point, double currentCover) {

    Array<$Object> ce = Z4Math.butterfly(point.getZ4Vector(), Z4Math.deg2rad(this.angle1.next()));
    $Object pF = new $Object();
    pF.$set("x", point.getZ4Vector().getX0());
    pF.$set("y", point.getZ4Vector().getY0());

    $Object path1e = null;
    $Object path2e = null;
    switch (this.type) {
      // The control points collapse towards the fulcrum
      case 0:
        path1e = this.findControlPointPath(ce.$get(0).$get("x"), ce.$get(0).$get("y"), point.getZ4Vector().getX0(), point.getZ4Vector().getY0(), currentCover);
        path2e = this.findControlPointPath(ce.$get(1).$get("x"), ce.$get(1).$get("y"), point.getZ4Vector().getX0(), point.getZ4Vector().getY0(), currentCover);
        break;
      // The control points collapse towards newPoint
      case 1:
        path1e = this.findControlPointPath(ce.$get(0).$get("x"), ce.$get(0).$get("y"), point.getZ4Vector().getX(), point.getZ4Vector().getY(), currentCover);
        path2e = this.findControlPointPath(ce.$get(1).$get("x"), ce.$get(1).$get("y"), point.getZ4Vector().getX(), point.getZ4Vector().getY(), currentCover);
        break;
      // The control points collapse towards their midpoint
      case 2:
        double mx = ((double) ce.$get(0).$get("x") + (double) ce.$get(1).$get("x")) / 2;
        double my = ((double) ce.$get(0).$get("y") + (double) ce.$get(1).$get("y")) / 2;
        path1e = this.findControlPointPath(ce.$get(0).$get("x"), ce.$get(0).$get("y"), mx, my, currentCover);
        path2e = this.findControlPointPath(ce.$get(1).$get("x"), ce.$get(1).$get("y"), mx, my, currentCover);
        break;
    }
//    
//    if (shadow||border)
//    {
//      pathForShadowBorderE.reset();
//      pathForShadowBorderE.moveTo(point.vector[0],point.vector[1]);
//      pathForShadowBorderE.cubicTo(c1e[0],c1e[1],c2e[0],c2e[1],point.vector[0],point.vector[1]);
//    }
//
    return pF;
  }

  //Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
  private $Object type3_4_5(Z4Point point, double currentHole, double currentCover) {
    $Object pF = new $Object();
    pF.$set("x", point.getZ4Vector().getX());
    pF.$set("y", point.getZ4Vector().getY());

    switch (this.type) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      case 3:
//        this.setControlPoint(c1e,currentHole,0,angle1,1,tension,point);
//        this.setControlPoint(c1i,currentHole,0,angle1,-1,tension,point);
//        this.setControlPoint(c2e,currentHole,-180,angle2,-1,tension,point);
//        this.setControlPoint(c2i,currentHole,-180,angle2,1,tension,point);
//        matrix.setTranslate(point.vector[4],0);
//        matrix.mapPoints(c2e);
//        matrix.mapPoints(c2i);
//        
//        this.checkWhirlpool(point,c1e,c1i,currentHole);
//        this.checkWhirlpool(point,c2e,c2i,currentHole);
//        this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[0],point.vector[1],currentCover);
//        this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[2],point.vector[3],currentCover);
//        this.findControlPointPath(path1i,c1i[0],c1i[1],point.vector[0],point.vector[1],currentCover);
//        this.findControlPointPath(path2i,c2i[0],c2i[1],point.vector[2],point.vector[3],currentCover);
        break;
//      //Il secondo punto di controllo e' fisso sul fulcro, il primo punto collassa verso il fulcro
      case 4:
//        c2e[0]=point.vector[0];
//        c2e[1]=point.vector[1];
//        path2e[0]=0;
//        path2e[1]=0;
//        c2i[0]=point.vector[0];
//        c2i[1]=point.vector[1];
//        path2i[0]=0;
//        path2i[1]=0;
//        
//        this.setControlPoint(c1e,currentHole,0,angle1,1,tension,point);
//        this.setControlPoint(c1i,currentHole,0,angle1,-1,tension,point);
//        
//        this.checkWhirlpool(point,c1e,c1i,currentHole);
//        this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[0],point.vector[1],currentCover);
//        this.findControlPointPath(path1i,c1i[0],c1i[1],point.vector[0],point.vector[1],currentCover);
        break;
//      //Il primo punto di controllo e' fisso su newPoint, il secondo punto collassa verso newPoint
      case 5:
//        c1e[0]=point.vector[2];
//        c1e[1]=point.vector[3];
//        path1e[0]=0;
//        path1e[1]=0;
//        c1i[0]=point.vector[2];
//        c1i[1]=point.vector[3];
//        path1i[0]=0;
//        path1i[1]=0;
//        
//        this.setControlPoint(c2e,currentHole,-180,angle2,-1,tension,point);
//        this.setControlPoint(c2i,currentHole,-180,angle2,1,tension,point);
//        matrix.setTranslate(point.vector[4],0);
//        matrix.mapPoints(c2e);
//        matrix.mapPoints(c2i);
//        
//        this.checkWhirlpool(point,c2e,c2i,currentHole);
//        this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[2],point.vector[3],currentCover);
//        this.findControlPointPath(path2i,c2i[0],c2i[1],point.vector[2],point.vector[3],currentCover);
        break;
    }
//    
//    if (shadow || border) {
//      pathForShadowBorderE.reset();
//      pathForShadowBorderE.moveTo(point.vector[0],point.vector[1]);
//      pathForShadowBorderE.cubicTo(c1e[0],c1e[1],c2e[0],c2e[1],point.vector[2],point.vector[3]);
//      pathForShadowBorderI.reset();
//      pathForShadowBorderI.moveTo(point.vector[0],point.vector[1]);
//      pathForShadowBorderI.cubicTo(c1i[0],c1i[1],c2i[0],c2i[1],point.vector[2],point.vector[3]);
//    }
//
    return pF;
  }

  private $Object findControlPointPath(double p1x, double p1y, double p2x, double p2y, double currentCover) {
    double module = Z4Math.distance(p1x, p1y, p2x, p2y);
    double phase = Z4Math.atan(p1x, p1y, p2x, p2y);

    $Object path = new $Object();
    path.$set("x", module * currentCover * Math.cos(phase));
    path.$set("y", module * currentCover * Math.sin(phase));
    return path;
  }

  private void drawPath($CanvasRenderingContext2D context, double scaleW, double scaleH, Z4Color color) {
//    context.save();
//    context.scale(scaleW, scaleH);
//    context.fillStyle = color.$getHEX();
//    context.fill(this.shape.getPath());
//    context.restore();
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 0
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type0() {
    return new Z4CenteredFigurePainter(0);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 1
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type1() {
    return new Z4CenteredFigurePainter(1);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 2
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type2() {
    return new Z4CenteredFigurePainter(2);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 3
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type3() {
    return new Z4CenteredFigurePainter(3);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 4
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type4() {
    return new Z4CenteredFigurePainter(4);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 5
   *
   * @return The Z4CenteredFigurePainter
   */
  public static Z4CenteredFigurePainter type5() {
    return new Z4CenteredFigurePainter(5);
  }
}
