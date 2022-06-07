package giada.pizzapazza.iterator.ui;

import def.js.Array;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.iterator.Z4Spirograph;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.setting.Z4HTMLFactory;
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
 * The component to edit a Z4Spirograph
 *
 * @author gianpiero.di.blasi
 */
public class Z4SpirographUI extends Z4AbstractComponentWithValueUI<Z4Spirograph> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".spirograph-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".spirograph-container"));
  private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".spirograph-container"));
  
  private Z4Painter<?> painter;
  
  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4SpirographUI.html");

  /**
   * Creates a Z4SpirographUI
   */
  public Z4SpirographUI() {
    super(Z4SpirographUI.UI);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);

    this.rotation.oninput = (v) -> {
      this.oninput.$apply(this.value.setRotation(v));
      this.drawCanvas();
    };
    this.rotation.onchange = (v) -> {
      this.onchange.$apply(this.value.setRotation(v));
      this.drawCanvas();
    };
    
    this.progression.oninput = (v) -> {
      this.oninput.$apply(this.value.setProgression(v));
      this.drawCanvas();
    };
    this.progression.onchange = (v) -> {
      this.onchange.$apply(this.value.setProgression(v));
      this.drawCanvas();
    };
    
    this.setValue(new Z4Spirograph());
  }

  /**
   * Sets the Z4Painter to draw the demo
   *
   * @param painter The Z4Painter, it can be null
   * @return This Z4SpirographUI
   */
  public Z4SpirographUI setPainter(Z4Painter<?> painter) {
    this.painter = painter;
    this.drawCanvas();
    return this;
  }
  
  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Spirograph value) {
    this.value = value;

    this.rotation.setValue(this.value.getRotation());
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
      this.value.drawDemo(offscreenCtx, this.painter, null, this.canvas.clientWidth, this.canvas.clientHeight);

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
