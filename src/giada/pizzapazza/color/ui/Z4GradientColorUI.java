package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4ImageFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import jsweet.util.union.Union4;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.window;
import simulation.js.$ResizeObserver;

/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColorUI extends Z4AbstractComponentWithValueUI<Z4GradientColor> {

  private final Z4ColorUI startColorUI = new Z4ColorUI().setColorLabel("START", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-start-container"));
  private final $Canvas canvas = ($Canvas) this.querySelector(".gradient-color-canvas");
  private final Z4ColorUI stopColorUI = new Z4ColorUI().setColorLabel("STOP", false, true).setOpacityBadgeVisible(false).appendToElement(this.querySelector(".gradient-color-stop-container"));
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement mirroredCheck = this.querySelector(".gradient-color-mirrored-check");
  private final $HTMLElement rippleLabel = this.querySelector(".gradient-color-ripple-label");
  private final $HTMLElement rippleRange = this.querySelector(".gradient-color-ripple-range");

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  public Z4GradientColorUI() {
    super(Z4GradientColorUI.UI);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    this.querySelector(".gradient-color-inverted").onclick = (event) -> {
      this.setValue(this.value.inverted());
      this.onchange.$apply(this.value);
      return null;
    };

    this.querySelector(".gradient-color-negative").onclick = (event) -> {
      this.setValue(this.value.negative());
      this.onchange.$apply(this.value);
      return null;
    };

    this.mirroredCheck.id = this.getUniqueID();
    this.querySelector(".gradient-color-mirrored-label").setAttribute("for", this.mirroredCheck.id);

    this.mirroredCheck.onchange = (event) -> {
      this.onchange.$apply(this.value.setMirrored(this.mirroredCheck.checked));
      this.drawCanvas();
      return null;
    };

    this.rippleRange.oninput = (event) -> {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.oninput.$apply(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };
    this.rippleRange.onchange = (event) -> {
      this.rippleLabel.innerText = this.rippleRange.value;
      this.onchange.$apply(this.value.setRipple(this.rippleRange.valueAsNumber));
      this.drawCanvas();
      return null;
    };

    this.startColorUI.oninput = (z4Color) -> {
      this.oninput.$apply(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.startColorUI.onchange = (z4Color) -> {
      this.onchange.$apply(this.value.setStartColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.oninput = (z4Color) -> {
      this.oninput.$apply(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };
    this.stopColorUI.onchange = (z4Color) -> {
      this.onchange.$apply(this.value.setStopColor(z4Color.getARGB()));
      this.drawCanvas();
    };

    this.setValue(new Z4GradientColor());
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
  public Z4GradientColorUI setGradientColorLabel(String token, boolean bold, boolean italic) {
    $HTMLElement gradientColorLabel = this.querySelector(".gradient-color-label");
    gradientColorLabel.setAttribute("data-token-lang-inner_text", token);
    gradientColorLabel.innerHTML = Z4MessageFactory.get(token);
    gradientColorLabel.style.fontWeight = bold ? "700" : "400";
    gradientColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4GradientColor value) {
    this.value = value;

    this.mirroredCheck.checked = this.value.isMirrored();
    this.rippleRange.valueAsNumber = this.value.getRipple();
    this.rippleLabel.innerText = this.rippleRange.value;

    this.startColorUI.setValue(this.value.getStartColor());
    this.stopColorUI.setValue(this.value.getStopColor());
    this.drawCanvas();

    return (T) this;
  }

  private void drawCanvas() {
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      for (int x = 0; x < this.canvas.clientWidth; x++) {
        offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).$getHEX();
        offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
      }

      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.fillStyle = this.chessboard;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
