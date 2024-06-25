/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

   naturalFigurePainterType = null;

   controlPointClosure = null;

  // = 45
   internalAngle1 = null;

  // = 45;
   externalAngle1 = null;

  // = 45;
   internalAngle2 = null;

  // = 45;
   externalAngle2 = null;

  // = 3;
   internalTension1 = null;

  // = 3;
   externalTension1 = null;

  // = 3;
   internalTension2 = null;

  // = 3;
   externalTension2 = null;

  // Frastagliatura
   indentation = 0;

   externalForceAngle = null;

   externalForceTension = null;

   path1 = null;

   path2 = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

   pathForShadowBorderE = null;

   pathForShadowBorderI = null;

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
  constructor(naturalFigurePainterType, controlPointClosure, internalAngle1, externalAngle1, internalAngle2, externalAngle2, internalTension1, externalTension1, internalTension2, externalTension2, indentation, externalForceAngle, externalForceTension) {
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

   getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  /**
   * Returns the type of Z4NaturalFigurePainter
   *
   * @return The type of Z4NaturalFigurePainter
   */
   getNaturalFigurePainterType() {
    return this.naturalFigurePainterType;
  }

  /**
   * Returns the control point closure of Z4NaturalFigurePainter
   *
   * @return The control point closure of Z4NaturalFigurePainter
   */
   getControlPointClosure() {
    return this.controlPointClosure;
  }

  /**
   * Returns the angle of the first internal control point
   *
   * @return The angle of the first internal control point
   */
   getInternalAngle1() {
    return this.internalAngle1;
  }

  /**
   * Returns the angle of the first external control point
   *
   * @return The angle of the first external control point
   */
   getExternalAngle1() {
    return this.externalAngle1;
  }

  /**
   * Returns the angle of the second internal control point
   *
   * @return The angle of the second internal control point
   */
   getInternalAngle2() {
    return this.internalAngle2;
  }

  /**
   * Returns the angle of the second external control point
   *
   * @return The angle of the second external control point
   */
   getExternalAngle2() {
    return this.externalAngle2;
  }

  /**
   * Returns the tension of the first internal control point
   *
   * @return The tension of the first internal control point
   */
   getInternalTension1() {
    return this.internalTension1;
  }

  /**
   * Returns the tension of the first external control point
   *
   * @return The tension of the first external control point
   */
   getExternalTension1() {
    return this.externalTension1;
  }

  /**
   * Returns the tension of the second internal control point
   *
   * @return The tension of the second internal control point
   */
   getInternalTension2() {
    return this.internalTension2;
  }

  /**
   * Returns the tension of the second external control point
   *
   * @return The tension of the second external control point
   */
   getExternalTension2() {
    return this.externalTension2;
  }

  /**
   * Returns the indentation
   *
   * @return The indentation
   */
   getIndentation() {
    return this.indentation;
  }

  /**
   * Returns the angle of the external force
   *
   * @return The angle of the external force
   */
   getExternalForceAngle() {
    return this.externalForceAngle;
  }

  /**
   * Returns the tension of the external force
   *
   * @return The tension of the external force
   */
   getExternalForceTension() {
    return this.externalForceTension;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
  }

   toJSON() {
    let json = super.toJSON();
    json["naturalFigurePainterType"] = this.naturalFigurePainterType;
    json["controlPointClosure"] = this.controlPointClosure;
    json["internalAngle1"] = this.internalAngle1.toJSON();
    json["externalAngle1"] = this.externalAngle1.toJSON();
    json["internalAngle2"] = this.internalAngle2.toJSON();
    json["externalAngle2"] = this.externalAngle2.toJSON();
    json["internalTension1"] = this.internalTension1.toJSON();
    json["externalTension1"] = this.externalTension1.toJSON();
    json["internalTension2"] = this.internalTension2.toJSON();
    json["externalTension2"] = this.externalTension2.toJSON();
    json["indentation"] = this.indentation;
    json["externalForceAngle"] = this.externalForceAngle.toJSON();
    json["externalForceTension"] = this.externalForceTension.toJSON();
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  static  fromJSON(json) {
    return new Z4NaturalFigurePainter(json["naturalFigurePainterType"], json["controlPointClosure"], Z4FancifulValue.fromJSON(json["internalAngle1"]), Z4FancifulValue.fromJSON(json["externalAngle1"]), Z4FancifulValue.fromJSON(json["internalAngle2"]), Z4FancifulValue.fromJSON(json["externalAngle2"]), Z4FancifulValue.fromJSON(json["internalTension1"]), Z4FancifulValue.fromJSON(json["externalTension1"]), Z4FancifulValue.fromJSON(json["internalTension2"]), Z4FancifulValue.fromJSON(json["externalTension2"]), json["indentation"], Z4FancifulValue.fromJSON(json["externalForceAngle"]), Z4FancifulValue.fromJSON(json["externalForceTension"]));
  }
}
