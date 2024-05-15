/**
 * A (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
class Z4LinearFiller extends Z4AbstractFiller {

   p1x = 0.0;

   p1y = 0.0;

   p2x = 0.0;

   p2y = 0.0;

   boundaryBehavior = 0;

  /**
   * The filler does nothing outside the boundary
   */
  static  STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  static  FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  static  SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  static  REPEAT_AT_BOUNDARY = 3;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the line in relative
   * size (in the range [0,1])
   * @param y1 The y-axis coordinate of the start point of the line in relative
   * size (in the range [0,1])
   * @param x2 The x-axis coordinate of the end point of the line in relative
   * size (in the range [0,1])
   * @param y2 The y-axis coordinate of the end point of the line in relative
   * size (in the range [0,1])
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x1, y1, x2, y2, boundaryBehavior) {
    super(gradientColor);
    this.p1x = x1;
    this.p1y = y1;
    this.p2x = x2;
    this.p2y = y2;
    this.boundaryBehavior = boundaryBehavior;
  }

   fill(imageData) {
    let angle = Z4Math.atan(this.p1x, this.p1y, this.p2x, this.p2y) + Z4Math.HALF_PI;
    let distance = Z4Math.distance(this.p1x, this.p1y, this.p2x, this.p2y);
    let line1x = this.p1x + Math.cos(angle);
    let line1y = this.p1y + Math.sin(angle);
    let line2x = this.p2x + Math.cos(angle);
    let line2y = this.p2y + Math.sin(angle);
    let data = imageData.data;
    for (let y = 0; y < imageData.height; y++) {
      let yy = y / imageData.height;
      for (let x = 0; x < imageData.width; x++) {
        let index = (y * imageData.width + x) * 4;
        let xx = x / imageData.width;
        let d1 = Z4Math.ptLineDist(this.p1x, this.p1y, line1x, line1y, xx, yy) / distance;
        let d2 = Z4Math.ptLineDist(this.p2x, this.p2y, line2x, line2y, xx, yy) / distance;
        if (d1 <= 1 && d2 <= 1) {
          this.setValue(data, d1, index);
        } else if (this.boundaryBehavior === Z4LinearFiller.STOP_AT_BOUNDARY) {
        } else if (this.boundaryBehavior === Z4LinearFiller.FILL_AT_BOUNDARY) {
          this.setValue(data, d1 < d2 ? 0 : 1, index);
        } else if (this.boundaryBehavior === Z4LinearFiller.SYMMETRIC_AT_BOUNDARY) {
          let position = d1 < d2 ? d1 : d2;
          let step = Math.floor(position);
          position -= step;
          if (d1 < d2) {
            if ((step % 2)) {
              position = 1 - position;
            }
          } else {
            if (!(step % 2)) {
              position = 1 - position;
            }
          }
          this.setValue(data, position, index);
        } else if (this.boundaryBehavior === Z4LinearFiller.REPEAT_AT_BOUNDARY) {
          let position = d1 < d2 ? d1 : d2;
          let step = Math.floor(position);
          position -= step;
          if (d1 < d2) {
            position = 1 - position;
          }
          this.setValue(data, position, index);
        }
      }
    }
  }
}
