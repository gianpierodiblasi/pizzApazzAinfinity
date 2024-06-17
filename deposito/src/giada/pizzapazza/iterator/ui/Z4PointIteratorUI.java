package giada.pizzapazza.iterator.ui;

import def.js.Array;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.iterator.Z4PointIterator;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$MutationObserver;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;

/**
 * The abstract component to edit a Z4PointIterator
 *
 * @author gianpiero.diblasi
 * @param <S>
 */
public abstract class Z4PointIteratorUI<S extends Z4PointIterator<S>> extends Z4AbstractComponentWithValueUI<S> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".point-iterator-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  /**
   * Draws the demo canvas
   */
  protected void drawCanvas() {
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.value.drawDemo(offscreenCtx, $exists(this.painter) ? this.painter : this.arrowPainter, this.gradientColor, this.canvas.clientWidth, this.canvas.clientHeight);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }
}
