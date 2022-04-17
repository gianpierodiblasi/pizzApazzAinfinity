package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.HTMLElement;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.setting.Z4ImageFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import jsweet.util.union.Union4;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColorUI extends Z4ComponentUI<Z4GradientColor> {

  private final $HTMLElement gradientColorLabel = this.querySelector(".gradient-color-label");
  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
  private final $HTMLElement mirroredCheck = this.querySelector(".mirrored-check");
  private final $HTMLElement formRange = this.querySelector(".form-range");

  private Z4GradientColor gradientColor = new Z4GradientColor();
  private $Apply_0_Void devicePixelRatioListener;

  private final static String UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4GradientColorUI.html");
  private final static int WIDTH = 500;
  private final static int HEIGHT = 50;

  /**
   * Creates a Z4ColorUI
   */
  public Z4GradientColorUI() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();

    this.gradientColorLabel.innerText = Z4MessageFactory.get("GRADIENT_COLOR");
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";

//    this.gradientColor.addOrUpdateColor(0.75,128<<24|255<<16);
    $HTMLElement sliders = this.querySelector(".sliders");
    this.gradientColor.getComponents().forEach((z4StopColor, index, array) -> {
      double position = z4StopColor.getPosition();
      double left = Z4GradientColorUI.WIDTH * position - (index * 16);
      
      HTMLElement input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors");
      input.setAttribute("value", "" + position);
      input.setAttribute("style", "position:relative;left:" + left + "px");

      sliders.appendChild(input);
    });

    this.querySelector(".ripple-color-label").innerText = Z4MessageFactory.get("RIPPLE");
    this.querySelector(".mirrored-label").innerText = Z4MessageFactory.get("MIRRORED");

    this.mirroredCheck.onchange = (event) -> {
      this.gradientColor.setMirrored(this.mirroredCheck.checked);
      this.drawCanvas();
      this.onchange.$apply(this.gradientColor);
      return null;
    };

    this.formRange.oninput = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.gradientColor.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange.$apply(this.gradientColor);
      return null;
    };

    this.drawCanvas();
  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @return This Z4GradientColorUI
   */
  public Z4GradientColorUI setGradientColorLabel(String token) {
    this.gradientColorLabel.setAttribute("data-token-lang", token);
    this.gradientColorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Color
   *
   * @param color The Z4Color
   * @return This Z4GradientColorUI
   */
//  public Z4GradientColorUI setZ4Color(Z4Color color) {
//    this.color.value = color.getHEX().substring(0, 7);
//    this.formRange.valueAsNumber = color.getComponents().$get(0);
//    this.formRangeLabel.innerText = this.formRange.value;
//    return this;
//  }
//  
  /**
   * Returns the Z4GradientColor
   *
   * @return The Z4GradientColor
   */
  public Z4GradientColor getZ4GradientColor() {
    return this.gradientColor;
  }

  private void initDevicePixelRatio() {
    if ($exists(window.matchMedia)) {
      this.devicePixelRatioListener = () -> {
        this.drawCanvas();
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

  private void addDevicePixelRatioListener() {
    $Object options = new $Object();
    options.$set("once", true);
    window.$matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

  private void drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);

    $OffscreenCanvas offscreen = new $OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.gradientColor.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).$getHEX();
      offscreenCtx.fillRect(x, 0, 1, Z4GradientColorUI.HEIGHT);
    }

    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
