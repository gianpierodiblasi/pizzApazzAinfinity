/**
 * The stamper
 *
 * @author gianpiero.diblasi
 */
class Z4Stamper extends Z4PointIterator {

   multiplicity = null;

   push = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param rotation The rotation
   */
  constructor(multiplicity, push, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
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
      let vector = null;
      let angle = this.rotation.next(0.0);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 1, angle);
      }
      // this.progression.next(this.z4Point);
      // 
      // if (this.progression.isRelativeToPath()) {
      // this.z4Point.setDrawBounds(false);
      // this.z4Point.setColorPosition(Math.random());
      // }
      // 
      return new Z4DrawingPoint(vector, 1, Z4Lighting.NONE, 0, false, this.rotation.computeSide(vector, null), false);
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
    json["push"] = this.push.toJSON();
    return json;
  }
}