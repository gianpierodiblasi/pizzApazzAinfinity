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

   savingCounter = 0;

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
   */
   create(width, height, color) {
    this.paper.reset();
    this.paper.addLayer(width, height, color, width, height);
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
      this.paper.addLayerFromImage(image, image.width, image.height);
      this.afterCreate(projectName, image.width, image.height);
      this.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

   afterCreate(projectName, width, height) {
    this.projectName = projectName;
    this.saved = true;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProject(projectName, apply) {
    let zip = new JSZip();
    this.projectName = projectName;
    this.savingCounter = 0;
    let layers = new Array();
    for (let index = 0; index < this.paper.getLayersCount(); index++) {
      let idx = index;
      let layer = this.paper.getLayerAt(idx);
      layer.convertToBlob(blob => {
        let offset = layer.getOffset();
        layers.push("{" + "\"offsetX\": " + offset.x + "," + "\"offsetY\": " + offset.y + "}");
        zip.file("layers/layer" + idx + ".png", blob, null);
        this.savingCounter++;
        if (this.savingCounter === this.paper.getLayersCount()) {
          let manifest = "{" + "\"projectName\": \"" + this.projectName + "\",\n" + "\"layers\": [" + layers.join(",") + "]" + "}";
          zip.file("manifest.json", manifest, null);
          let options = new Object();
          options["type"] = "blob";
          zip.generateAsync(options).then(zipped => {
            saveAs(zipped, this.projectName + ".z4i");
            if (apply) {
              apply();
            }
          });
        }
      });
    }
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

  /**
   * Sets this canvas as saved
   */
   setSaved() {
    this.saved = true;
  }

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
