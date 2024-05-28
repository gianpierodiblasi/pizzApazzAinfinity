package pizzapazza;

import def.dom.Blob;
import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.ImageData;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.Point;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_1_Void;
import simulation.js.$Object;
import simulation.js.$Uint8Array;

/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
public class Z4Layer {

  private $OffscreenCanvas offscreen;
  private $CanvasRenderingContext2D offscreenCtx;

  private String name;
  private int offsetX = 0;
  private int offsetY = 0;
  private double opacity = 1;
  private String compositeOperation = "source-over";
  private int width;
  private int height;

  /**
   * Creates the object
   *
   * @param name The layer name
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  public Z4Layer(String name, int width, int height, Object filling, int containerWidth, int containerHeight) {
    this.name = name;
    this.offscreen = new $OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");

    if (filling instanceof Color) {
      this.offscreenCtx.fillStyle = this.$getFillStyle(((Color) filling).getRGBA_HEX());
      this.offscreenCtx.fillRect(0, 0, width, height);
    } else if (filling instanceof Z4AbstractFiller) {
      ImageData imageData = this.offscreenCtx.createImageData(width, height);
      ((Z4AbstractFiller) filling).fill(imageData);
      this.offscreenCtx.putImageData(imageData, 0, 0);
    } else if (filling instanceof Z4BiGradientColor) {
      ImageData imageData = this.offscreenCtx.createImageData(width, height);
      $Uint8Array data = ($Uint8Array) imageData.data;

      for (int y = 0; y < height; y++) {
        Z4GradientColor gradientColor = ((Z4BiGradientColor) filling).getColorAt(y / height, true);
        for (int x = 0; x < width; x++) {
          Color color = gradientColor.getColorAt(x / width, true);

          int index = (y * width + x) * 4;
          data.$set(index, color.red);
          data.$set(index + 1, color.green);
          data.$set(index + 2, color.blue);
          data.$set(index + 3, color.alpha);
        }
      }

      this.offscreenCtx.putImageData(imageData, 0, 0);
    }

    this.offsetX = (containerWidth - width) / 2;
    this.offsetY = (containerHeight - height) / 2;
    this.width = width;
    this.height = height;
  }

  private String getFillStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getFillStyle(String style) {
    return null;
  }

  /**
   * Creates a Z4Layer from an image
   *
   * @param name The layer name
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   * @return The layer
   */
  public static Z4Layer fromImage(String name, $Image image, int containerWidth, int containerHeight) {
    Z4Layer layer = new Z4Layer(name, (int) image.width, (int) image.height, new Color(0, 0, 0, 0), containerWidth, containerHeight);
    layer.offscreenCtx.drawImage(image, 0, 0);
    return layer;
  }

  /**
   * Converts this layer to a blob
   *
   * @param apply The function to call on conversion
   */
  public void convertToBlob($Apply_1_Void<Blob> apply) {
    $Object options = new $Object();
    options.$set("type", "image/png");

    this.offscreen.convertToBlob(options).then(blob -> {
      apply.$apply(blob);
    });
  }

  /**
   * Shifts the layer
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
  public void shift(int shiftX, int shiftY) {
    this.offsetX += shiftX;
    this.offsetY += shiftY;
  }

  /**
   * Sets the opacity
   *
   * @param opacity The opacity
   */
  public void setOpacity(double opacity) {
    this.opacity = opacity;
  }

  /**
   * Returns the opacity
   *
   * @return The opacity
   */
  public double getOpacity() {
    return this.opacity;
  }

  /**
   * Sets the composite operation
   *
   * @param compositeOperation The composite operation
   */
  public void setCompositeOperation(String compositeOperation) {
    this.compositeOperation = compositeOperation;
  }

  /**
   * Returns the composite operation
   *
   * @return The composite operation
   */
  public String getCompositeOperation() {
    return this.compositeOperation;
  }

  /**
   * Moves a layer
   *
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  public void move(int offsetX, int offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Sets the layer name
   *
   * @param name The layer name
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Returns the layer name
   *
   * @return The layer name
   */
  public String getName() {
    return this.name;
  }

  /**
   * Returns the layer offset
   *
   * @return The layer offset
   */
  public Point getOffset() {
    return new Point(this.offsetX, this.offsetY);
  }

  /**
   * Returns the layer size
   *
   * @return The layer size
   */
  public Dimension getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   * @param noOffset true to not use the offset, false otherwise
   */
  public void draw($CanvasRenderingContext2D ctx, boolean noOffset) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = this.compositeOperation;
    ctx.drawImage(this.offscreen, noOffset ? 0 : this.offsetX, noOffset ? 0 : this.offsetY);
    ctx.restore();
  }

  /**
   * Horizontally flips the layer
   */
  public void flipHorizonal() {
    ImageData imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width / 2; x++) {
        int indexFrom = (y * this.width + x) * 4;
        int indexTo = (y * this.width + this.width - 1 - x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }

    this.offscreenCtx.putImageData(imageData, 0, 0);
  }

  /**
   * Vertically flips the layer
   */
  public void flipVertical() {
    ImageData imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < this.height / 2; y++) {
      for (int x = 0; x < this.width; x++) {
        int indexFrom = (y * this.width + x) * 4;
        int indexTo = ((this.height - 1 - y) * this.width + x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }

    this.offscreenCtx.putImageData(imageData, 0, 0);
  }

  private void flipValue($Uint8Array data, int indexFrom, int indexTo) {
    double r = data.$get(indexFrom);
    double g = data.$get(indexFrom + 1);
    double b = data.$get(indexFrom + 2);
    double a = data.$get(indexFrom + 3);

    data.$set(indexFrom, data.$get(indexTo));
    data.$set(indexFrom + 1, data.$get(indexTo + 1));
    data.$set(indexFrom + 2, data.$get(indexTo + 2));
    data.$set(indexFrom + 3, data.$get(indexTo + 3));

    data.$set(indexTo, r);
    data.$set(indexTo + 1, g);
    data.$set(indexTo + 2, b);
    data.$set(indexTo + 3, a);
  }

  /**
   * Rotates the layer in clockwise
   */
  @SuppressWarnings("SuspiciousNameCombination")
  public void rotatePlus90() {
    $OffscreenCanvas rotatedOffscreen = new $OffscreenCanvas(this.height, this.width);
    $CanvasRenderingContext2D rotatedOffscreenCtx = rotatedOffscreen.getContext("2d");

    ImageData imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    $Uint8Array data = ($Uint8Array) imageData.data;

    ImageData rotatedImageData = rotatedOffscreenCtx.createImageData(this.height, this.width);
    $Uint8Array rotatedData = ($Uint8Array) rotatedImageData.data;

    for (int y = 0; y < this.height; y++) {
      for (int x = 0; x < this.width; x++) {
        int index = (y * this.width + x) * 4;
        int rotatedIndex = (x * this.height + this.height - 1 - y) * 4;

        rotatedData.$set(rotatedIndex, data.$get(index));
        rotatedData.$set(rotatedIndex + 1, data.$get(index + 1));
        rotatedData.$set(rotatedIndex + 2, data.$get(index + 2));
        rotatedData.$set(rotatedIndex + 3, data.$get(index + 3));
      }
    }

    rotatedOffscreenCtx.putImageData(rotatedImageData, 0, 0);

    this.offscreen = rotatedOffscreen;
    this.offscreenCtx = rotatedOffscreenCtx;

    this.offsetX = 0;
    this.offsetY = 0;
    int temp = this.width;
    this.width = this.height;
    this.height = temp;
  }
}
