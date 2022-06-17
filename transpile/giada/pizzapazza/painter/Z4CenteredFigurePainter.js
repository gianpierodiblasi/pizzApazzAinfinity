/**
 * The painter of centered figures
 *
 * @author gianpiero.di.blasi
 */
class Z4CenteredFigurePainter extends Z4Painter {

   type = 0;

   size = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   angle1 = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   angle2 = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   tension = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(3).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(3).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

   hole = 0;

   whirlpool = Z4Whirlpool.none();

   cover = 100;

  constructor(type) {
    this.type = type;
  }

   draw(context, point, gradientColor) {
    if (point.isDrawBounds()) {
      let currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.getConstant().getValue());
      let currentHole = this.hole;
      point.setZ4Vector(Z4Vector.fromVector(currentHole, 0, currentSize, 0));
      // this.checkWhirlpool(point, currentHole);
      this.drawBounds(context, point, currentHole);
    } else {
      let currentSize = point.getIntensity() * (point.isUseVectorModuleAsSize() ? 2 * point.getZ4Vector().getModule() : this.size.next());
      if (currentSize <= 0) {
        return this;
      }
      let currentHole = this.hole;
      let currentCover = this.cover / 100;
      point.setZ4Vector(Z4Vector.fromVector(currentHole, 0, currentSize, 0));
      // this.checkWhirlpool(point,currentHole);
      switch(this.type) {
        case 0:
        case 1:
        case 2:
          this.type0_1_2(point, currentCover);
          break;
        case 3:
        case 4:
        case 5:
          this.type3_4_5(point, currentHole, currentCover);
          break;
      }
      for (let i = 0; i < this.multiplicity.next(); i++) {
        switch(type) {
          case 0:
          case 1:
          case 2:
            // this.drawPath(point,pathForShadowBorderE,c1e,c2e,path1e,path2e,newColor);
            break;
          case 3:
          case 4:
          case 5:
            // this.drawPath(point,pathForShadowBorderI,c1i,c2i,path1i,path2i,newColor);
            // this.drawPath(point,pathForShadowBorderE,c1e,c2e,path1e,path2e,newColor);
            break;
        }
        // 
        // canvas.rotate(360f/multiplicity);
      }
      // DA Z4Shape2D
      // double position = point.getColorPosition();
      // Z4Lighting lighting = point.getLighting();
      // if (position == -1) {
      // double currentSize = Math.max(currentWidth, currentHeight);
      // 
      // for (double scale = currentSize; scale > 0; scale--) {
      // this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
      // }
      // } else if (lighting == Z4Lighting.NONE) {
      // this.drawPath(context, currentWidth, currentHeight, gradientColor.getZ4ColorAt(position, true, true));
      // } else {
      // double currentSize = Math.max(currentWidth, currentHeight);
      // Z4Color newColor = gradientColor.getZ4ColorAt(position, true, true);
      // 
      // for (double scale = currentSize; scale > 0; scale--) {
      // if (lighting == Z4Lighting.LIGHTED) {
      // this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).lighted(scale / currentSize));
      // } else if (lighting == Z4Lighting.DARKENED) {
      // this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, Z4Color.fromARGB(newColor.getARGB()).darkened(scale / currentSize));
      // }
      // }
      // }
    }
    return this;
  }

   drawBounds(context, point, currentHole) {
    // ANDROID
    // for (int i=0;i<multiplicity;i++)
    // {
    // transparentLayerWhiteCanvas.drawLine(currentHole,0,point.vector[2],point.vector[3],paint);
    // transparentLayerWhiteCanvas.rotate(360f/multiplicity);
    // }
    // 
    // paint.setPathEffect(dashPathEffect);
    // for (int i=0;i<multiplicity;i++)
    // {
    // transparentLayerBlackCanvas.drawLine(currentHole,0,point.vector[2],point.vector[3],paint);
    // transparentLayerBlackCanvas.rotate(360f/multiplicity);
    // }
    // Z4Shape2D
    // context.save();
    // context.scale(scaleW, scaleH);
    // context.lineWidth = 1 / Math.min(scaleW, scaleH);
    // 
    // context.strokeStyle = Z4Color.$getFillStyle("gray");
    // context.stroke(this.shape.getPath());
    // 
    // context.strokeStyle = Z4Color.$getFillStyle("black");
    // context.translate(1 / scaleW, 1 / scaleH);
    // context.stroke(this.shape.getPath());
    // 
    // context.restore();
  }

  // One Bezier curve. Start and end point coincide in the fulcrum
   type0_1_2(point, currentCover) {
    let ce = Z4Math.butterfly(point.getZ4Vector(), Z4Math.deg2rad(this.angle1.next()));
    // pF[0]=point.vector[0];
    // pF[1]=point.vector[1];
    // 
    switch(this.type) {
      // The control points collapse towards the fulcrum
      case 0:
        // this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[0],point.vector[1],currentCover);
        // this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[0],point.vector[1],currentCover);
        break;
      // The control points collapse towards newPoint
      case 1:
        // this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[2],point.vector[3],currentCover);
        // this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[2],point.vector[3],currentCover);
        break;
      // The control points collapse towards their midpoint
      case 2:
        // float mx=(c1e[0]+c2e[0])/2;
        // float my=(c1e[1]+c2e[1])/2;
        // this.findControlPointPath(path1e,c1e[0],c1e[1],mx,my,currentCover);
        // this.findControlPointPath(path2e,c2e[0],c2e[1],mx,my,currentCover);
        break;
    }
    // 
    // if (shadow||border)
    // {
    // pathForShadowBorderE.reset();
    // pathForShadowBorderE.moveTo(point.vector[0],point.vector[1]);
    // pathForShadowBorderE.cubicTo(c1e[0],c1e[1],c2e[0],c2e[1],point.vector[0],point.vector[1]);
    // }
  }

  // Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
   type3_4_5(point, currentHole, currentCover) {
    // pF[0]=point.vector[2];
    // pF[1]=point.vector[3];
    // 
    // switch (this.type)
    // {
    // //Un punto di controllo collassa verso il fulcro, l'altro punto verso newPoint
    // case TYPE_3:
    // this.setControlPoint(c1e,currentHole,0,angle1,1,tension,point);
    // this.setControlPoint(c1i,currentHole,0,angle1,-1,tension,point);
    // this.setControlPoint(c2e,currentHole,-180,angle2,-1,tension,point);
    // this.setControlPoint(c2i,currentHole,-180,angle2,1,tension,point);
    // matrix.setTranslate(point.vector[4],0);
    // matrix.mapPoints(c2e);
    // matrix.mapPoints(c2i);
    // 
    // this.checkWhirlpool(point,c1e,c1i,currentHole);
    // this.checkWhirlpool(point,c2e,c2i,currentHole);
    // this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[0],point.vector[1],currentCover);
    // this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[2],point.vector[3],currentCover);
    // this.findControlPointPath(path1i,c1i[0],c1i[1],point.vector[0],point.vector[1],currentCover);
    // this.findControlPointPath(path2i,c2i[0],c2i[1],point.vector[2],point.vector[3],currentCover);
    // break;
    // //Il secondo punto di controllo e' fisso sul fulcro, il primo punto collassa verso il fulcro
    // case TYPE_4:
    // c2e[0]=point.vector[0];
    // c2e[1]=point.vector[1];
    // path2e[0]=0;
    // path2e[1]=0;
    // c2i[0]=point.vector[0];
    // c2i[1]=point.vector[1];
    // path2i[0]=0;
    // path2i[1]=0;
    // 
    // this.setControlPoint(c1e,currentHole,0,angle1,1,tension,point);
    // this.setControlPoint(c1i,currentHole,0,angle1,-1,tension,point);
    // 
    // this.checkWhirlpool(point,c1e,c1i,currentHole);
    // this.findControlPointPath(path1e,c1e[0],c1e[1],point.vector[0],point.vector[1],currentCover);
    // this.findControlPointPath(path1i,c1i[0],c1i[1],point.vector[0],point.vector[1],currentCover);
    // break;
    // //Il primo punto di controllo e' fisso su newPoint, il secondo punto collassa verso newPoint
    // case TYPE_5:
    // c1e[0]=point.vector[2];
    // c1e[1]=point.vector[3];
    // path1e[0]=0;
    // path1e[1]=0;
    // c1i[0]=point.vector[2];
    // c1i[1]=point.vector[3];
    // path1i[0]=0;
    // path1i[1]=0;
    // 
    // this.setControlPoint(c2e,currentHole,-180,angle2,-1,tension,point);
    // this.setControlPoint(c2i,currentHole,-180,angle2,1,tension,point);
    // matrix.setTranslate(point.vector[4],0);
    // matrix.mapPoints(c2e);
    // matrix.mapPoints(c2i);
    // 
    // this.checkWhirlpool(point,c2e,c2i,currentHole);
    // this.findControlPointPath(path2e,c2e[0],c2e[1],point.vector[2],point.vector[3],currentCover);
    // this.findControlPointPath(path2i,c2i[0],c2i[1],point.vector[2],point.vector[3],currentCover);
    // break;
    // }
    // if (shadow||border)
    // {
    // pathForShadowBorderE.reset();
    // pathForShadowBorderE.moveTo(point.vector[0],point.vector[1]);
    // pathForShadowBorderE.cubicTo(c1e[0],c1e[1],c2e[0],c2e[1],point.vector[2],point.vector[3]);
    // pathForShadowBorderI.reset();
    // pathForShadowBorderI.moveTo(point.vector[0],point.vector[1]);
    // pathForShadowBorderI.cubicTo(c1i[0],c1i[1],c2i[0],c2i[1],point.vector[2],point.vector[3]);
    // }
  }

   drawPath(context, scaleW, scaleH, color) {
    // context.save();
    // context.scale(scaleW, scaleH);
    // context.fillStyle = color.$getHEX();
    // context.fill(this.shape.getPath());
    // context.restore();
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 0
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type0() {
    return new Z4CenteredFigurePainter(0);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 1
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type1() {
    return new Z4CenteredFigurePainter(1);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 2
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type2() {
    return new Z4CenteredFigurePainter(2);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 3
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type3() {
    return new Z4CenteredFigurePainter(3);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 4
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type4() {
    return new Z4CenteredFigurePainter(4);
  }

  /**
   * Returns a Z4CenteredFigurePainter of type 5
   *
   * @return The Z4CenteredFigurePainter
   */
  static  type5() {
    return new Z4CenteredFigurePainter(5);
  }
}
