/**
 * A kaleidoscope
 *
 * @author gianpiero.diblasi
 */
class Z4Kaleidoscope {

   multiplicity = 0;

   offsetX = 0;

   offsetY = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  constructor(multiplicity, offsetX, offsetY) {
    this.multiplicity = multiplicity;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the X offset
   *
   * @return The X offset
   */
   getOffsetX() {
    return this.offsetX;
  }

  /**
   * Returns the Y offset
   *
   * @return The Y offset
   */
   getOffsetY() {
    return this.offsetY;
  }

  /**
   * Iterate a drawing
   *
   * @param context The context to use to perform the drawing
   * @param draw The action used to perform the drawing
   */
   iterate(context, draw) {
    draw();
    let incAngle = Z4Math.TWO_PI / this.multiplicity;
    let matrix = context.getTransform();
    for (let index = 1; index < this.multiplicity; index++) {
      let angle = index * incAngle;
      context.save();
      context.resetTransform();
      context.translate(this.offsetX, this.offsetY);
      context.rotate(angle);
      context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      draw();
      context.restore();
    }
  }
}
