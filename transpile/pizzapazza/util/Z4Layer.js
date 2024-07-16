/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
class Z4Layer {

   offscreen = null;

   offscreenCtx = null;

   layerPreview = null;

   blob = null;

   name = null;

   offsetX = 0;

   offsetY = 0;

   opacity = 1;

   compositeOperation = "source-over";

   width = 0;

   height = 0;

   hidden = false;

   showBounds = false;

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
      this.offscreenCtx.fillStyle = Z4Constants.getStyle((filling).getRGBA_HEX());
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
   * Sets the layer preview
   *
   * @param layerPreview The layer preview
   */
   setLayerPreview(layerPreview) {
    this.layerPreview = layerPreview;
  }

  /**
   * Returns the layer preview
   *
   * @return The layer preview
   */
   getLayerPreview() {
    return this.layerPreview;
  }

  /**
   * Converts this layer to a blob
   *
   * @param apply The function to call on conversion
   */
   convertToBlob(apply) {
    if (this.blob) {
      apply(this.blob);
    } else {
      let options = new Object();
      options["type"] = "image/png";
      this.offscreen.convertToBlob(options).then(converted => {
        this.blob = converted;
        apply(this.blob);
      });
    }
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
   * Sets the hidden property
   *
   * @param hidden true to hide the layer, false otherwise
   */
   setHidden(hidden) {
    this.hidden = hidden;
  }

  /**
   * Checks if the hidden property is set
   *
   * @return true if the hidden property is set, false otherwise
   */
   isHidden() {
    return this.hidden;
  }

  /**
   * Sets the visualization of the bounds
   *
   * @param showBounds true to show the bounds, false otherwise
   */
   setShowBounds(showBounds) {
    this.showBounds = showBounds;
  }

  /**
   * Checks if the bounds have to be shown
   *
   * @return true if the bounds have to be shown, false otherwise
   */
   isShowBounds() {
    return this.showBounds;
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
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getColorAt(x, y) {
    x -= this.offsetX;
    y -= this.offsetY;
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      let data = this.offscreenCtx.getImageData(x, y, 1, 1).data;
      return new Color(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
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
   draw(ctx, doNotUseProperties) {
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
   drawTool(drawingTool, drawingPoint) {
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
   drawText(textManager) {
    this.offscreenCtx.save();
    textManager.drawText(this.offscreenCtx, false);
    this.offscreenCtx.restore();
    this.blob = null;
  }

  /**
   * Horizontally flips the layer
   */
   flipHorizonal() {
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width / 2; x++) {
        let indexFrom = (y * this.width + x) * 4;
        let indexTo = (y * this.width + this.width - 1 - x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }
    this.offscreenCtx.putImageData(imageData, 0, 0);
    this.blob = null;
  }

  /**
   * Vertically flips the layer
   */
   flipVertical() {
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    for (let y = 0; y < this.height / 2; y++) {
      for (let x = 0; x < this.width; x++) {
        let indexFrom = (y * this.width + x) * 4;
        let indexTo = ((this.height - 1 - y) * this.width + x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }
    this.offscreenCtx.putImageData(imageData, 0, 0);
    this.blob = null;
  }

   flipValue(data, indexFrom, indexTo) {
    let r = data[indexFrom];
    let g = data[indexFrom + 1];
    let b = data[indexFrom + 2];
    let a = data[indexFrom + 3];
    data[indexFrom] = data[indexTo];
    data[indexFrom + 1] = data[indexTo + 1];
    data[indexFrom + 2] = data[indexTo + 2];
    data[indexFrom + 3] = data[indexTo + 3];
    data[indexTo] = r;
    data[indexTo + 1] = g;
    data[indexTo + 2] = b;
    data[indexTo + 3] = a;
  }

  /**
   * Rotates the layer in clockwise
   */
   rotatePlus90() {
    let rotatedOffscreen = new OffscreenCanvas(this.height, this.width);
    let rotatedOffscreenCtx = rotatedOffscreen.getContext("2d");
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    let rotatedImageData = rotatedOffscreenCtx.createImageData(this.height, this.width);
    let rotatedData = rotatedImageData.data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = (y * this.width + x) * 4;
        let rotatedIndex = (x * this.height + this.height - 1 - y) * 4;
        rotatedData[rotatedIndex] = data[index];
        rotatedData[rotatedIndex + 1] = data[index + 1];
        rotatedData[rotatedIndex + 2] = data[index + 2];
        rotatedData[rotatedIndex + 3] = data[index + 3];
      }
    }
    rotatedOffscreenCtx.putImageData(rotatedImageData, 0, 0);
    this.offscreen = rotatedOffscreen;
    this.offscreenCtx = rotatedOffscreenCtx;
    this.offsetX += parseInt(this.width / 2 - this.height / 2);
    this.offsetY += parseInt(this.height / 2 - this.width / 2);
    let temp = this.width;
    this.width = this.height;
    this.height = temp;
    this.blob = null;
  }

  /**
   * Resizes the layer
   *
   * @param resizeOptions The resize options
   */
   resize(resizeOptions) {
    let resizedOffscreen = new OffscreenCanvas(resizeOptions.containerWidth, resizeOptions.containerHeight);
    let resizedOffscreenCtx = resizedOffscreen.getContext("2d");
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
