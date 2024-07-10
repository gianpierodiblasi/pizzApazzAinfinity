package pizzapazza.filler;

import def.dom.ImageData;
import javascript.awt.Color;
import javascript.awt.Point;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Uint8Array;

/**
 * A Filler based on a texture
 *
 * @author gianpiero.diblasi
 */
public class Z4TextureFiller implements Z4AbstractFiller {

  private final ImageData texture;
  private final int x1;
  private final int y1;
  private final int x2;
  private final int y2;
  private final Color color;
  private final boolean symmetric;

  private final $Uint8Array textureData;
  private final int left;
  private final int top;
  private final int width;
  private final int height;
  private final double scaleW;
  private final double scaleH;

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
  public Z4TextureFiller(ImageData texture, int x1, int y1, int x2, int y2, Color color, boolean symmetric) {
    super();
    this.texture = texture;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.symmetric = symmetric;

    if (this.symmetric) {
      this.textureData = new $Uint8Array(4 * 4 * this.texture.width * this.texture.height);

      for (int y = 0; y < this.texture.height; y++) {
        for (int x = 0; x < this.texture.width; x++) {
          int index = (y * this.texture.width + x) * 4;

          int indexSym = (y * this.texture.width * 2 + x) * 4;
          this.textureData.$set(indexSym, this.texture.data.$get(index));
          this.textureData.$set(indexSym + 1, this.texture.data.$get(index + 1));
          this.textureData.$set(indexSym + 2, this.texture.data.$get(index + 2));
          this.textureData.$set(indexSym + 3, this.texture.data.$get(index + 3));

          indexSym = (y * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData.$set(indexSym, this.texture.data.$get(index));
          this.textureData.$set(indexSym + 1, this.texture.data.$get(index + 1));
          this.textureData.$set(indexSym + 2, this.texture.data.$get(index + 2));
          this.textureData.$set(indexSym + 3, this.texture.data.$get(index + 3));

          indexSym = ((2 * this.texture.height - 1 - y) * this.texture.width * 2 + x) * 4;
          this.textureData.$set(indexSym, this.texture.data.$get(index));
          this.textureData.$set(indexSym + 1, this.texture.data.$get(index + 1));
          this.textureData.$set(indexSym + 2, this.texture.data.$get(index + 2));
          this.textureData.$set(indexSym + 3, this.texture.data.$get(index + 3));

          indexSym = ((2 * this.texture.height - y - 1) * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData.$set(indexSym, this.texture.data.$get(index));
          this.textureData.$set(indexSym + 1, this.texture.data.$get(index + 1));
          this.textureData.$set(indexSym + 2, this.texture.data.$get(index + 2));
          this.textureData.$set(indexSym + 3, this.texture.data.$get(index + 3));
        }
      }
    } else {
      this.textureData = ($Uint8Array) this.texture.data;
    }

    this.left = Math.min(x1, x2);
    this.top = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    this.scaleW = (this.symmetric ? 2 : 1) * this.texture.width / this.width;
    this.scaleH = (this.symmetric ? 2 : 1) * this.texture.height / this.height;
  }

  @Override
  public void fill(ImageData imageData) {
    if (!$exists(this.width) || !$exists(this.height)) {
      return;
    }

    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < imageData.height; y++) {
      for (int x = 0; x < imageData.width; x++) {
        int index = (y * imageData.width + x) * 4;

        Point p = this.computeRect(x, y);
        int xx = parseInt(this.scaleW * (x - p.x));
        int yy = parseInt(this.scaleH * (y - p.y));

        int indexTexture = (yy * (this.symmetric ? 2 : 1) * this.texture.width + xx) * 4;

        if ($exists(this.textureData.$get(indexTexture + 3))) {
          data.$set(index, this.textureData.$get(indexTexture));
          data.$set(index + 1, this.textureData.$get(indexTexture + 1));
          data.$set(index + 2, this.textureData.$get(indexTexture + 2));
          data.$set(index + 3, this.textureData.$get(indexTexture + 3));
        } else {
          data.$set(index, this.color.red);
          data.$set(index + 1, this.color.green);
          data.$set(index + 2, this.color.blue);
          data.$set(index + 3, this.color.alpha);
        }
      }
    }
  }

  private Point computeRect(int x, int y) {
    int l = this.left;
    int t = this.top;
    int r = l + this.width;
    int b = t + this.height;

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

  @Override
  public Object getFillingColor() {
    return this.color;
  }
}
