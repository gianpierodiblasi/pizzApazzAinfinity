/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasIOManager {

   canvas = null;

   paper = null;

   size = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   */
  constructor(canvas, paper) {
    this.canvas = canvas;
    this.paper = paper;
  }

  /**
   * Sets the size
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonHistoryPanel(ribbonHistoryPanel) {
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
   * Saves a canvas project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   */
   saveProjectToHandle(handle, apply) {
    this.saveProject(handle.name.substring(0, handle.name.lastIndexOf('.')), (zipped, name) => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(zipped);
      writable.close();
    }), apply);
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
}
