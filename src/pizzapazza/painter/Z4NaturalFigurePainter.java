package pizzapazza.painter;

import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
public class Z4NaturalFigurePainter extends Z4Painter {

  private final Z4NaturalFigurePainterType naturalFigurePainterType;
  private final Z4NaturalFigurePainterControlPointClosure controlPointClosure;

  private final Z4FancifulValue size;
  private final Z4FancifulValue internalAngle1;// = 45
  private final Z4FancifulValue externalAngle1;// = 45;
  private final Z4FancifulValue internalAngle2;// = 45;
  private final Z4FancifulValue externalAngle2;// = 45;

  private final Z4FancifulValue internalTension1;// = 3;
  private final Z4FancifulValue externalTension1;// = 3;
  private final Z4FancifulValue internalTension2;// = 3;
  private final Z4FancifulValue externalTension2;// = 3;

  private final int indentation; //Frastagliatura

  private final Z4FancifulValue externalForceAngle;
  private final Z4FancifulValue externalForceTension;

  private final Z4FancifulValue shadowShiftX;
  private final Z4FancifulValue shadowShiftY;
  private final Color shadowColor;

  private final Z4FancifulValue borderSize;
  private final Color borderColor;

  private Z4Point path1;
  private Z4Point path2;

  private Z4Point c1e;
  private Z4Point c1i;
  private Z4Point c2e;
  private Z4Point c2i;

  private Z4Point pF;

  private $Path2D pathForShadowBorderE;
  private $Path2D pathForShadowBorderI;

  /**
   * Creates the object
   *
   * @param naturalFigurePainterType The type of Z4NaturalFigurePainter
   * @param controlPointClosure The control point closure of
   * Z4NaturalFigurePainter
   * @param size The size
   * @param internalAngle1 The angle of the first internal control point
   * @param externalAngle1 The angle of the first external control point
   * @param internalAngle2 The angle of the second internal control point
   * @param externalAngle2 The angle of the second external control point
   * @param internalTension1 The tension of the first internal control point
   * @param externalTension1 The tension of the first external control point
   * @param internalTension2 The tension of the second internal control point
   * @param externalTension2 The tension of the second external control point
   * @param indentation The indentation
   * @param externalForceAngle The angle of the external force
   * @param externalForceTension The tension of the external force
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderSize The border size
   * @param borderColor The border color
   */
  public Z4NaturalFigurePainter(Z4NaturalFigurePainterType naturalFigurePainterType, Z4NaturalFigurePainterControlPointClosure controlPointClosure,
          Z4FancifulValue size,
          Z4FancifulValue internalAngle1, Z4FancifulValue externalAngle1, Z4FancifulValue internalAngle2, Z4FancifulValue externalAngle2,
          Z4FancifulValue internalTension1, Z4FancifulValue externalTension1, Z4FancifulValue internalTension2, Z4FancifulValue externalTension2,
          int indentation,
          Z4FancifulValue externalForceAngle, Z4FancifulValue externalForceTension,
          Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Color shadowColor,
          Z4FancifulValue borderSize, Color borderColor) {
    super();

    this.naturalFigurePainterType = naturalFigurePainterType;
    this.controlPointClosure = controlPointClosure;

    this.size = size;

    this.internalAngle1 = internalAngle1;
    this.externalAngle1 = externalAngle1;
    this.internalAngle2 = internalAngle2;
    this.externalAngle2 = externalAngle2;

    this.internalTension1 = internalTension1;
    this.externalTension1 = externalTension1;
    this.internalTension2 = internalTension2;
    this.externalTension2 = externalTension2;

    this.indentation = indentation;

    this.externalForceAngle = externalForceAngle;
    this.externalForceTension = externalForceTension;

    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;

    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  /**
   * Returns the type of Z4NaturalFigurePainter
   *
   * @return The type of Z4NaturalFigurePainter
   */
  public Z4NaturalFigurePainterType getNaturalFigurePainterType() {
    return this.naturalFigurePainterType;
  }

  /**
   * Returns the control point closure of Z4NaturalFigurePainter
   *
   * @return The control point closure of Z4NaturalFigurePainter
   */
  public Z4NaturalFigurePainterControlPointClosure getControlPointClosure() {
    return this.controlPointClosure;
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
   * Returns the angle of the first internal control point
   *
   * @return The angle of the first internal control point
   */
  public Z4FancifulValue getInternalAngle1() {
    return this.internalAngle1;
  }

  /**
   * Returns the angle of the first external control point
   *
   * @return The angle of the first external control point
   */
  public Z4FancifulValue getExternalAngle1() {
    return this.externalAngle1;
  }

  /**
   * Returns the angle of the second internal control point
   *
   * @return The angle of the second internal control point
   */
  public Z4FancifulValue getInternalAngle2() {
    return this.internalAngle2;
  }

  /**
   * Returns the angle of the second external control point
   *
   * @return The angle of the second external control point
   */
  public Z4FancifulValue getExternalAngle2() {
    return this.externalAngle2;
  }

  /**
   * Returns the tension of the first internal control point
   *
   * @return The tension of the first internal control point
   */
  public Z4FancifulValue getInternalTension1() {
    return this.internalTension1;
  }

  /**
   * Returns the tension of the first external control point
   *
   * @return The tension of the first external control point
   */
  public Z4FancifulValue getExternalTension1() {
    return this.externalTension1;
  }

  /**
   * Returns the tension of the second internal control point
   *
   * @return The tension of the second internal control point
   */
  public Z4FancifulValue getInternalTension2() {
    return this.internalTension2;
  }

  /**
   * Returns the tension of the second external control point
   *
   * @return The tension of the second external control point
   */
  public Z4FancifulValue getExternalTension2() {
    return this.externalTension2;
  }

  /**
   * Returns the indentation
   *
   * @return The indentation
   */
  public int getIndentation() {
    return this.indentation;
  }

  /**
   * Returns the angle of the external force
   *
   * @return The angle of the external force
   */
  public Z4FancifulValue getExternalForceAngle() {
    return this.externalForceAngle;
  }

  /**
   * Returns the tension of the external force
   *
   * @return The tension of the external force
   */
  public Z4FancifulValue getExternalForceTension() {
    return this.externalForceTension;
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
  public Color getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border size
   *
   * @return The border size
   */
  public Z4FancifulValue getBorderSize() {
    return this.borderSize;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
  public Color getBorderColor() {
    return this.borderColor;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      double originalAngle = drawingPoint.z4Vector.phase;
      double currentExternalForceAngle = this.externalForceAngle.getConstant().getValue();
      double currentExternalForceTension = this.externalForceTension.getConstant().getValue();

      drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
      this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);
      this.drawBounds(context);
    } else {
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());

      if (currentSize > 0) {
        double originalAngle = drawingPoint.z4Vector.phase;
        double currentExternalForceAngle = this.externalForceAngle.next();
        double currentExternalForceTension = this.externalForceTension.next();

        drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);

        this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.next()), 1, this.externalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c1i = this.setControlPoint(0, Z4Math.deg2rad(internalAngle1.next()), -1, this.internalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(externalAngle2.next()), -1, this.externalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(internalAngle2.next()), 1, this.internalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.evalPointClosure(drawingPoint);

        if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_0) {
          this.type0(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_1) {
          this.type1(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_2) {
          this.type2(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_3) {
          this.type3(context, drawingPoint, spatioTemporalColor, progression);
        }
      }
    }
  }

  private void drawBounds($CanvasRenderingContext2D context) {
    context.save();

    context.strokeStyle = Z4Constants.$getStyle("gray");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.pF.x, this.pF.y);
    context.stroke();

    context.strokeStyle = Z4Constants.$getStyle("black");
    context.translate(1, 1);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.pF.x, this.pF.y);
    context.stroke();

    context.restore();
  }

  private void evalForce(Z4DrawingPoint drawingPoint, double originalAngle, double currentExternalForceAngle, double currentExternalForceTension) {
    if (currentExternalForceTension > 0) {
      double angle = Z4Math.deg2rad(currentExternalForceAngle) - originalAngle;
      double tension = drawingPoint.intensity * currentExternalForceTension;

      this.pF = new Z4Point(drawingPoint.z4Vector.x + tension * Math.cos(angle), drawingPoint.z4Vector.y + tension * Math.sin(angle));
    } else {
      this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

  private Z4Point setControlPoint(double phase, double angle, int angleSign, double tension, double intensity, int side) {
    return Z4Math.rotate(intensity * tension, 0, phase + angleSign * side * angle);
  }

  private void evalPointClosure(Z4DrawingPoint drawingPoint) {
    if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0) {
      this.c1e = new Z4Point(this.c1e.x + drawingPoint.z4Vector.x, this.c1e.y + drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(this.c1i.x + drawingPoint.z4Vector.x, this.c1i.y + drawingPoint.z4Vector.y);
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1) {
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2) {
    }
  }

  private void type0($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.c2i.x, this.c2i.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2e[0], c2e[1], this.pF.x, this.pF.y);
//      pathForShadowBorder.cubicTo(c2i[0], c2i[1], c1i[0], c1i[1], 0, 0);
//    }
//
    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression);
  }

  private void type1($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    this.path1 = this.findControlPointPath(this.c1i.x, this.c1i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c1i[0], c1i[1], c2i[0], c2i[1], this.pF.x, this.pF.y);
//    }
//    this.drawFigure(context, drawingPoint, this.c1i, this.c2i, spatioTemporalColor, progression);
//
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2e[0], c2e[1], this.pF.x, this.pF.y);
//    }
//    
    this.drawFigure(context, drawingPoint, c1e, c2e, spatioTemporalColor, progression);
  }

  private void type2($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    this.path1 = this.findControlPointPath(this.c2i.x, this.c2i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c2i[0], c2i[1], c1i[0], c1i[1], this.pF.x, this.pF.y);
//    }
//    
    this.drawFigure(context, drawingPoint, c2i, c1i, spatioTemporalColor, progression);

    this.path1 = this.findControlPointPath(this.c2e.x, this.c2e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c2e[0], c2e[1], c1e[0], c1e[1], this.pF.x, this.pF.y);
//    }
//    
    this.drawFigure(context, drawingPoint, c2e, c1e, spatioTemporalColor, progression);
  }

  private void type3($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.c2e.x, this.c2e.y);
//    
//    if (shadow || border) {
//      pathForShadowBorder.reset();
//      pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2i[0], c2i[1], this.pF.x, this.pF.y);
//      pathForShadowBorder.cubicTo(c2e[0], c2e[1], c1i[0], c1i[1], 0, 0);
//    }
//    
    this.drawFigure(context, drawingPoint, c1e, c2i, spatioTemporalColor, progression);
  }

  private Z4Point findControlPointPath(double p1x, double p1y, double p2x, double p2y) {
    Z4Vector helpVector = Z4Vector.fromPoints(p1x, p1y, p2x, p2y);
    return Z4Math.rotate(helpVector.module, 0, helpVector.phase);
  }

  private void drawFigure($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
//    if (shadow) {
//      this.drawShadow();
//    }
//    if (border) {
//      this.drawBorder(point);
//    }

    if (spatioTemporalColor.isColor()) {
      Color color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting());
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, null, null, progression.getLighting());
      } else {
        Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting());
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, gradientColor, null, progression.getLighting());
    }
  }

  @SuppressWarnings("null")
  private void drawFigureWithColors($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    double length = Math.max(Z4Math.distance(path1.x, path1.y, 0, 0), Z4Math.distance(path2.x, path2.y, 0, 0));

    for (int i = 0; i < length; i += 3) {
      double val = i / length;
      Color c = null;
      if ($exists(color) && lighting == Z4Lighting.NONE) {
        c = color;
      } else {
        if ($exists(spatioTemporalColor)) {
          c = spatioTemporalColor.getColorAt(-1, val);
        } else if ($exists(gradientColor)) {
          c = gradientColor.getColorAt(val, true);
        }
      }

      if (lighting == Z4Lighting.NONE) {
      } else if (lighting == Z4Lighting.LIGHTED) {
        c = c.lighted(val);
      } else if (lighting == Z4Lighting.DARKENED) {
        c = c.darkened(val);
      }

      double indentationValue = this.indentation * Math.random();
      double indentationAngle = Z4Math.TWO_PI * Math.random();
      double indentX = indentationValue > 0 ? indentationValue * Math.cos(indentationAngle) : 0;
      double indentY = indentationValue > 0 ? indentationValue * Math.sin(indentationAngle) : 0;

      context.save();

      context.lineWidth = 3;
      context.strokeStyle = Z4Constants.$getStyle(c.getRGBA_HEX());

      context.beginPath();
      context.moveTo(drawingPoint.z4Vector.x0, 0);
      context.bezierCurveTo(c1.x + path1.x * val, c1.y + path1.y * val, c2.x + path2.x * val, c2.y + path2.y * val, this.pF.x + indentX, this.pF.y + indentY);
      context.stroke();

      context.restore();
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("naturalFigurePainterType", this.naturalFigurePainterType);
    json.$set("controlPointClosure", this.controlPointClosure);

    json.$set("size", this.size.toJSON());

    json.$set("internalAngle1", this.internalAngle1.toJSON());
    json.$set("externalAngle1", this.externalAngle1.toJSON());
    json.$set("internalAngle2", this.internalAngle2.toJSON());
    json.$set("externalAngle2", this.externalAngle2.toJSON());

    json.$set("internalTension1", this.internalTension1.toJSON());
    json.$set("externalTension1", this.externalTension1.toJSON());
    json.$set("internalTension2", this.internalTension2.toJSON());
    json.$set("externalTension2", this.externalTension2.toJSON());

    json.$set("indentation", this.indentation);

    json.$set("externalForceAngle", this.externalForceAngle.toJSON());
    json.$set("externalForceTension", this.externalForceTension.toJSON());

    json.$set("shadowShiftX", this.shadowShiftX.toJSON());
    json.$set("shadowShiftY", this.shadowShiftY.toJSON());

    $Object jsonColor = new $Object();
    jsonColor.$set("red", this.shadowColor.red);
    jsonColor.$set("green", this.shadowColor.green);
    jsonColor.$set("blue", this.shadowColor.blue);
    jsonColor.$set("alpha", this.shadowColor.alpha);
    json.$set("shadowColor", jsonColor);

    json.$set("borderSize", this.borderSize.toJSON());

    jsonColor = new $Object();
    jsonColor.$set("red", this.borderColor.red);
    jsonColor.$set("green", this.borderColor.green);
    jsonColor.$set("blue", this.borderColor.blue);
    jsonColor.$set("alpha", this.borderColor.alpha);
    json.$set("borderColor", jsonColor);

    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  public static Z4NaturalFigurePainter fromJSON($Object json) {
    $Object jsonColor = json.$get("shadowColor");
    Color shadowColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));

    jsonColor = json.$get("borderColor");
    Color borderColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));

    return new Z4NaturalFigurePainter(
            json.$get("naturalFigurePainterType"),
            json.$get("controlPointClosure"),
            Z4FancifulValue.fromJSON(json.$get("size")),
            Z4FancifulValue.fromJSON(json.$get("internalAngle1")), Z4FancifulValue.fromJSON(json.$get("externalAngle1")), Z4FancifulValue.fromJSON(json.$get("internalAngle2")), Z4FancifulValue.fromJSON(json.$get("externalAngle2")),
            Z4FancifulValue.fromJSON(json.$get("internalTension1")), Z4FancifulValue.fromJSON(json.$get("externalTension1")), Z4FancifulValue.fromJSON(json.$get("internalTension2")), Z4FancifulValue.fromJSON(json.$get("externalTension2")),
            json.$get("indentation"),
            Z4FancifulValue.fromJSON(json.$get("externalForceAngle")), Z4FancifulValue.fromJSON(json.$get("externalForceTension")),
            Z4FancifulValue.fromJSON(json.$get("shadowShiftX")), Z4FancifulValue.fromJSON(json.$get("shadowShiftY")), shadowColor,
            Z4FancifulValue.fromJSON(json.$get("borderSize")), borderColor
    );
  }
}
