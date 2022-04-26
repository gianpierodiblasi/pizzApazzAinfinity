/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
class Z4Stamper extends Z4PointIterator {

   draw(action, x, y) {
    // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    throw new UnsupportedOperationException("Not supported yet.");
  }

   next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.hasNext = false;
      let angle = this.nextRotation(0);
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P["x"], this.P["y"], 1, angle));
      this.nextSide(this.z4Point, null);
      if (this.progression === Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        let colorPosition = this.z4Point.getColorPosition();
        colorPosition = colorPosition === -1 ? 0 : colorPosition + this.temporalStepProgression;
        if (colorPosition > 1) {
          colorPosition -= 1;
        }
        this.z4Point.setColorPosition(colorPosition);
      } else if (this.progression === Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression === Z4Progression.RELATIVE_TO_PATH || this.progression === Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setColorPosition(Math.random());
      }
      return this.z4Point;
    }
  }
}
