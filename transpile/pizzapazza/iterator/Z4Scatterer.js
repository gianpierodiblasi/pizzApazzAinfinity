/**
 * @author gianpiero.diblasi
 */
class Z4Scatterer extends Z4PointIterator {

   multiplicity = null;

   scattering = null;

   before = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param scattering The scattering
   * @param rotation The rotation
   */
  constructor(multiplicity, scattering, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.scattering = scattering;
  }

   getType() {
    return Z4PointIteratorType.SCATTERER;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.before = this.currentPoint;
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      return false;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let nextScattering = this.scattering.next();
      let currentVector = Z4Vector.fromPoints(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.currentPoint.x + nextScattering * Math.cos(angle), this.currentPoint.y + nextScattering * Math.sin(angle), 1, angle);
      // this.progression.next(this.z4Point);
      // point.modeLighting=modeLighting;
      // point.colorPosition=this.evaluateColorPosition(nextScattering/scattering);
      return new Z4DrawingPoint(vector, 1, 0, false, this.rotation.computeSide(vector, currentVector), false);
    }
  }

   getNextCount() {
    return 1;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalSpatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    let finalColorProgression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["scattering"] = this.scattering.toJSON();
    return json;
  }

  /**
   * Creates a Z4Scatterer from a JSON object
   *
   * @param json The JSON object
   * @return the scatterer
   */
  static  fromJSON(json) {
    return new Z4Scatterer(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["scattering"]), Z4Rotation.fromJSON(json["rotation"]));
  }
}
