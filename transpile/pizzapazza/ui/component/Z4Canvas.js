/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   ribbonLayerPanel = null;

   statusPanel = null;

   projectName = null;

   width = 0;

   height = 0;

   zoom = 1;

   zooming = false;

   saved = true;

   paper = new Z4Paper();

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);
    this.canvas.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.canvas.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.canvas.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.addEventListener("wheel", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.deltaY < 0) {
        this.zoomIn();
      } else if (evt.ctrlKey && evt.deltaY > 0) {
        this.zoomOut();
      }
    });
    this.addEventListener("keydown", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.key === "+") {
        evt.stopPropagation();
        this.zoomIn();
      } else if (evt.key === "-") {
        evt.stopPropagation();
        this.zoomOut();
      }
    });
  }

  /**
   * Sets the ribbon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
   setRibbonLayerPanel(ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Creates a new project
   *
   * @param width The image width
   * @param height The image height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   create(width, height, filling) {
    this.paper.reset();
    this.paper.addLayer(Z4Translations.BACKGROUND_LAYER, width, height, filling, width, height);
    this.width = width;
    this.height = height;
    this.ribbonLayerPanel.reset();
    this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));
    this.afterCreate("", width, height);
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
   createFromClipboard() {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          this.createFromURL("", URL.createObjectURL(blob));
        });
      });
    });
  }

   createFromURL(projectName, url) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.reset();
      this.paper.addLayerFromImage(Z4Translations.BACKGROUND_LAYER, image, image.width, image.height);
      this.width = image.width;
      this.height = image.height;
      this.ribbonLayerPanel.reset();
      this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));
      this.afterCreate(projectName, image.width, image.height);
      return null;
    };
    image.src = url;
    return null;
  }

   afterCreate(projectName, width, height) {
    this.projectName = projectName;
    this.statusPanel.setProjectName(projectName);
    this.statusPanel.setProjectSize(width, height);
    this.statusPanel.setZoom(1);
    this.zoom = 1;
    this.saved = true;
    this.canvas.width = width;
    this.canvas.height = height;
    this.drawCanvas();
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
   openProject(file) {
    Z4UI.pleaseWait(this, true, true, false, true, "", () => {
      new JSZip().loadAsync(file).then(zip => {
        zip.file("manifest.json").async("string", null).then(str => {
          this.paper.reset();
          this.ribbonLayerPanel.reset();
          let json = JSON.parse("" + str);
          this.width = json["width"];
          this.height = json["height"];
          this.openLayer(zip, json, json["layers"], 0);
        });
      });
    });
  }

   openLayer(zip, json, layers, index) {
    zip.file("layers/layer" + index + ".png").async("blob", metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(blob => {
      let image = document.createElement("img");
      image.onload = event => {
        this.paper.addLayerFromImage(layers[index]["name"], image, image.width, image.height);
        let layer = this.paper.getLayerAt(index);
        layer.setOpacity(layers[index]["opacity"]);
        layer.setCompositeOperation(layers[index]["compositeOperation"]);
        layer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
        this.ribbonLayerPanel.addLayerPreview(layer);
        if (index + 1 === layers.length) {
          this.afterCreate(json["projectName"], json["width"], json["height"]);
          Z4UI.pleaseWaitCompleted();
        } else {
          this.openLayer(zip, json, layers, index + 1);
        }
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProject(projectName, apply) {
    Z4UI.pleaseWait(this, true, true, false, true, "", () => {
      this.projectName = projectName;
      this.statusPanel.setProjectName(projectName);
      this.saveLayer(new JSZip(), new Array(), 0, apply);
    });
  }

   saveLayer(zip, layers, index, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      zip.file("layers/layer" + index + ".png", blob, null);
      let offset = layer.getOffset();
      layers[index] = "{" + "\"name\": \"" + layer.getName() + "\"," + "\"opacity\": " + layer.getOpacity() + "," + "\"compositeOperation\": \"" + layer.getCompositeOperation() + "\"," + "\"offsetX\": " + offset.x + "," + "\"offsetY\": " + offset.y + "}";
      if (index + 1 === this.paper.getLayersCount()) {
        let manifest = "{" + "\"projectName\": \"" + this.projectName + "\",\n" + "\"width\": " + this.width + ",\n" + "\"height\": " + this.height + ",\n" + "\"layers\": [" + layers.join(",") + "]" + "}";
        zip.file("manifest.json", manifest, null);
        let options = new Object();
        options["type"] = "blob";
        options["compression"] = "DEFLATE";
        options["streamFiles"] = true;
        let compressionOptions = new Object();
        compressionOptions["level"] = 9;
        options["compressionOptions"] = compressionOptions;
        zip.generateAsync(options, metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(zipped => {
          saveAs(zipped, this.projectName + ".z4i");
          this.saved = true;
          Z4UI.pleaseWaitCompleted();
          if (apply) {
            apply();
          }
        });
      } else {
        this.saveLayer(zip, layers, index + 1, apply);
      }
    });
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    Z4UI.pleaseWait(this, false, false, false, false, "", () => {
      let offscreen = new OffscreenCanvas(this.width, this.height);
      let offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false);
      let options = new Object();
      options["type"] = ext === ".png" ? "image/png" : "image/jpeg";
      options["quality"] = quality;
      offscreen.convertToBlob(options).then(blob => {
        let link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ext);
        document.body.appendChild(link);
        let event = document.createEvent("MouseEvents");
        event.initEvent("click", false, false);
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });
    });
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   addLayer(width, height, filling) {
    this.paper.addLayer(this.findLayerName(), width, height, filling, this.width, this.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    let name = file.name.substring(0, file.name.lastIndexOf('.'));
    let fileReader = new FileReader();
    fileReader.onload = event => this.addLayerFromURL(name, fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          this.addLayerFromURL(this.findLayerName(), URL.createObjectURL(blob));
        });
      });
    });
  }

   findLayerName() {
    let counter = 0;
    let found = "";
    while (!found) {
      found = Z4Translations.LAYER + "_" + counter;
      for (let index = 0; index < this.paper.getLayersCount(); index++) {
        if (found === this.paper.getLayerAt(index).getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

   addLayerFromURL(name, url) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.addLayerFromImage(name, image, this.width, this.height);
      this.afterAddLayer();
      this.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

   afterAddLayer() {
    this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));
    this.saved = false;
  }

  /**
   * Moves a layer to a position
   *
   * @param layer The layer
   * @param position The new position
   * @return true if the move has been performed, false otherwise
   */
   moveLayer(layer, position) {
    if (this.paper.moveLayer(layer, position)) {
      this.saved = false;
      this.drawCanvas();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
   getLayersCount() {
    return this.paper.getLayersCount();
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
   getProjectName() {
    return this.projectName;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
   isSaved() {
    return this.saved;
  }

  /**
   * Sets the saved status of the canvae
   *
   * @param saved true to set the canvas as saved, false otherwise
   */
   setSaved(saved) {
    this.saved = saved;
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
    this.canvas.width = this.width * zoom;
    this.canvas.height = this.height * zoom;
    this.drawCanvas();
  }

  /**
   * Sets the zoom to fit the available space
   */
   fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
  }

   zoomIn() {
    if (this.zooming) {
    } else {
      this.zooming = true;
      let newZoom = Z4Constants.ZOOM_LEVEL.find(level => level > this.zoom, null);
      if (newZoom) {
        this.zoom = newZoom;
        this.canvas.width = this.width * newZoom;
        this.canvas.height = this.height * newZoom;
        this.statusPanel.setZoom(this.zoom);
        this.drawCanvas();
      }
      this.zooming = false;
    }
  }

   zoomOut() {
    if (this.zooming) {
    } else {
      this.zooming = true;
      let newZoom = Z4Constants.ZOOM_LEVEL.filter(level => level < this.zoom).pop();
      if (newZoom) {
        this.zoom = newZoom;
        this.canvas.width = this.width * newZoom;
        this.canvas.height = this.height * newZoom;
        this.statusPanel.setZoom(this.zoom);
        this.drawCanvas();
      }
      this.zooming = false;
    }
  }

  /**
   * Draws this canvas
   */
   drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false);
    this.ctx.restore();
  }

   onMouse(event, type) {
    switch(type) {
      case "down":
        break;
      case "move":
        this.statusPanel.setMousePosition(parseInt(event.offsetX / this.zoom), parseInt(event.offsetY / this.zoom));
        break;
      case "up":
        break;
    }
  }
}
