package pizzapazza.ui.component;

import def.dom.Blob;
import javascript.awt.Dimension;
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
