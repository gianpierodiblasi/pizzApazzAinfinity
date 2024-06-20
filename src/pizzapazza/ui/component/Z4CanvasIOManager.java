package pizzapazza.ui.component;

import def.dom.Blob;
import def.dom.Event;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.URL;
import def.js.Array;
import def.js.JSON;
import javascript.awt.Dimension;
import javascript.awt.Point;
import javascript.util.fsa.FileSystemFileHandle;
import javascript.util.fsa.FileSystemWritableFileStreamCreateOptions;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_2_Void;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.jszip.$JSZip;

/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasIOManager {

  private final Z4Canvas canvas;
  private final Z4Paper paper;
  private Dimension size;

  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4StatusPanel statusPanel;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   */
  public Z4CanvasIOManager(Z4Canvas canvas, Z4Paper paper) {
    this.canvas = canvas;
    this.paper = paper;
  }

  /**
   * Sets the size
   *
   * @param size The size
   */
  public void setSize(Dimension size) {
    this.size = size;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonHistoryPanel(Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Save a canvas project
   *
   * @param projectName The project name
   * @param save The function used to save
   * @param apply The function to call after saving
   */
  public void saveProject(String projectName, $Apply_2_Void<Object, String> save, $Apply_0_Void apply) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () -> {
      this.statusPanel.setProjectName(projectName);

      $JSZip zip = new $JSZip();
      this.layerToJSON(zip, projectName, new Array<>(), 0, obj -> {
        $Apply_0_Void finish = () -> {
          zip.file("manifest.json", JSON.stringify(obj), null);

          $Object options = new $Object();
          options.$set("type", "blob");
          options.$set("compression", "DEFLATE");
          options.$set("streamFiles", true);

          $Object compressionOptions = new $Object();
          compressionOptions.$set("level", 9);
          options.$set("compressionOptions", compressionOptions);

          zip.generateAsync(options, metadata -> Z4UI.setPleaseWaitProgressBarValue(metadata.$get("percent"))).then(zipped -> {
            save.$apply(zipped, projectName + ".z4i");
            this.canvas.setSaved(true);

            Z4UI.pleaseWaitCompleted();
            if ($exists(apply)) {
              apply.$apply();
            }
          });
        };

        obj.$set("currentKeyHistory", this.ribbonHistoryPanel.getCurrentKey());
        obj.$set("history", new Array<Integer>());
        this.historyToJSON(zip, obj, finish);
      });
    });
  }

  private void layerToJSON($JSZip zip, String projectName, Array<$Object> layers, int index, $Apply_1_Void<$Object> apply) {
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
        JSON.$set("projectName", projectName);
        JSON.$set("width", this.size.width);
        JSON.$set("height", this.size.height);
        JSON.$set("layers", layers);

        apply.$apply(JSON);
      } else {
        this.layerToJSON(zip, projectName, layers, index + 1, apply);
      }
    });
  }

  @SuppressWarnings("unchecked")
  private void historyToJSON($JSZip zip, $Object obj, $Apply_0_Void finish) {
    this.ribbonHistoryPanel.iterateHistoryBuffer((key, value, apply) -> {
      if (key != -1) {
        ((Array<Integer>) obj.$get("history")).push(key);
        String folder = "history/history_" + key + "/";

        Array<$Object> layers = value.$get("layers");
        layers.forEach((layer, index, array) -> {
          zip.file(folder + "layers/layer" + index + ".png", layer.$get("data"), null);
          layer.$set("data", null);
        });

        zip.file(folder + "manifest.json", JSON.stringify(value), null);

        apply.$apply();
      } else {
        finish.$apply();
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
  public void exportToFile(String filename, String ext, double quality) {
    this.exportTo(ext, quality, blob -> {
      HTMLElement link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", filename + ext);

      document.body.appendChild(link);

      Event event = document.createEvent("MouseEvents");
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
  public void exportToHandle(FileSystemFileHandle handle, double quality) {
    handle.getFile().then(file -> {
      this.exportTo(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.')), quality, blob -> handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable -> {
        writable.write(blob);
        writable.close();
      }));
    });
  }

  @SuppressWarnings("StringEquality")
  private void exportTo(String ext, double quality, $Apply_1_Void<Blob> apply) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () -> {
      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.size.width, this.size.height);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false, false);

      $Object options = new $Object();
      options.$set("type", ext == ".png" ? "image/png" : "image/jpeg");
      options.$set("quality", quality);

      offscreen.convertToBlob(options).then(blob -> {
        apply.$apply(blob);
      });
    });
  }
}
