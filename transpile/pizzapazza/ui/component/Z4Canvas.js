/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   ribbonFilePanel = null;

   ribbonLayerPanel = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

   projectName = null;

   width = 0;

   height = 0;

   zoom = 1;

   zooming = false;

   saved = true;

   changed = false;

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
   * Sets the ribbon panels
   *
   * @param ribbonFilePanel The ribbon file panel
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonFilePanel, ribbonLayerPanel, ribbonHistoryPanel) {
    this.ribbonFilePanel = ribbonFilePanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonFilePanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
    this.statusPanel.setCanvas(this);
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
    this.ribbonHistoryPanel.resetHistory(() => {
      this.afterCreate("", width, height);
      this.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
    });
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
      this.ribbonHistoryPanel.resetHistory(() => {
        this.afterCreate(projectName, image.width, image.height);
        this.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
      });
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
    this.changed = false;
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
          this.ribbonHistoryPanel.resetHistory(() => {
            let json = JSON.parse("" + str);
            this.width = json["width"];
            this.height = json["height"];
            this.openLayer(zip, json, json["layers"], 0);
          });
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
        if (index + 1 < layers.length) {
          this.openLayer(zip, json, layers, index + 1);
        } else if (json["history"]) {
          this.jsonToHistory(zip, json, 0, json["currentKeyHistory"], 0);
        } else {
          this.afterCreate(json["projectName"], json["width"], json["height"]);
          this.toHistory(json2 => this.ribbonHistoryPanel.addHistory(json2, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
          Z4UI.pleaseWaitCompleted();
        }
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

   jsonToHistory(zip, json, index, previousCurrentKey, newCurrentKey) {
    let history = json["history"];
    let key = history[index];
    let folder = "history/history_" + key + "/";
    zip.file(folder + "manifest.json").async("string", null).then(str => {
      let layerJSON = JSON.parse("" + str);
      this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, 0, key);
    });
  }

   layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, layerIndex, historyKey) {
    zip.file(folder + "layers/layer" + layerIndex + ".png").async("blob", metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(blob => {
      let layers = layerJSON["layers"];
      let layer = layers[layerIndex];
      layer["data"] = blob;
      if (layerIndex + 1 < layers.length) {
        this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, layerIndex + 1, historyKey);
      } else if (index + 1 < (json["history"]).length) {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey => this.jsonToHistory(zip, json, index + 1, previousCurrentKey, previousCurrentKey === historyKey ? currentKey : newCurrentKey), true);
      } else {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey => {
          this.ribbonHistoryPanel.setCurrentKey(previousCurrentKey === historyKey ? currentKey : newCurrentKey);
          this.afterCreate(json["projectName"], json["width"], json["height"]);
          Z4UI.pleaseWaitCompleted();
        }, true);
      }
    });
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param saveHistory true to save the history, false otherwise
   * @param apply The function to call after saving
   */
   saveProject(projectName, saveHistory, apply) {
    Z4UI.pleaseWait(this, true, true, false, true, "", () => {
      this.projectName = projectName;
      this.statusPanel.setProjectName(projectName);
      let zip = new JSZip();
      this.layerToJSON(zip, new Array(), 0, obj => {
        let finish = () => {
          zip.file("manifest.json", JSON.stringify(obj), null);
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
        };
        if (saveHistory) {
          obj["currentKeyHistory"] = this.ribbonHistoryPanel.getCurrentKey();
          obj["history"] = new Array();
          this.historyToJSON(zip, obj, finish);
        } else {
          finish();
        }
      });
    });
  }

   historyToJSON(zip, obj, finish) {
    this.ribbonHistoryPanel.iterateHistoryBuffer((key, value, apply) => {
      if (key !== -1) {
        (obj["history"]).push(key);
        let folder = "history/history_" + key + "/";
        let layers = value["layers"];
        layers.forEach((layer, index, array) => {
          zip.file(folder + "layers/layer" + index + ".png", layer["data"], null);
          layer["data"] = null;
        });
        zip.file(folder + "manifest.json", JSON.stringify(value), null);
        apply();
      } else {
        finish();
      }
    });
  }

  /**
   * Saves the history
   *
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
   saveHistory(policies) {
    this.ribbonHistoryPanel.saveHistory(policies);
  }

  /**
   * Prepare the project for the history
   *
   * @param apply The function to call after preparation
   */
   toHistory(apply) {
    this.layerToJSON(null, new Array(), 0, apply);
  }

   layerToJSON(zip, layers, index, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      if (zip) {
        zip.file("layers/layer" + index + ".png", blob, null);
      }
      let offset = layer.getOffset();
      let layerJSON = new Object();
      if (!zip) {
        layerJSON["data"] = blob;
      }
      layerJSON["name"] = layer.getName();
      layerJSON["opacity"] = layer.getOpacity();
      layerJSON["compositeOperation"] = layer.getCompositeOperation();
      layerJSON["offsetX"] = offset.x;
      layerJSON["offsetY"] = offset.y;
      layers[index] = layerJSON;
      if (index + 1 === this.paper.getLayersCount()) {
        let JSON = new Object();
        JSON["projectName"] = this.projectName;
        JSON["width"] = this.width;
        JSON["height"] = this.height;
        JSON["layers"] = layers;
        apply(JSON);
      } else {
        this.layerToJSON(zip, layers, index + 1, apply);
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
      this.paper.draw(offscreenCtx, false, false);
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
    this.changed = true;
    this.ribbonHistoryPanel.saveHistory("standard,tool");
    this.ribbonLayerPanel.addLayerPreview(this.paper.getLayerAt(this.paper.getLayersCount() - 1));
    this.saved = false;
  }

  /**
   * Duplicates a layer
   *
   * @param layer The layer
   */
   duplicateLayer(layer) {
    let offset = layer.getOffset();
    layer.convertToBlob(blob => {
      let image = document.createElement("img");
      image.onload = event => {
        this.paper.addLayerFromImage(this.findLayerName(), image, this.width, this.height);
        let duplicate = this.paper.getLayerAt(this.paper.getLayersCount() - 1);
        duplicate.setOpacity(layer.getOpacity());
        duplicate.setCompositeOperation(layer.getCompositeOperation());
        duplicate.move(offset.x, offset.y);
        this.ribbonLayerPanel.addLayerPreview(duplicate);
        this.saved = false;
        this.drawCanvas();
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Deletes a layer
   *
   * @param layer The layer
   * @return The layer index
   */
   deleteLayer(layer) {
    let index = this.paper.deleteLayer(layer);
    this.saved = false;
    this.drawCanvas();
    return index;
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
      this.changed = true;
      this.ribbonHistoryPanel.saveHistory("standard,tool");
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
   * Sets the saved status of the canvas
   *
   * @param saved true to set the canvas as saved, false otherwise
   */
   setSaved(saved) {
    this.saved = saved;
  }

  /**
   * Checks if this canvas is changed
   *
   * @return true if this canvas is changed, false otherwise
   */
   isChanged() {
    return this.changed;
  }

  /**
   * Sets the changed status of the canvas
   *
   * @param changed true to set the canvas as changed, false otherwise
   */
   setChanged(changed) {
    this.changed = changed;
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
    this.paper.draw(this.ctx, false, false);
    this.ctx.restore();
  }

   onMouse(event, type) {
    switch(type) {
      case "down":
        break;
      case "move":
        this.statusPanel.setMousePosition(parseInt(Math.max(0, event.offsetX / this.zoom)), parseInt(Math.max(0, event.offsetY / this.zoom)));
        break;
      case "up":
        break;
    }
  }
}
