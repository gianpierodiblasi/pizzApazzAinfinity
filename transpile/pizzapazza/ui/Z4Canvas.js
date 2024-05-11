/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = null;

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   projectName = null;

   saved = true;

   paper = new Z4Paper();

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.resizeObserver.observe(this.canvas);
    this.canvas.width = Z4Constants.DEFAULT_IMAGE_SIZE;
    this.canvas.height = Z4Constants.DEFAULT_IMAGE_SIZE;
    this.appendNodeChild(this.canvas);
    this.addLayer(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));
    this.saved = true;
    let image = document.createElement("img");
    image.onload = event => {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawCanvas();
      return null;
    };
    image.src = "image/chessboard.png";
  }

  /**
   * Creates a new project
   *
   * @param width The image width
   * @param height The image height
   * @param color The filling color
   * @param statusPanel The status panel to show the progress
   */
   create(width, height, color, statusPanel) {
    this.paper.reset();
    this.paper.addLayer(width, height, color, width, height);
    this.afterCreate("", width, height, statusPanel);
    this.drawCanvas();
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   * @param statusPanel The status panel to show the progress
   */
   createFromFile(file, statusPanel) {
    let fileReader = new FileReader();
    fileReader.onload = event => this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), fileReader.result, statusPanel);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   *
   * @param statusPanel The status panel to show the progress
   */
   createFromClipboard(statusPanel) {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          this.createFromURL("", URL.createObjectURL(blob), statusPanel);
        });
      });
    });
  }

   createFromURL(projectName, url, statusPanel) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.reset();
      this.paper.addLayerFromImage(image, image.width, image.height);
      this.afterCreate(projectName, image.width, image.height, statusPanel);
      this.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

   afterCreate(projectName, width, height, statusPanel) {
    this.projectName = projectName;
    statusPanel.setProjectName(projectName);
    this.saved = true;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Opens a project
   *
   * @param file The file
   * @param statusPanel The status panel to show the progress
   */
   openProject(file, statusPanel) {
    new JSZip().loadAsync(file).then(zip => {
      zip.file("manifest.json").async("string", null).then(str => {
        this.paper.reset();
        let json = JSON.parse("" + str);
        this.openLayer(zip, json, json["layers"], 0, statusPanel);
      });
    });
  }

   openLayer(zip, json, layers, index, statusPanel) {
    zip.file("layers/layer" + index + ".png").async("blob", metadata => statusPanel.setProgressBarValue(metadata["percent"])).then(blob => {
      let image = document.createElement("img");
      statusPanel.setProgressBarValue(0);
      image.onload = event => {
        this.paper.addLayerFromImage(image, image.width, image.height);
        let layer = this.paper.getLayerAt(index);
        layer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
        if (index + 1 === layers.length) {
          this.afterCreate(json["projectName"], json["width"], json["height"], statusPanel);
          this.drawCanvas();
        } else {
          this.openLayer(zip, json, layers, index + 1, statusPanel);
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
   * @param statusPanel The status panel to show the progress
   * @param apply The function to call after saving
   */
   saveProject(projectName, statusPanel, apply) {
    this.projectName = projectName;
    statusPanel.setProjectName(projectName);
    this.saveLayer(new JSZip(), new Array(), 0, statusPanel, apply);
  }

   saveLayer(zip, layers, index, statusPanel, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      let offset = layer.getOffset();
      layers[index] = "{" + "\"offsetX\": " + offset.x + "," + "\"offsetY\": " + offset.y + "}";
      zip.file("layers/layer" + index + ".png", blob, null);
      if (index + 1 === this.paper.getLayersCount()) {
        let manifest = "{" + "\"projectName\": \"" + this.projectName + "\",\n" + "\"width\": " + this.canvas.width + ",\n" + "\"height\": " + this.canvas.height + ",\n" + "\"layers\": [" + layers.join(",") + "]" + "}";
        zip.file("manifest.json", manifest, null);
        let options = new Object();
        options["type"] = "blob";
        options["compression"] = "DEFLATE";
        options["streamFiles"] = true;
        let compressionOptions = new Object();
        compressionOptions["level"] = 9;
        options["compressionOptions"] = compressionOptions;
        zip.generateAsync(options, metadata => statusPanel.setProgressBarValue(metadata["percent"])).then(zipped => {
          saveAs(zipped, this.projectName + ".z4i");
          statusPanel.setProgressBarValue(0);
          this.saved = true;
          if (apply) {
            apply();
          }
        });
      } else {
        this.saveLayer(zip, layers, index + 1, statusPanel, apply);
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
    let offscreen = new OffscreenCanvas(this.canvas.width, this.canvas.height);
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
    this.paper.addLayer(width, height, color, this.canvas.width, this.canvas.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => this.addLayerFromURL(fileReader.result);
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
          this.addLayerFromURL(URL.createObjectURL(blob));
        });
      });
    });
  }

   addLayerFromURL(url) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.addLayerFromImage(image, this.canvas.width, this.canvas.height);
      this.afterAddLayer();
      this.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

   afterAddLayer() {
    let dimension = this.paper.getSize();
    let shiftX = (dimension.width - this.canvas.width) / 2;
    let shiftY = (dimension.height - this.canvas.height) / 2;
    this.paper.shift(shiftX, shiftY);
    this.saved = false;
    this.canvas.width = dimension.width;
    this.canvas.height = dimension.height;
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
   getProjectName() {
    return this.projectName;
  }

  // /**
  // * Sets this canvas as saved
  // */
  // public void setSaved() {
  // this.saved = true;
  // }
  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
   isSaved() {
    return this.saved;
  }

   drawCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.paper.draw(this.ctx);
  }
}
