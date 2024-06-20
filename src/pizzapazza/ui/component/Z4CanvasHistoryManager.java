package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.dom.URL;
import def.js.Array;
import javascript.awt.Dimension;
import javascript.awt.Point;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import simulation.dom.$Image;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.jszip.$JSZip;

/**
 * The history manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasHistoryManager {

  private final Z4Canvas canvas;
  private final Z4Paper paper;
  private Dimension size;

  private Z4RibbonLayerPanel ribbonLayerPanel;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   */
  public Z4CanvasHistoryManager(Z4Canvas canvas, Z4Paper paper) {
    this.canvas = canvas;
    this.paper = paper;
  }

  /**
   * Sets the ribbon panels
   *
   * @param size The size
   */
  public void setSize(Dimension size) {
    this.size = size;
  }

  /**
   * Sets the ribbon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
  public void setRibbonLayerPanel(Z4RibbonLayerPanel ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
  }

  /**
   * Opens a canvas project from history
   *
   * @param json The history
   */
  public void openFromHistory($Object json) {
    this.paper.reset();
    this.ribbonLayerPanel.reset();

    this.canvas.setSize(json.$get("width"), json.$get("height"));

    this.openLayerFromHistory(json, json.$get("layers"), 0);
  }

  private void openLayerFromHistory($Object json, Array<$Object> layers, int index) {
    $Image image = ($Image) document.createElement("img");

    image.onload = event -> {
      this.paper.addLayerFromImage(layers.$get(index).$get("name"), image, (int) image.width, (int) image.height);

      this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), layer -> {
        layer.setOpacity(layers.$get(index).$get("opacity"));
        layer.setCompositeOperation(layers.$get(index).$get("compositeOperation"));
        layer.setHidden(layers.$get(index).$get("hidden"));
        layer.move(layers.$get(index).$get("offsetX"), layers.$get(index).$get("offsetY"));
      }, true);

      if (index + 1 < layers.length) {
        this.openLayerFromHistory(json, layers, index + 1);
      } else {
        this.canvas.afterCreate(json.$get("projectName"), json.$get("width"), json.$get("height"));
        this.canvas.setSaved(false);
      }
      return null;
    };

    image.src = URL.createObjectURL(layers.$get(index).$get("data"));
  }

  /**
   * Prepares the canvas project for the history
   *
   * @param apply The function to call after preparation
   */
  public void toHistory($Apply_1_Void<$Object> apply) {
    this.layerToJSON(null, new Array<>(), 0, apply);
  }
  
  private void layerToJSON($JSZip zip, Array<$Object> layers, int index, $Apply_1_Void<$Object> apply) {
    Z4Layer layer = this.paper.getLayerAt(index);

    layer.convertToBlob(blob -> {
      if ($exists(zip)) {
        zip.file("layers/layer" + index + ".png", blob, null);
      }

      Point offset = layer.getOffset();

      $Object layerJSON = new $Object();
      if (!$exists(zip)) {
        layerJSON.$set("data", blob);
      }
      layerJSON.$set("name", layer.getName());
      layerJSON.$set("opacity", layer.getOpacity());
      layerJSON.$set("compositeOperation", layer.getCompositeOperation());
      layerJSON.$set("hidden", layer.isHidden());
      layerJSON.$set("offsetX", offset.x);
      layerJSON.$set("offsetY", offset.y);

      layers.$set(index, layerJSON);

      if (index + 1 == this.canvas.getLayersCount()) {
        $Object JSON = new $Object();
        JSON.$set("projectName", this.canvas.getProjectName());
        JSON.$set("width", this.size.width);
        JSON.$set("height", this.size.height);
        JSON.$set("layers", layers);

        apply.$apply(JSON);
      } else {
        this.layerToJSON(zip, layers, index + 1, apply);
      }
    });
  }
}
