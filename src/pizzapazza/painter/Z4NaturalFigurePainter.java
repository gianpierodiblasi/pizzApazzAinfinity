package pizzapazza.painter;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;
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
   */
  public Z4NaturalFigurePainter(Z4NaturalFigurePainterType naturalFigurePainterType, Z4NaturalFigurePainterControlPointClosure controlPointClosure,
          Z4FancifulValue internalAngle1, Z4FancifulValue externalAngle1, Z4FancifulValue internalAngle2, Z4FancifulValue externalAngle2,
          Z4FancifulValue internalTension1, Z4FancifulValue externalTension1, Z4FancifulValue internalTension2, Z4FancifulValue externalTension2,
          int indentation,
          Z4FancifulValue externalForceAngle, Z4FancifulValue externalForceTension) {
    super();

    this.naturalFigurePainterType = naturalFigurePainterType;
    this.controlPointClosure = controlPointClosure;

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

  @Override
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {

  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("naturalFigurePainterType", this.naturalFigurePainterType);
    json.$set("controlPointClosure", this.controlPointClosure);

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

    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  public static Z4NaturalFigurePainter fromJSON($Object json) {
    return new Z4NaturalFigurePainter(
            json.$get("naturalFigurePainterType"),
            json.$get("controlPointClosure"),
            Z4FancifulValue.fromJSON(json.$get("internalAngle1")), Z4FancifulValue.fromJSON(json.$get("externalAngle1")), Z4FancifulValue.fromJSON(json.$get("internalAngle2")), Z4FancifulValue.fromJSON(json.$get("externalAngle2")),
            Z4FancifulValue.fromJSON(json.$get("internalTension1")), Z4FancifulValue.fromJSON(json.$get("externalTension1")), Z4FancifulValue.fromJSON(json.$get("internalTension2")), Z4FancifulValue.fromJSON(json.$get("externalTension2")),
            json.$get("indentation"),
            Z4FancifulValue.fromJSON(json.$get("externalForceAngle")), Z4FancifulValue.fromJSON(json.$get("externalForceTension"))
    );
  }
}
