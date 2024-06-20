package pizzapazza.ui.component;

import def.dom.Blob;
import def.dom.Event;
import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.URL;
import javascript.awt.Dimension;
import javascript.util.fsa.FileSystemFileHandle;
import javascript.util.fsa.FileSystemWritableFileStreamCreateOptions;
import pizzapazza.util.Z4Paper;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_1_Void;
import simulation.js.$Object;

/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasIOManager {

  private final Z4Canvas canvas;
  private final Z4Paper paper;
  private Dimension size;

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
