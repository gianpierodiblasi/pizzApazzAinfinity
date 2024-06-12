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

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let nextScattering = this.scattering.next();
      let angle = this.rotation.next(Z4Math.atan(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y));
      let vector = Z4Vector.fromVector(this.currentPoint.x + nextScattering * Math.cos(angle), this.currentPoint.y + nextScattering * Math.sin(angle), 1, angle);
      // this.rotation.nextSide(this.z4Point, vector);
      // this.progression.next(this.z4Point);
      // point.modeLighting=modeLighting;
      // point.colorPosition=this.evaluateColorPosition(nextScattering/scattering);
      return new Z4DrawingPoint(vector, 1, Z4Lighting.NONE, 0, false, new Z4Sign(Z4SignBehavior.POSITIVE), false);
    }
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["scattering"] = this.scattering.toJSON();
    return json;
  }
}
