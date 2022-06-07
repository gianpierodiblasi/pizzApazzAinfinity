package giada.pizzapazza.iterator.ui;

import def.js.Array;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.setting.Z4HTMLFactory;
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
 * The component to edit a Z4Stamper
 *
 * @author gianpiero.di.blasi
 */
public class Z4StamperUI extends Z4AbstractComponentWithValueUI<Z4Stamper> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".stamper-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".stamper-container-first-row"));
  private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".stamper-container"));

  private final $HTMLElement arrowModule = this.querySelector(".stamper-arrow-module-range");
  private final Z4ArrowPainter arrowPainter = new Z4ArrowPainter();
  private Z4Painter<?> painter;

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  /**
   * Creates a Z4StamperUI
   */
  public Z4StamperUI() {
    super(Z4StamperUI.UI);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);

    this.rotation.oninput = (v) -> this.set(v, null, null, null, false);
    this.rotation.onchange = (v) -> this.set(v, null, null, null, true);
    this.multiplicity.oninput = (v) -> this.set(null, v, null, null, false);
    this.multiplicity.onchange = (v) -> this.set(null, v, null, null, true);
    this.push.oninput = (v) -> this.set(null, null, v, null, false);
    this.push.onchange = (v) -> this.set(null, null, v, null, true);
    this.progression.oninput = (v) -> this.set(null, null, null, v, false);
    this.progression.onchange = (v) -> this.set(null, null, null, v, true);

    this.arrowModule.oninput = (event) -> this.setModule();
    this.arrowModule.onchange = (event) -> this.setModule();

    this.setValue(new Z4Stamper());
  }

  private void set(Z4Rotation rotation, Z4FancifulValue multiplicity, Z4FancifulValue push, Z4Progression progression, boolean onchange) {
    if ($exists(rotation)) {
      this.value.setRotation(rotation);
    }
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(push)) {
      this.value.setPush(push);
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
   * @param painter The Z4Painter, it can be null
   * @return This Z4Shape2DPainterUI
   */
  public Z4StamperUI setPainter(Z4Painter<?> painter) {
    this.painter = painter;
    this.querySelector(".stamper-arrow-module-container").style.display = $exists(this.painter) ? "none" : "flex";
    this.drawCanvas();
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Stamper value) {
    this.value = value;

    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    this.progression.setValue(this.value.getProgression());

    this.drawCanvas();

    return (T) this;
  }

  private void drawCanvas() {
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
