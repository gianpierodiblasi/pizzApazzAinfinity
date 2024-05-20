/**
 * A Filler based on a texture
 *
 * @author gianpiero.diblasi
 */
class Z4TextureFiller extends Z4AbstractFiller {

   texture = null;

   x1 = 0;

   y1 = 0;

   x2 = 0;

   y2 = 0;

   color = null;

   symmetric = false;

   textureData = null;

   left = 0;

   top = 0;

   width = 0;

   height = 0;

   scaleW = 0.0;

   scaleH = 0.0;

  /**
   * Creates the object
   *
   * @param texture The texture
   * @param x1 The x-axis coordinate of the top-left corner where start the
   * texture
   * @param y1 The y-axis coordinate of the top-left corner where start the
   * texture
   * @param x2 The x-axis coordinate of the bottom-right corner where start the
   * texture
   * @param y2 The y-axis coordinate of the bottom-right corner where start the
   * texture
   * @param color The background color
   * @param symmetric true for symmetric texture, false otherwise
   */
  constructor(texture, x1, y1, x2, y2, color, symmetric) {
    super();
    this.texture = texture;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.symmetric = symmetric;
    if (this.symmetric) {
      this.textureData = new Uint8Array(4 * 4 * this.texture.width * this.texture.height);
      for (let y = 0; y < this.texture.height; y++) {
        for (let x = 0; x < this.texture.width; x++) {
          let index = (y * this.texture.width + x) * 4;
          let indexSym = (y * this.texture.width * 2 + x) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = (y * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = ((2 * this.texture.height - 1 - y) * this.texture.width * 2 + x) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = ((2 * this.texture.height - y - 1) * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
        }
      }
    } else {
      this.textureData = this.texture.data;
    }
    this.left = Math.min(x1, x2);
    this.top = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    this.scaleW = (this.symmetric ? 2 : 1) * this.texture.width / this.width;
    this.scaleH = (this.symmetric ? 2 : 1) * this.texture.height / this.height;
  }

   fill(imageData) {
    let data = imageData.data;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let index = (y * imageData.width + x) * 4;
        let p = this.computeRect(x, y);
        let xx = parseInt(this.scaleW * (x - p.x));
        let yy = parseInt(this.scaleH * (y - p.y));
        let indexTexture = (yy * (this.symmetric ? 2 : 1) * this.texture.width + xx) * 4;
        if (this.textureData[indexTexture + 3]) {
          data[index] = this.textureData[indexTexture];
          data[index + 1] = this.textureData[indexTexture + 1];
          data[index + 2] = this.textureData[indexTexture + 2];
          data[index + 3] = this.textureData[indexTexture + 3];
        } else {
          data[index] = this.color.red;
          data[index + 1] = this.color.green;
          data[index + 2] = this.color.blue;
          data[index + 3] = this.color.alpha;
        }
      }
    }
  }

   computeRect(x, y) {
    let l = this.left;
    let t = this.top;
    let r = l + this.width;
    let b = t + this.height;
    while (x < l) {
      l -= this.width;
      r = l + this.width;
    }
    while (x >= r) {
      l += this.width;
      r = l + this.width;
    }
    while (y < t) {
      t -= this.height;
      b = t + this.height;
    }
    while (y >= b) {
      t += this.height;
      b = t + this.height;
    }
    return new Point(l, t);
  }
}
