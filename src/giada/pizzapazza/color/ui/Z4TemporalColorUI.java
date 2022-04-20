package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Date;
import giada.pizzapazza.color.Z4AbstractGradientColor;
import giada.pizzapazza.color.Z4TemporalColor;
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
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
public class Z4TemporalColorUI extends Z4ComponentUI<Z4TemporalColor> {

  private final $HTMLElement temporalColorLabel = this.querySelector(".temporal-color-label");
  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
//  private final $HTMLElement sliders = this.querySelector(".sliders");
//  private final $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
//  private final $HTMLElement mirroredCheck = this.querySelector(".mirrored-check");
//  private final $HTMLElement formRange = this.querySelector(".form-range");
//  private final HTMLElement del = document.createElement("button");
//  private final Z4ColorUI z4ColorUI = new Z4ColorUI();
//  
  private final String key = new Date().getTime() + "-" + parseInt(1000 * Math.random());
  private Z4TemporalColor temporalColor = new Z4TemporalColor();
  private $Apply_0_Void devicePixelRatioListener;
//  private boolean mouseDown;
//  
  private final static String UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");
  private final static int WIDTH = 500;
  private final static int HEIGHT = 200;

  /**
   * Creates a Z4TemporalColorUI
   */
  public Z4TemporalColorUI() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio();
    
    this.temporalColorLabel.innerText = Z4MessageFactory.get("TEMPORAL_COLOR");
    
//    $HTMLElement inverted = this.querySelector(".gradient-inverted");
//    inverted.innerText = Z4MessageFactory.get("INVERTED");
//    inverted.onclick = (event) -> {
//      this.setZ4GradientColor(this.gradientColor.inverted());
//      this.onchange.$apply(this.gradientColor);
//      return null;
//    };
//    
//    $HTMLElement negative = this.querySelector(".gradient-negative");
//    negative.innerText = Z4MessageFactory.get("NEGATIVE");
//    negative.onclick = (event) -> {
//      this.setZ4GradientColor(this.gradientColor.negative());
//      this.onchange.$apply(this.gradientColor);
//      return null;
//    };
//    
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4TemporalColorUI.WIDTH + "px";
    this.canvas.style.height = Z4TemporalColorUI.HEIGHT + "px";
//    
//    this.sliders.onmousemove = (event) -> {
//      double x = event.clientX - this.sliders.getBoundingClientRect().left;
//      double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
//      this.sliders.style.cursor = x < width ? "pointer" : "default";
//      
//      return null;
//    };
//    
//    if (Z4Loader.touch) {
//      this.sliders.ontouchstart = (event) -> {
//        this.addColor(event.changedTouches.$get(0).clientX);
//        return null;
//      };
//    } else {
//      this.sliders.onmousedown = (event) -> {
//        this.addColor(event.clientX);
//        return null;
//      };
//    }
//    
//    this.querySelector(".ripple-color-label").innerText = Z4MessageFactory.get("RIPPLE");
//    this.querySelector(".mirrored-label").innerText = Z4MessageFactory.get("MIRRORED");
//    
//    this.mirroredCheck.onchange = (event) -> {
//      this.gradientColor.setMirrored(this.mirroredCheck.checked);
//      this.configureSliders(-1);
//      this.drawCanvas();
//      this.onchange.$apply(this.gradientColor);
//      return null;
//    };
//    
//    this.formRange.oninput = (event) -> {
//      this.formRangeLabel.innerText = this.formRange.value;
//      this.gradientColor.setRipple(this.formRange.valueAsNumber);
//      this.drawCanvas();
//      this.onchange.$apply(this.gradientColor);
//      return null;
//    };
//    
//    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
//    this.z4ColorUI.onchange = (z4Color) -> {
//      $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
//      this.gradientColor.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
//      
//      this.drawCanvas();
//      this.onchange.$apply(this.gradientColor);
//    };
//    
//    this.del.setAttribute("class", "dropdown-item delete-color");
//    this.del.setAttribute("type", "button");
//    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
//    this.del.innerText = Z4MessageFactory.get("DELETE");
//    this.del.onclick = (event) -> {
//      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () -> {
//        $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
//        this.gradientColor.removeColor(parseFloat(input.value));
//        this.configureSliders(-1);
//        this.drawCanvas();
//        this.onchange.$apply(this.gradientColor);
//      }, () -> {
//      }, null, null);
//      
//      return null;
//    };
//    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);

    this.setZ4TemporalColor(this.temporalColor);
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
//  private void addColor(double x) {
//    x -= this.sliders.getBoundingClientRect().left + 8;
//    double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
//    if (x < width) {
//      double position = x / width;
//      
//      if (this.gradientColor.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
//        this.gradientColor.generateColor(position);
//        this.configureSliders(this.gradientColor.getComponents().length - 1);
//        this.drawCanvas();
//        this.onchange.$apply(this.gradientColor);
//      }
//    }
//  }

  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @return This Z4GradientColorUI
   */
//  public Z4TemporalColorUI setGradientColorLabel(String token) {
//    this.gradientColorLabel.setAttribute("data-token-lang", token);
//    this.gradientColorLabel.innerText = Z4MessageFactory.get(token);
//    return this;
//  }
  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4GradientColorUI
   */
//  public Z4TemporalColorUI setColorLabel(String token) {
//    this.z4ColorUI.setColorLabel(token);
//    return this;
//  }
  /**
   * Returns the Z4TemporalColor
   *
   * @return The Z4TemporalColor
   */
  public Z4TemporalColor getZ4TemporalColor() {
    return this.temporalColor;
  }

  /**
   * Sets the Z4TemporalColor
   *
   * @param color The Z4TemporalColor
   * @return This Z4TemporalColorUI
   */
  public Z4TemporalColorUI setZ4TemporalColor(Z4TemporalColor color) {
    this.temporalColor = color;
//    this.mirroredCheck.checked = this.temporalColor.isMirrored();
//    this.formRange.valueAsNumber = this.temporalColor.getRipple();

//    this.configureSliders(-1);
    this.drawCanvas();

    return this;
  }
//  private void configureSliders(int selected) {
//    double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
//    
//    this.sliders.innerHTML = "";
//    this.gradientColor.getComponents().forEach((z4StopColor, index, array) -> {
//      double position = z4StopColor.getPosition();
//      double left = width * position - (index * 16);
//      
//      $HTMLElement input = ($HTMLElement) document.createElement("input");
//      input.setAttribute("class", "form-check-input");
//      input.setAttribute("type", "radio");
//      input.setAttribute("name", "colors_" + this.key);
//      input.setAttribute("value", "" + position);
//      input.setAttribute("style", (index != 0 && index != 1 ? "cursor:ew-resize;" : "") + "position:relative;left:" + left + "px");
//      
//      input.onchange = (event) -> {
//        this.z4ColorUI.setZ4Color(this.gradientColor.getComponents().find((color, idx, arr) -> index == idx));
//        
//        if (index == 0 || index == 1) {
//          this.del.setAttribute("disabled", "");
//        } else {
//          this.del.removeAttribute("disabled");
//        }
//        return null;
//      };
//      
//      if (Z4Loader.touch) {
//        input.ontouchstart = (event) -> this.manageEvent(event, true, false, index, input, event.changedTouches.$get(0).clientX);
//        input.ontouchmove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches.$get(0).clientX);
//        input.ontouchend = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
//        input.ontouchcancel = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
//      } else {
//        input.onmousedown = (event) -> this.manageEvent(event, true, false, index, input, event.clientX);
//        input.onmousemove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
//        input.onmouseup = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
//        input.onmouseleave = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
//      }
//      
//      if (selected != -1 && index == selected) {
//        input.setAttribute("checked", "");
//        this.z4ColorUI.setZ4Color(z4StopColor);
//        this.del.removeAttribute("disabled");
//      } else if (selected == -1 && index == 0) {
//        input.setAttribute("checked", "");
//        this.z4ColorUI.setZ4Color(z4StopColor);
//        this.del.setAttribute("disabled", "");
//      }
//      
//      this.sliders.appendChild(input);
//    });
//  }
//  private Object manageEvent(UIEvent event, boolean mouseDown, boolean check, int index, $HTMLElement input, double x) {
//    event.stopPropagation();
//    this.mouseDown = mouseDown;
//    if (check && this.mouseDown && index != 0 && index != 1) {
//      this.moveColor(input, index, x);
//    }
//    
//    return null;
//  }
//  private void moveColor($HTMLElement input, int idx, double x) {
//    x -= this.sliders.getBoundingClientRect().left + 8;
//    double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
//    
//    if (x < width) {
//      double position = x / width;
//      double left = width * position - (idx * 16);
//      if (this.gradientColor.getComponents().every((color, index, array) -> index == idx || Math.abs(position - color.getPosition()) > 0.05)) {
//        double oldPosition = parseFloat(input.value);
//        
//        input.setAttribute("value", "" + position);
//        input.setAttribute("style", "cursor:ew-resize;position:relative;left:" + left + "px");
//        this.gradientColor.move(oldPosition, position);
//        this.drawCanvas();
//        this.onchange.$apply(this.gradientColor);
//      }
//    }
//  }

  private void drawCanvas() {
    this.canvas.width = Math.floor(Z4TemporalColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4TemporalColorUI.HEIGHT * window.devicePixelRatio);

    $OffscreenCanvas offscreen = new $OffscreenCanvas(Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < Z4TemporalColorUI.WIDTH; x++) {
      Z4AbstractGradientColor<?> z4GradientColor = this.temporalColor.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);

      for (int y = 0; y < Z4TemporalColorUI.HEIGHT; y++) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / Z4TemporalColorUI.HEIGHT, true, true).$getHEX();
        offscreenCtx.fillRect(x, Z4TemporalColorUI.HEIGHT - y - 1, 1, 1);
      }
    }

    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
