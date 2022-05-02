package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.HTMLElement;
import def.dom.UIEvent;
import def.js.Date;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4ImageFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import giada.pizzapazza.ui.Z4ModalMessageUI;
import jsweet.util.union.Union4;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.window;
import simulation.js.$Object;

/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColorUI extends Z4AbstractComponentWithValueUI<Z4GradientColor> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement sliders = this.querySelector(".sliders");
  private final $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
  private final $HTMLElement mirroredCheck = this.querySelector(".mirrored-check");
  private final $HTMLElement formRange = this.querySelector(".form-range");
  private final HTMLElement del = document.createElement("button");
  private final Z4ColorUI z4ColorUI = new Z4ColorUI();

  private final String key = new Date().getTime() + "_" + parseInt(1000 * Math.random());
  private $Apply_0_Void devicePixelRatioListener;
  private boolean mouseDown;

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");
  private final static int WIDTH = 500;
  private final static int HEIGHT = 50;

  /**
   * Creates a Z4GradientColorUI
   */
  public Z4GradientColorUI() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();

    this.querySelector(".gradient-inverted").onclick = (event) -> {
      this.setValue(this.value.inverted());
      this.onchange.$apply(this.value);
      return null;
    };

    this.querySelector(".gradient-negative").onclick = (event) -> {
      this.setValue(this.value.negative());
      this.onchange.$apply(this.value);
      return null;
    };

    this.querySelector(".gradient-guided-tour").onclick = (event) -> {
      Z4GradientColorGuidedTourUI.show();
      return null;
    };

    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";

    this.sliders.onmousemove = (event) -> {
      this.sliders.style.cursor = "default";
      double x = event.clientX - this.sliders.getBoundingClientRect().left - 8;
      double width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);

      if (x < width) {
        double position = x / width;

        if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
          this.sliders.style.cursor = "pointer";
        }
      }

      return null;
    };

    if (Z4Loader.touch) {
      this.sliders.ontouchstart = (event) -> {
        this.addColor(event.changedTouches.$get(0).clientX);
        return null;
      };
    } else {
      this.sliders.onmousedown = (event) -> {
        this.addColor(event.clientX);
        return null;
      };
    }

    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);

    this.mirroredCheck.onchange = (event) -> {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.configureSliders(-1);
      this.drawCanvas();
      this.onchange.$apply(this.value);
      return null;
    };

    this.formRange.oninput = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.oninput.$apply(this.value);
      return null;
    };
    this.formRange.onchange = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange.$apply(this.value);
      return null;
    };

    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) -> {
      $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());

      this.drawCanvas();
      this.oninput.$apply(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) -> {
      $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());

      this.drawCanvas();
      this.onchange.$apply(this.value);
    };

    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) -> {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () -> {
        $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
        this.value.removeColor(parseFloat(input.value));
        this.configureSliders(-1);
        this.drawCanvas();
        this.onchange.$apply(this.value);
      }, () -> {
      }, null, null);

      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);

    this.setValue(new Z4GradientColor());
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

  private void addColor(double x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    double width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);

    if (x < width) {
      double position = x / width;

      if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.configureSliders(this.value.getComponents().length - 1);
        this.drawCanvas();
        this.onchange.$apply(this.value);
      }
    }
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
    gradientColorLabel.innerText = Z4MessageFactory.get(token);
    gradientColorLabel.style.fontWeight = bold ? "700" : "400";
    gradientColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
  public Z4GradientColorUI setColorLabel(String token, boolean bold, boolean italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4GradientColor value) {
    super.setValue(value);

    this.mirroredCheck.checked = this.value.isMirrored();
    this.formRange.valueAsNumber = this.value.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;

    this.configureSliders(-1);
    this.drawCanvas();

    return (T) this;
  }

  private void configureSliders(int selected) {
    double width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);

    this.sliders.innerHTML = "";
    this.value.getComponents().forEach((z4StopColor, index, array) -> {
      double position = z4StopColor.getPosition();
      double left = width * position - (index * 16);

      $HTMLElement input = ($HTMLElement) document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors_" + this.key);
      input.setAttribute("value", "" + position);
      input.setAttribute("style", (index != 0 && index != 1 ? "cursor:ew-resize;" : "") + "position:relative;left:" + left + "px");

      input.onchange = (event) -> {
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));

        if (index == 0 || index == 1) {
          this.del.setAttribute("disabled", "");
        } else {
          this.del.removeAttribute("disabled");
        }
        return null;
      };

      if (Z4Loader.touch) {
        input.ontouchstart = (event) -> this.manageEvent(event, true, false, index, input, event.changedTouches.$get(0).clientX);
        input.ontouchmove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches.$get(0).clientX);
        input.ontouchend = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
        input.ontouchcancel = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
      } else {
        input.onmousedown = (event) -> this.manageEvent(event, true, false, index, input, event.clientX);
        input.onmousemove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
        input.onmouseup = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
        input.onmouseleave = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
      }

      if (selected != -1 && index == selected) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        this.del.removeAttribute("disabled");
      } else if (selected == -1 && index == 0) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        this.del.setAttribute("disabled", "");
      }

      this.sliders.appendChild(input);
    });
  }

  private Object manageEvent(UIEvent event, boolean mouseDown, boolean check, int index, $HTMLElement input, double x) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.onchange.$apply(this.value);
    }

    this.mouseDown = mouseDown;
    if (check && this.mouseDown && index != 0 && index != 1) {
      this.moveColor(input, index, x);
    }

    return null;
  }

  private void moveColor($HTMLElement input, int idx, double x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    double width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);

    if (x < width) {
      double position = x / width;

      if (this.value.getComponents().every((color, index, array) -> index == idx || Math.abs(position - color.getPosition()) > 0.05)) {
        double oldPosition = parseFloat(input.value);
        double left = width * position - (idx * 16);

        input.setAttribute("value", "" + position);
        input.style.left = left + "px";

        this.value.move(oldPosition, position);
        this.drawCanvas();
        this.oninput.$apply(this.value);
      }
    }
  }

  private void drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);

    $OffscreenCanvas offscreen = new $OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).$getHEX();
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
