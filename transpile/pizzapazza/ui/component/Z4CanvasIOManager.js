/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasIOManager {

   canvas = null;

   paper = null;

   drawingTools = null;

   size = null;

   ribbonLayerPanel = null;

   ribbonDrawingToolPanel = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   * @param drawingTools The drawing tools
   */
  constructor(canvas, paper, drawingTools) {
    this.canvas = canvas;
    this.paper = paper;
    this.drawingTools = drawingTools;
  }

  /**
   * Sets the ribbon panels
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
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
   * Creates a new canvas project from an image file
   *
   * @param handle The file handle
   */
   createFromHandle(handle) {
    handle.getFile().then(file => {
      this.createFromFile(file);
    });
  }

  /**
   * Creates a new canvas project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), fileReader.result);
    fileReader.readAsDataURL(file);
  }

  /**
   * Creates a new canvas project from an image in the clipboard
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
      this.canvas.setSize(image.width, image.height);
      this.ribbonLayerPanel.reset();
      this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.canvas.getLayersCount() - 1), null, true);
      this.drawingTools.length = 0;
      this.ribbonDrawingToolPanel.reset();
      this.ribbonHistoryPanel.resetHistory(() => {
        this.canvas.afterCreate(projectName, image.width, image.height);
        this.canvas.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
      });
      return null;
    };
    image.src = url;
    return null;
  }

  /**
   * Opens a canvas project
   *
   * @param handle The file handle
   */
   openProjectFromHandle(handle) {
    handle.getFile().then(file => {
      this.openProjectFromFile(file);
    });
  }

  /**
   * Opens a canvas project
   *
   * @param file The file
   */
   openProjectFromFile(file) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => {
      new JSZip().loadAsync(file).then(zip => {
        zip.file("manifest.json").async("string", null).then(str => {
          this.paper.reset();
          this.ribbonLayerPanel.reset();
          this.drawingTools.length = 0;
          this.ribbonDrawingToolPanel.reset();
          this.ribbonHistoryPanel.resetHistory(() => {
            let json = JSON.parse("" + str);
            this.canvas.setSize(json["width"], json["height"]);
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
        this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), selectedLayer => {
          selectedLayer.setOpacity(layers[index]["opacity"]);
          selectedLayer.setCompositeOperation(layers[index]["compositeOperation"]);
          selectedLayer.setHidden(layers[index]["hidden"]);
          selectedLayer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
        }, true);
        if (index + 1 < layers.length) {
          this.openLayer(zip, json, layers, index + 1);
        } else if (json["history"]) {
          this.jsonToHistory(zip, json, 0, json["currentKeyHistory"], 0);
        } else {
          this.jsonToDrawingTools(zip, () => {
            this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
            this.canvas.toHistory(json2 => this.ribbonHistoryPanel.addHistory(json2, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
            Z4UI.pleaseWaitCompleted();
          });
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
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey => this.jsonToDrawingTools(zip, () => {
          this.ribbonHistoryPanel.setCurrentKey(previousCurrentKey === historyKey ? currentKey : newCurrentKey);
          this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
          Z4UI.pleaseWaitCompleted();
        }), true);
      }
    });
  }

   jsonToDrawingTools(zip, apply) {
    let zipObject = zip.file("drawingTools.json");
    if (zipObject) {
      zipObject.async("string", null).then(str => {
        ((JSON.parse(str))["drawingTools"]).forEach(drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
        apply();
      });
    } else {
      apply();
    }
  }

  /**
   * Saves a canvas project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   * @return The project name
   */
   saveProjectToHandle(handle, apply) {
    let projectName = handle.name.substring(0, handle.name.lastIndexOf('.'));
    this.saveProject(projectName, (zipped, name) => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(zipped);
      writable.close();
    }), apply);
    return projectName;
  }

  /**
   * Saves a canvas project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProjectToFile(projectName, apply) {
    this.saveProject(projectName, (zipped, name) => saveAs(zipped, name), apply);
  }

   saveProject(projectName, save, apply) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => {
      this.statusPanel.setProjectName(projectName);
      let zip = new JSZip();
      this.layerToJSON(zip, projectName, new Array(), 0, obj => {
        let finish = () => {
          let json = new Object();
          let array = new Array();
          this.drawingTools.forEach(drawingTool => array.push(drawingTool.toJSON()));
          json["drawingTools"] = array;
          zip.file("drawingTools.json", JSON.stringify(json), null);
          zip.file("manifest.json", JSON.stringify(obj), null);
          let options = new Object();
          options["type"] = "blob";
          options["compression"] = "DEFLATE";
          options["streamFiles"] = true;
          let compressionOptions = new Object();
          compressionOptions["level"] = 9;
          options["compressionOptions"] = compressionOptions;
          zip.generateAsync(options, metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(zipped => {
            save(zipped, projectName + ".z4i");
            this.canvas.setSaved(true);
            Z4UI.pleaseWaitCompleted();
            if (apply) {
              apply();
            }
          });
        };
        obj["currentKeyHistory"] = this.ribbonHistoryPanel.getCurrentKey();
        obj["history"] = new Array();
        this.historyToJSON(zip, obj, finish);
      });
    });
  }

   layerToJSON(zip, projectName, layers, index, apply) {
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
      layerJSON["hidden"] = layer.isHidden();
      layerJSON["offsetX"] = offset.x;
      layerJSON["offsetY"] = offset.y;
      layers[index] = layerJSON;
      if (index + 1 === this.canvas.getLayersCount()) {
        let JSON = new Object();
        JSON["projectName"] = projectName;
        JSON["width"] = this.size.width;
        JSON["height"] = this.size.height;
        JSON["layers"] = layers;
        apply(JSON);
      } else {
        this.layerToJSON(zip, projectName, layers, index + 1, apply);
      }
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
   * Exports a canvas project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    this.exportTo(ext, quality, blob => {
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
   * Exports a canvas project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
   exportToHandle(handle, quality) {
    handle.getFile().then(file => {
      this.exportTo(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.')), quality, blob => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
        writable.write(blob);
        writable.close();
      }));
    });
  }

   exportTo(ext, quality, apply) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () => {
      let offscreen = new OffscreenCanvas(this.size.width, this.size.height);
      let offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false, false);
      let options = new Object();
      options["type"] = ext === ".png" ? "image/png" : "image/jpeg";
      options["quality"] = quality;
      offscreen.convertToBlob(options).then(blob => {
        apply(blob);
      });
    });
  }

  /**
   * Adds a canvas layer from an image file
   *
   * @param handle The file handle
   */
   addLayerFromHandle(handle) {
    handle.getFile().then(file => {
      this.addLayerFromFile(file);
    });
  }

  /**
   * Adds a canvas layer from an image file
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
   * Adds a canvas layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        item.getType(imageType).then(blob => {
          this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(blob));
        });
      });
    });
  }

  /**
   * Merges an array of layers in the canvas
   *
   * @param layers The layers
   */
   mergeLayers(layers) {
    let offscreen = new OffscreenCanvas(this.size.width, this.size.height);
    let offscreenCtx = offscreen.getContext("2d");
    layers.forEach(layer => layer.draw(offscreenCtx, false, false));
    let options = new Object();
    options["type"] = "image/png";
    offscreen.convertToBlob(options).then(converted => {
      this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(converted));
    });
  }

   addLayerFromURL(name, url) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.addLayerFromImage(name, image, this.size.width, this.size.height);
      this.canvas.afterAddLayer();
      this.canvas.drawCanvas();
      return null;
    };
    image.src = url;
    return null;
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
   addDrawingToolFromHandle(handle) {
    handle.getFile().then(file => {
      this.addDrawingToolFromFile(file);
    });
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
   addDrawingToolFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let json = JSON.parse(fileReader.result);
      if (file.name.toLowerCase().endsWith(".z4ts")) {
        (json["drawingTools"]).forEach(drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
      } else {
        this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(json));
      }
      return null;
    };
    fileReader.readAsText(file);
  }

  /**
   * Saves a drawing tool
   *
   * @param fileName The file name
   * @param drawingTool the drawing tool
   */
   saveDrawingToolToFile(fileName, drawingTool) {
    if (!fileName.toLowerCase().endsWith(".z4t")) {
      fileName += ".z4t";
    }
    let blob = null;
    eval("blob = new Blob([JSON.stringify(drawingTool.toJSON())], {type: 'application/json'});");
    saveAs(blob, fileName);
  }

  /**
   * Saves a drawing tool
   *
   * @param handle The file handle
   * @param drawingTool The drawing tool
   */
   saveDrawingToolToHandle(handle, drawingTool) {
    handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(JSON.stringify(drawingTool.toJSON()));
      writable.close();
    });
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
   saveDrawingToolsToFile(fileName) {
    if (!fileName.toLowerCase().endsWith(".z4ts")) {
      fileName += ".z4ts";
    }
    this.saveDrawingTools(fileName, (json, name) => {
      let blob = null;
      eval("blob = new Blob([JSON.stringify(json)], {type: 'application/json'});");
      saveAs(blob, name);
    });
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
   saveDrawingToolsToHandle(handle) {
    let fileName = handle.name.substring(0, handle.name.lastIndexOf('.'));
    this.saveDrawingTools(fileName, (json, name) => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(JSON.stringify(json));
      writable.close();
    }));
  }

   saveDrawingTools(fileName, save) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () => {
      let array = new Array();
      this.drawingTools.forEach(drawingTool => array.push(drawingTool.toJSON()));
      let json = new Object();
      json["drawingTools"] = array;
      save(json, fileName);
    });
  }
}
