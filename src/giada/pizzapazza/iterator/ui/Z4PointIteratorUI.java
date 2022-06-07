package giada.pizzapazza.iterator.ui;

import def.js.Array;
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
 * @author gianpiero.di.blasi
 * @param <S>
 */
public abstract class Z4PointIteratorUI<S extends Z4PointIterator<S>> extends Z4AbstractComponentWithValueUI<S> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".point-iterator-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".point-iterator-container"));
  private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".point-iterator-container"));

  private final $HTMLElement arrowModule = this.querySelector(".point-iterator-arrow-module-range");
  private final Z4ArrowPainter arrowPainter = new Z4ArrowPainter();
  private Z4Painter<?> painter;

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  /**
   * Creates a Z4PointIteratorUI
   *
   * @param ui The HTML
   */
  protected Z4PointIteratorUI(String ui) {
    super(ui);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);

    this.rotation.oninput = (v) -> this.setRP(v, null, false);
    this.rotation.onchange = (v) -> this.setRP(v, null, true);
    this.progression.oninput = (v) -> this.setRP(null, v, false);
    this.progression.onchange = (v) -> this.setRP(null, v, true);

    this.arrowModule.oninput = (event) -> this.setModule();
    this.arrowModule.onchange = (event) -> this.setModule();
  }

  private void setRP(Z4Rotation rotation, Z4Progression progression, boolean onchange) {
    if ($exists(rotation)) {
      this.value.setRotation(rotation);
    }
    if ($exists(progression)) {
      this.value.setProgression(progression);
    }

    this.drawCanvas();

    if (onchange) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }
  }

  private Object setModule() {
    this.arrowPainter.setModule(this.arrowModule.valueAsNumber);
    this.drawCanvas();
    return null;
  }

  /**
   * Sets the Z4Painter to draw the demo
   *
   * @param <T>
   * @param painter The Z4Painter, it can be null
   * @return This Z4StamperUI
   */
  @SuppressWarnings("unchecked")
  public <T extends Z4PointIteratorUI<?>> T setPainter(Z4Painter<?> painter) {
    this.painter = painter;
    this.querySelector(".point-iterator-arrow-module-container").style.display = $exists(this.painter) ? "none" : "flex";
    this.drawCanvas();
    return (T) this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(S value) {
    this.value = value;

    this.rotation.setValue(this.value.getRotation());
    this.progression.setValue(this.value.getProgression());

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
      this.value.drawDemo(offscreenCtx, $exists(this.painter) ? this.painter : this.arrowPainter, null, this.canvas.clientWidth, this.canvas.clientHeight);

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
