/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
class Z4Layer {

   offscreen = null;

   offscreenCtx = null;

   name = null;

   offsetX = 0;

   offsetY = 0;

   opacity = 1;

   compositeOperation = "source-over";

   width = 0;

   height = 0;

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
  constructor(name, width, height, filling, containerWidth, containerHeight) {
    this.name = name;
    this.offscreen = new OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");
    if (filling instanceof Color) {
      this.offscreenCtx.fillStyle = this.getFillStyle((filling).getRGBA_HEX());
      this.offscreenCtx.fillRect(0, 0, width, height);
    } else if (filling instanceof Z4AbstractFiller) {
      let imageData = this.offscreenCtx.createImageData(width, height);
      (filling).fill(imageData);
      this.offscreenCtx.putImageData(imageData, 0, 0);
    } else if (filling instanceof Z4BiGradientColor) {
      let imageData = this.offscreenCtx.createImageData(width, height);
      let data = imageData.data;
      for (let y = 0; y < height; y++) {
        let gradientColor = (filling).getColorAt(y / height, true);
        for (let x = 0; x < width; x++) {
          let color = gradientColor.getColorAt(x / width, true);
          let index = (y * width + x) * 4;
          data[index] = color.red;
          data[index + 1] = color.green;
          data[index + 2] = color.blue;
          data[index + 3] = color.alpha;
        }
      }
      this.offscreenCtx.putImageData(imageData, 0, 0);
    }
    this.offsetX = (containerWidth - width) / 2;
    this.offsetY = (containerHeight - height) / 2;
    this.width = width;
    this.height = height;
  }

   getFillStyle(style) {
    return style;
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
  static  fromImage(name, image, containerWidth, containerHeight) {
    let layer = new Z4Layer(name, image.width, image.height, new Color(0, 0, 0, 0), containerWidth, containerHeight);
    layer.offscreenCtx.drawImage(image, 0, 0);
    return layer;
  }

  /**
   * Converts this layer to a blob
   *
   * @param apply The function to call on conversion
   */
   convertToBlob(apply) {
    let options = new Object();
    options["type"] = "image/png";
    this.offscreen.convertToBlob(options).then(blob => {
      apply(blob);
    });
  }

  /**
   * Shifts the layer
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
   shift(shiftX, shiftY) {
    this.offsetX += shiftX;
    this.offsetY += shiftY;
  }

  /**
   * Sets the opacity
   *
   * @param opacity The opacity
   */
   setOpacity(opacity) {
    this.opacity = opacity;
  }

  /**
   * Returns the opacity
   *
   * @return The opacity
   */
   getOpacity() {
    return this.opacity;
  }

  /**
   * Sets the composite operation
   *
   * @param compositeOperation The composite operation
   */
   setCompositeOperation(compositeOperation) {
    this.compositeOperation = compositeOperation;
  }

  /**
   * Returns the composite operation
   *
   * @return The composite operation
   */
   getCompositeOperation() {
    return this.compositeOperation;
  }

  /**
   * Moves a layer
   *
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
   move(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Sets the layer name
   *
   * @param name The layer name
   */
   setName(name) {
    this.name = name;
  }

  /**
   * Returns the layer name
   *
   * @return The layer name
   */
   getName() {
    return this.name;
  }

  /**
   * Returns the layer offset
   *
   * @return The layer offset
   */
   getOffset() {
    return new Point(this.offsetX, this.offsetY);
  }

  /**
   * Returns the layer size
   *
   * @return The layer size
   */
   getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   * @param noOffset true to not use the offset, false otherwise
   */
   draw(ctx, noOffset) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = this.compositeOperation;
    ctx.drawImage(this.offscreen, noOffset ? 0 : this.offsetX, noOffset ? 0 : this.offsetY);
    ctx.restore();
  }
}
