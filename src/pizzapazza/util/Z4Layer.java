package pizzapazza.util;

import def.dom.Blob;
import def.dom.ImageData;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.Point;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.ui.component.Z4CanvasTextManager;
import pizzapazza.ui.component.Z4LayerPreview;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
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

  private Z4LayerPreview layerPreview;

  private Blob blob;
  private String name;
  private int offsetX = 0;
  private int offsetY = 0;
  private double opacity = 1;
  private String compositeOperation = "source-over";
  private int width;
  private int height;
  private boolean hidden;
  private boolean showBounds;

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
      this.offscreenCtx.fillStyle = Z4Constants.$getStyle(((Color) filling).getRGBA_HEX());
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
   * Sets the layer preview
   *
   * @param layerPreview The layer preview
   */
  public void setLayerPreview(Z4LayerPreview layerPreview) {
    this.layerPreview = layerPreview;
  }

  /**
   * Returns the layer preview
   *
   * @return The layer preview
   */
  public Z4LayerPreview getLayerPreview() {
    return this.layerPreview;
  }

  /**
   * Converts this layer to a blob
   *
   * @param apply The function to call on conversion
   */
  public void convertToBlob($Apply_1_Void<Blob> apply) {
    if ($exists(this.blob)) {
      apply.$apply(this.blob);
    } else {
      $Object options = new $Object();
      options.$set("type", "image/png");

      this.offscreen.convertToBlob(options).then(converted -> {
        this.blob = converted;
        apply.$apply(this.blob);
      });
    }
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
   * Sets the hidden property
   *
   * @param hidden true to hide the layer, false otherwise
   */
  public void setHidden(boolean hidden) {
    this.hidden = hidden;
  }

  /**
   * Checks if the hidden property is set
   *
   * @return true if the hidden property is set, false otherwise
   */
  public boolean isHidden() {
    return this.hidden;
  }

  /**
   * Sets the visualization of the bounds
   *
   * @param showBounds true to show the bounds, false otherwise
   */
  public void setShowBounds(boolean showBounds) {
    this.showBounds = showBounds;
  }

  /**
   * Checks if the bounds have to be shown
   *
   * @return true if the bounds have to be shown, false otherwise
   */
  public boolean isShowBounds() {
    return this.showBounds;
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
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
  public Color getColorAt(int x, int y) {
    x -= this.offsetX;
    y -= this.offsetY;

    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      $Uint8Array data = ($Uint8Array) this.offscreenCtx.getImageData(x, y, 1, 1).data;
      return new Color(parseInt(data.$get(0)), parseInt(data.$get(1)), parseInt(data.$get(2)), parseInt(data.$get(3)));
    } else {
      return null;
    }
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   * @param doNotUseProperties true to not use the offset, the hidden, the alpha
   * and the composite operation properties, false otherwise
   */
  public void draw($CanvasRenderingContext2D ctx, boolean doNotUseProperties) {
    if (doNotUseProperties || !this.hidden) {
      ctx.save();
      if (!doNotUseProperties) {
        ctx.globalAlpha = this.opacity;
        ctx.globalCompositeOperation = this.compositeOperation;
      }
      ctx.drawImage(this.offscreen, doNotUseProperties ? 0 : this.offsetX, doNotUseProperties ? 0 : this.offsetY);
      ctx.restore();
    }
  }

  /**
   * Performs a drawing
   *
   * @param drawingTool The tool to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
  public void drawTool(Z4DrawingTool drawingTool, Z4DrawingPoint drawingPoint) {
    this.offscreenCtx.save();
    this.offscreenCtx.translate(drawingPoint.z4Vector.x0 - this.offsetX, drawingPoint.z4Vector.y0 - this.offsetY);
    this.offscreenCtx.rotate(drawingPoint.z4Vector.phase);
    drawingTool.draw(this.offscreenCtx, drawingPoint);
    this.offscreenCtx.restore();

    this.blob = null;
  }

  /**
   * Draws a text
   *
   * @param textManager The manager used to draw the text
   */
  public void drawText(Z4CanvasTextManager textManager) {
    this.offscreenCtx.save();
    this.offscreenCtx.translate(-this.offsetX, -this.offsetY);
    textManager.drawText(this.offscreenCtx, false, false);
    this.offscreenCtx.restore();

    this.blob = null;
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
    this.blob = null;
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
    this.blob = null;
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

    this.offsetX += parseInt(this.width / 2 - this.height / 2);
    this.offsetY += parseInt(this.height / 2 - this.width / 2);
    int temp = this.width;
    this.width = this.height;
    this.height = temp;

    this.blob = null;
  }

  /**
   * Resizes the layer
   *
   * @param resizeOptions The resize options
   */
  public void resize(Z4ResizeOptions resizeOptions) {
    $OffscreenCanvas resizedOffscreen = new $OffscreenCanvas(resizeOptions.containerWidth, resizeOptions.containerHeight);
    $CanvasRenderingContext2D resizedOffscreenCtx = resizedOffscreen.getContext("2d");

    resizedOffscreenCtx.drawImage(this.offscreen, resizeOptions.contentOffsetX, resizeOptions.contentOffsetY, resizeOptions.contentWidth, resizeOptions.contentHeight);

    this.offscreen = resizedOffscreen;
    this.offscreenCtx = resizedOffscreenCtx;

    this.offsetX = 0;
    this.offsetY = 0;
    this.width = resizeOptions.containerWidth;
    this.height = resizeOptions.containerHeight;

    this.blob = null;
  }
}
