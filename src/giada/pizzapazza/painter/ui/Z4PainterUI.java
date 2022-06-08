package giada.pizzapazza.painter.ui;

import def.js.Array;
import giada.pizzapazza.iterator.Z4PointIterator;
import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$MutationObserver;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;

/**
 * The abstract component to edit a Z4Painter
 *
 * @author gianpiero.di.blasi
 * @param <S>
 */
public abstract class Z4PainterUI<S extends Z4Painter<S>> extends Z4AbstractComponentWithValueUI<S> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".painter-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private Z4PointIterator<?> pointIterator = new Z4Stamper();

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  /**
   * Creates a Z4PainterUI
   *
   * @param ui The HTML
   */
  protected Z4PainterUI(String ui) {
    super(ui);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);
  }

  /**
   * Sets the Z4PointIterator to draw the demo
   *
   * @param <T>
   * @param pointIterator The Z4PointIterator
   * @return This Z4PainterUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4PainterUI<?>> T setPointIterator(Z4PointIterator<?> pointIterator) {
    this.pointIterator = pointIterator;
    this.drawCanvas();
    return (T) this;
  }

  /**
   * Draws the demo canvas
   */
  protected void drawCanvas() {
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.pointIterator.drawDemo(offscreenCtx, this.value, null, this.canvas.clientWidth, this.canvas.clientHeight);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
