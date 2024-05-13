/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = null;

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
    this.create(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));
    let image = document.createElement("img");
    image.onload = event => {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
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
   * @param color The filling color
   */
   create(width, height, color) {
    this.paper.reset();
    this.paper.addLayer(Z4Translations.BACKGROUND_LAYER, width, height, color, width, height);
    this.afterCreate("", width, height);
    this.drawCanvas();
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
      this.afterCreate(projectName, image.width, image.height);
      this.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

   afterCreate(projectName, width, height) {
    this.projectName = projectName;
    if (this.statusPanel) {
      this.statusPanel.setProjectName(projectName);
      this.statusPanel.setZoom(1);
    }
    this.width = width;
    this.height = height;
    this.zoom = 1;
    this.saved = true;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
   openProject(file) {
    new JSZip().loadAsync(file).then(zip => {
      zip.file("manifest.json").async("string", null).then(str => {
        this.paper.reset();
        let json = JSON.parse("" + str);
        this.openLayer(zip, json, json["layers"], 0);
      });
    });
  }

   openLayer(zip, json, layers, index) {
    zip.file("layers/layer" + index + ".png").async("blob", metadata => this.statusPanel.setProgressBarValue(metadata["percent"])).then(blob => {
      let image = document.createElement("img");
      this.statusPanel.setProgressBarValue(0);
      image.onload = event => {
        this.paper.addLayerFromImage(layers[index]["name"], image, image.width, image.height);
        this.paper.getLayerAt(index).move(layers[index]["offsetX"], layers[index]["offsetY"]);
        if (index + 1 === layers.length) {
          this.afterCreate(json["projectName"], json["width"], json["height"]);
          this.drawCanvas();
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
    this.projectName = projectName;
    this.statusPanel.setProjectName(projectName);
    this.saveLayer(new JSZip(), new Array(), 0, apply);
  }

   saveLayer(zip, layers, index, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      zip.file("layers/layer" + index + ".png", blob, null);
      let offset = layer.getOffset();
      layers[index] = "{" + "\"name\": \"" + layer.getName() + "\"," + "\"offsetX\": " + offset.x + "," + "\"offsetY\": " + offset.y + "}";
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
        zip.generateAsync(options, metadata => this.statusPanel.setProgressBarValue(metadata["percent"])).then(zipped => {
          saveAs(zipped, this.projectName + ".z4i");
          this.statusPanel.setProgressBarValue(0);
          this.saved = true;
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
    let offscreen = new OffscreenCanvas(this.width, this.height);
    let offscreenCtx = offscreen.getContext("2d");
    this.paper.draw(offscreenCtx);
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
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   * @param color The filling color
   */
   addLayer(width, height, color) {
    this.paper.addLayer(this.findLayerName(), width, height, color, this.width, this.height);
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
    this.saved = false;
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
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
   isSaved() {
    return this.saved;
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

   drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx);
    this.ctx.restore();
  }
}
