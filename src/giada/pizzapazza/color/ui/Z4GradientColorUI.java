package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.HTMLElement;
import def.dom.UIEvent;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4AbstractColor;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Math;
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
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.window;
import simulation.js.$ResizeObserver;

/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
public class Z4GradientColorUI extends Z4AbstractComponentWithValueUI<Z4GradientColor> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
  private final $HTMLElement mirroredCheck = this.querySelector(".mirrored-check");
  private final $HTMLElement formRange = this.querySelector(".form-range");
  private final HTMLElement del = document.createElement("button");
  private final Z4ColorUI z4ColorUI = new Z4ColorUI();

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas(this.selectedIndex));
  private int selectedIndex;
  private double selectedPosition;
  private boolean mouseDown;
  private boolean dataChanged;

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  public Z4GradientColorUI() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() -> this.drawCanvas(this.selectedIndex));

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

    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) -> this.onMouseDown(event, event.changedTouches.$get(0).clientX - this.canvas.getBoundingClientRect().left, event.changedTouches.$get(0).clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchmove = (event) -> this.onMouseMove(event, event.changedTouches.$get(0).clientX - this.canvas.getBoundingClientRect().left, event.changedTouches.$get(0).clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchend = (event) -> this.onMouseUp(event);
      this.canvas.ontouchcancel = (event) -> this.onMouseUp(event);
    } else {
      this.canvas.onmousedown = (event) -> this.onMouseDown(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmousemove = (event) -> this.onMouseMove(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmouseup = (event) -> this.onMouseUp(event);
      this.canvas.onmouseleave = (event) -> this.onMouseUp(event);
    }

    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);

    this.mirroredCheck.onchange = (event) -> {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.drawCanvas(this.selectedIndex);
      this.onchange.$apply(this.value);
      return null;
    };

    this.formRange.oninput = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.oninput.$apply(this.value);
      return null;
    };
    this.formRange.onchange = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.onchange.$apply(this.value);
      return null;
    };

    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) -> {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());

      this.drawCanvas(this.selectedIndex);
      this.oninput.$apply(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) -> {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());

      this.drawCanvas(this.selectedIndex);
      this.onchange.$apply(this.value);
    };

    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) -> {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () -> {
        this.value.removeColor(this.selectedPosition);
        this.drawCanvas(0);
        this.onchange.$apply(this.value);
      }, () -> {
      }, null, null);

      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);

    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4GradientColor());
  }

  private Object onMouseMove(UIEvent event, double x, double y) {
    event.stopPropagation();

    if (this.mouseDown) {
      double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);

      if (x < width) {
        double position = x / width;

        if (this.value.getComponents().every((color, index, array) -> index == this.selectedIndex || Math.abs(position - color.getPosition()) > 0.05)) {
          this.dataChanged = true;
          this.value.move(this.selectedPosition, position);
          this.drawCanvas(this.selectedIndex);
          this.oninput.$apply(this.value);
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);

      if (x < width) {
        double position = x / width;

        if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((color, index, array) -> {
            if (index != 0 && index != 1 && Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
              this.canvas.style.cursor = "ew-resize";
            }
          });
        }
      }
    }

    return null;
  }

  private Object onMouseDown(UIEvent event, double x, double y) {
    event.stopPropagation();
    double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);

    if (x < width) {
      double position = x / width;

      if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.canvas.style.cursor = "ew-resize";
        this.drawCanvas(this.value.getComponents().length - 1);
        this.onchange.$apply(this.value);
      } else {
        this.value.getComponents().forEach((color, index, array) -> {
          if (Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
            this.mouseDown = true;
            this.drawCanvas(index);
          }
        });
      }
    }

    return null;
  }

  private Object onMouseUp(UIEvent event) {
    event.stopPropagation();
    if (this.dataChanged) {
      this.onchange.$apply(this.value);
    }
    this.mouseDown = false;
    this.dataChanged = false;
    return null;
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
    this.value = value;

    this.mirroredCheck.checked = this.value.isMirrored();
    this.formRange.valueAsNumber = this.value.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;

    this.drawCanvas(0);
    return (T) this;
  }

  private void drawCanvas(int selected) {
    this.selectedIndex = selected;
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      for (int x = 0; x < this.canvas.clientWidth; x++) {
        offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).$getHEX();
        offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
      }

      double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
      this.value.getComponents().forEach((z4StopColor, index, array) -> {
        double position = z4StopColor.getPosition();

        offscreenCtx.save();
        offscreenCtx.translate(position * width, this.canvas.clientHeight / 2);

        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
        offscreenCtx.fillStyle = Z4AbstractColor.$getFillStyle("white");
        offscreenCtx.strokeStyle = Z4AbstractColor.$getFillStyle("lightgray");
        offscreenCtx.fill();
        offscreenCtx.stroke();

        if (this.selectedIndex == index) {
          this.selectedPosition = position;
          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
          offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
          offscreenCtx.fillStyle = Z4AbstractColor.$getFillStyle("#0d6efd");
          offscreenCtx.fill();

          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
        }

        offscreenCtx.restore();
      });

      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.fillStyle = this.chessboard;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();

      if (this.selectedIndex == 0 || this.selectedIndex == 1) {
        this.del.setAttribute("disabled", "");
      } else {
        this.del.removeAttribute("disabled");
      }
    }
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
