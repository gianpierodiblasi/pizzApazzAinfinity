/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4Airbrush extends Z4PointIterator {

   multiplicity = null;

   radius = 0.0;

   speed = 0.0;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param radius The radius
   * @param speed The speed
   * @param rotation The rotation
   */
  constructor(multiplicity, radius, speed, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.radius = radius;
    this.speed = speed;
  }

   drawAction(action, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let currentRadius = this.radius * Math.random();
      let currenAngle = Z4Math.TWO_PI * Math.random();
      let angle = this.rotation.next(currenAngle);
      let vector = Z4Vector.fromVector(this.currentPoint.x + currentRadius * Math.cos(currenAngle), currentRadius * Math.sin(currenAngle) + this.currentPoint.y, 1, angle);
      // if (!this.progression.isTemporal() || this.currentMultiplicityCounter == 1) {
      // this.progression.next(this.z4Point);
      // } else {
      // this.z4Point.setLighting(this.progression.getLighting());
      // this.z4Point.setDrawBounds(false);
      // }
      // 
      // if (this.progression.isRelativeToPath()) {
      // this.z4Point.setDrawBounds(false);
      // this.z4Point.setColorPosition(currentRadius / this.radius);
      // }
      // 
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      let spatialPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.spatialPosition : -1;
      if (color.isColor()) {
      } else if (color.isGradientColor()) {
        // switch ("" + progression.getColorProgressionBehavior()) {
        // case "SPATIAL":
        // break;
        // case "TEMPORAL":
        // temporalPosition = progression.next(temporalPosition);
        // break;
        // case "RELATIVE_TO_PATH":
        // break;
        // case "RANDOM":
        // temporalPosition = Math.random();
        // break;
        // }
      } else if (color.isBiGradientColor()) {
        // switch ("" + progression.getColorProgressionBehavior()) {
        // case "TEMPORAL":
        // temporalPosition = progression.next(temporalPosition);
        // break;
        // case "RELATIVE_TO_PATH":
        // break;
        // case "RANDOM":
        // temporalPosition = Math.random();
        // break;
        // }
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, spatialPosition, false, this.rotation.computeSide(vector, null), false);
      return this.nextdDrawingPoint;
    }
  }

   isInfinitePointGenerator() {
    return true;
  }

   getInfinitePointGeneratorSleep() {
    return parseInt(250 / this.speed);
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["radius"] = this.radius;
    json["speed"] = this.speed;
    return json;
  }
}
