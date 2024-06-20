/**
 * The history manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasHistoryManager {

   canvas = null;

   paper = null;

   size = null;

   ribbonLayerPanel = null;

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
   * Sets the ribbon panels
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
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
   * Opens a canvas project from history
   *
   * @param json The history
   */
   openFromHistory(json) {
    this.paper.reset();
    this.ribbonLayerPanel.reset();
    this.canvas.setSize(json["width"], json["height"]);
    this.openLayerFromHistory(json, json["layers"], 0);
  }

   openLayerFromHistory(json, layers, index) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.addLayerFromImage(layers[index]["name"], image, image.width, image.height);
      this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), layer => {
        layer.setOpacity(layers[index]["opacity"]);
        layer.setCompositeOperation(layers[index]["compositeOperation"]);
        layer.setHidden(layers[index]["hidden"]);
        layer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
      }, true);
      if (index + 1 < layers.length) {
        this.openLayerFromHistory(json, layers, index + 1);
      } else {
        this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
        this.canvas.setSaved(false);
      }
      return null;
    };
    image.src = URL.createObjectURL(layers[index]["data"]);
  }

  /**
   * Prepares the canvas project for the history
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
      layerJSON["hidden"] = layer.isHidden();
      layerJSON["offsetX"] = offset.x;
      layerJSON["offsetY"] = offset.y;
      layers[index] = layerJSON;
      if (index + 1 === this.canvas.getLayersCount()) {
        let JSON = new Object();
        JSON["projectName"] = this.canvas.getProjectName();
        JSON["width"] = this.size.width;
        JSON["height"] = this.size.height;
        JSON["layers"] = layers;
        apply(JSON);
      } else {
        this.layerToJSON(zip, layers, index + 1, apply);
      }
    });
  }
}
