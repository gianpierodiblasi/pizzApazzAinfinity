package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.Event;
import def.dom.HTMLElement;
import def.dom.UIEvent;
import def.js.Date;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4AbstractGradientColor;
import giada.pizzapazza.color.Z4TemporalColor;
import giada.pizzapazza.setting.Z4ImageFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import giada.pizzapazza.ui.Z4ModalMessageUI;
import java.util.function.Function;
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
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
public class Z4TemporalColorUI extends Z4ComponentUI<Z4TemporalColor> {

  private final $HTMLElement temporalColorLabel = this.querySelector(".temporal-color-label");
  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement sliders = this.querySelector(".sliders");
  private final $HTMLElement temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");
  private final $HTMLElement spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");
  private final $HTMLElement temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");
  private final $HTMLElement spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");
  private final $HTMLElement temporalFormRange = this.querySelector(".form-range-temporal");
  private final $HTMLElement spatialFormRange = this.querySelector(".form-range-spatial");
  private final HTMLElement del = document.createElement("button");
  private final Z4ColorUI z4ColorUI = new Z4ColorUI();

  private final String key = new Date().getTime() + "_" + parseInt(1000 * Math.random());
  private Z4TemporalColor temporalColor = new Z4TemporalColor();
  private $Apply_0_Void devicePixelRatioListener;
  private boolean mouseDown;

  private final static String UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");
  private final static int WIDTH = 500;
  private final static int HEIGHT = 200;

  /**
   * Creates a Z4TemporalColorUI
   */
  public Z4TemporalColorUI() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio();

    this.querySelector(".temporal-inverted").onclick = (event) -> this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) -> this.inverted(false, true);

    this.querySelector(".temporal-negative").onclick = (event) -> {
      this.setZ4TemporalColor(this.temporalColor.negative());
      this.onchange.$apply(this.temporalColor);
      return null;
    };

    this.querySelector(".temporal-guided-tour").onclick = (event) -> {
//      Z4GradientColorGuidedTourUI.show();
      return null;
    };

    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4TemporalColorUI.WIDTH + "px";
    this.canvas.style.height = Z4TemporalColorUI.HEIGHT + "px";

    this.canvas.onmousemove = (event) -> {
      this.canvas.style.cursor = "default";
      double width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
      double height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
      double gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;

      double x = event.clientX - this.canvas.getBoundingClientRect().left;
      double y = event.clientY - this.canvas.getBoundingClientRect().top;

      if (x < width && gap < y && y < gap + height) {
        double positionT = x / width;
        double positionS = (height - y + gap) / height;

        boolean okT = this.temporalColor.getComponents().every((color, index, array) -> Math.abs(positionT - color.getPosition()) > 0.05);
        boolean okS = this.temporalColor.getComponents().$get(0).getComponents().every((color, index, array) -> Math.abs(positionS - color.getPosition()) > 0.05);
        if (okT && okS) {
          this.canvas.style.cursor = "pointer";
        }
      }

      return null;
    };

    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) -> {
        this.addColor(event.changedTouches.$get(0).clientX, event.changedTouches.$get(0).clientY);
        return null;
      };
    } else {
      this.canvas.onmousedown = (event) -> {
        this.addColor(event.clientX, event.clientY);
        return null;
      };
    }

    Function<Event, Object> mirror = (event) -> {
      this.temporalColor.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.configureSliders(-1, -1);
      this.drawCanvas(1);
      this.onchange.$apply(this.temporalColor);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;

    this.temporalFormRange.oninput = (event) -> this.setRipple(5);
    this.spatialFormRange.oninput = (event) -> this.setRipple(5);
    this.temporalFormRange.onchange = (event) -> this.setRipple(1);
    this.spatialFormRange.onchange = (event) -> this.setRipple(1);

    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) -> {
      $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());

      this.drawCanvas(5);
      this.oninput.$apply(this.temporalColor);
    };
    this.z4ColorUI.onchange = (z4Color) -> {
      $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());

      this.drawCanvas(1);
      this.onchange.$apply(this.temporalColor);
    };

    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) -> {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () -> {
        $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
        this.temporalColor.removeColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")));

        this.configureSliders(-1, -1);
        this.drawCanvas(1);
        this.onchange.$apply(this.temporalColor);
      }, () -> {
      }, null, null);

      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);

    this.setZ4TemporalColor(this.temporalColor);
  }

  private void initDevicePixelRatio() {
    if ($exists(window.matchMedia)) {
      this.devicePixelRatioListener = () -> {
        this.drawCanvas(1);
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

  private void addColor(double x, double y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    double width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    double height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    double gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;

    if (x < width && gap < y && y < gap + height) {
      double positionT = x / width;
      double positionS = (height - y + gap) / height;

      boolean okT = this.temporalColor.getComponents().every((color, index, array) -> Math.abs(positionT - color.getPosition()) > 0.05);
      boolean okS = this.temporalColor.getComponents().$get(0).getComponents().every((color, index, array) -> Math.abs(positionS - color.getPosition()) > 0.05);
      if (okT && okS) {
        this.temporalColor.generateColor(positionT, positionS);
        this.configureSliders(this.temporalColor.getComponents().length - 1, this.temporalColor.getComponents().$get(0).getComponents().length - 1);
        this.drawCanvas(1);
        this.onchange.$apply(this.temporalColor);
      }
    }
  }

  private Object setRipple(int step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.temporalColor.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(step);
    if (step == 1) {
      this.onchange.$apply(this.temporalColor);
    } else {
      this.oninput.$apply(this.temporalColor);
    }

    return null;
  }

  private Object inverted(boolean temporal, boolean spatial) {
    this.setZ4TemporalColor(this.temporalColor.inverted(temporal, spatial));
    this.onchange.$apply(this.temporalColor);

    return null;
  }

  /**
   * Sets the token of the temporal color label
   *
   * @param token The token of the temporal color label
   * @return This Z4TemporalColorUI
   */
  public Z4TemporalColorUI setTemporalColorLabel(String token) {
    this.temporalColorLabel.setAttribute("data-token-lang", token);
    this.temporalColorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4TemporalColorUI
   */
  public Z4TemporalColorUI setColorLabel(String token) {
    this.z4ColorUI.setColorLabel(token);
    return this;
  }

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
    this.temporalMirroredCheck.checked = this.temporalColor.isTemporalyMirrored();
    this.spatialMirroredCheck.checked = this.temporalColor.isSpatialyMirrored();
    this.temporalFormRange.valueAsNumber = this.temporalColor.getTemporalRipple();
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRange.valueAsNumber = this.temporalColor.getSpatialRipple();
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;

    this.configureSliders(-1, -1);
    this.drawCanvas(1);

    return this;
  }

  private void configureSliders(int selectedT, int selectedS) {
    double width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    double height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    double gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;

    this.sliders.innerHTML = "";
    this.temporalColor.getComponents().forEach((z4StopGradientColor, indexT, arrayT) -> {
      double positionT = z4StopGradientColor.getPosition();
      double left = -8 + width * positionT;

      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) -> {
        double positionS = z4StopColor.getPosition();
        double top = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);

        $HTMLElement input = ($HTMLElement) document.createElement("input");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "colors_" + this.key);
        input.setAttribute("value", positionT + "-" + positionS);
        input.setAttribute("T", "" + positionT);
        input.setAttribute("S", "" + positionS);
        input.setAttribute("style", "margin-top:0px;position:relative;left:" + left + "px;top:" + top + "px");

        if (indexT != 0 && indexT != 1 && indexS != 0 && indexS != 1) {
          input.style.cursor = "move";
        } else if (indexT != 0 && indexT != 1) {
          input.style.cursor = "ew-resize";
        } else if (indexS != 0 && indexS != 1) {
          input.style.cursor = "ns-resize";
        }

        input.onchange = (event) -> {
          this.z4ColorUI.setZ4Color(z4StopColor);

          if ((indexT != 0 && indexT != 1) || (indexS != 0 && indexS != 1)) {
            this.del.removeAttribute("disabled");
          } else {
            this.del.setAttribute("disabled", "");
          }
          return null;
        };

        if (Z4Loader.touch) {
          input.ontouchstart = (event) -> this.manageEvent(event, true, false, indexT, indexS, input, event.changedTouches.$get(0).clientX, event.changedTouches.$get(0).clientY);
          input.ontouchmove = (event) -> this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.changedTouches.$get(0).clientX, event.changedTouches.$get(0).clientY);
          input.ontouchend = (event) -> this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches.$get(0).clientX, event.changedTouches.$get(0).clientY);
          input.ontouchcancel = (event) -> this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches.$get(0).clientX, event.changedTouches.$get(0).clientY);
        } else {
          input.onmousedown = (event) -> this.manageEvent(event, true, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmousemove = (event) -> this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseup = (event) -> this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseleave = (event) -> this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
        }

        if (selectedT != -1 && selectedS != -1 && indexT == selectedT && indexS == selectedS) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setZ4Color(z4StopColor);
          this.del.removeAttribute("disabled");
        } else if (selectedT == -1 && selectedS == -1 && indexT == 0 && indexS == 0) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setZ4Color(z4StopColor);
          this.del.setAttribute("disabled", "");
        }

        this.sliders.appendChild(input);
      });
    });
  }

  private Object manageEvent(UIEvent event, boolean mouseDown, boolean check, int indexT, int indexS, $HTMLElement input, double x, double y) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.drawCanvas(1);
      this.onchange.$apply(this.temporalColor);
    }

    this.mouseDown = mouseDown;
    if (check && this.mouseDown && ((indexT != 0 && indexT != 1) || (indexS != 0 && indexS != 1))) {
      this.moveColor(input, indexT, indexS, x, y);
    }

    return null;
  }

  private void moveColor($HTMLElement input, int idxT, int idxS, double x, double y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    double width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    double height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    double gap = this.temporalColor.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;

    boolean free = idxT != 0 && idxT != 1 && idxS != 0 && idxS != 1 && x < width && gap < y && y < gap + height;
    boolean temporal = idxT != 0 && idxT != 1 && x < width;
    boolean spatial = idxS != 0 && idxS != 1 && gap < y && y < gap + height;
    double positionT = x / width;
    double positionS = (height - y + gap) / height;

    boolean okT = this.temporalColor.getComponents().every((color, indexT, array) -> indexT == idxT || Math.abs(positionT - color.getPosition()) > 0.05);
    boolean okS = this.temporalColor.getComponents().$get(0).getComponents().every((color, indexS, array) -> indexS == idxS || Math.abs(positionS - color.getPosition()) > 0.05);

    double oldPositionT = parseFloat(input.getAttribute("T"));
    double oldPositionS = parseFloat(input.getAttribute("S"));
    double left = -8 + width * positionT;
    double top = gap - 8 + height * (1 - positionS) - ((idxS + this.temporalColor.getComponents().$get(0).getComponents().length * idxT) * 16);

    if (free && okT && okS) {
      this.move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height);

      this.temporalColor.move(oldPositionT, positionT, oldPositionS, positionS);
      this.drawCanvas(5);
      this.oninput.$apply(this.temporalColor);
    } else if (temporal && okT) {
      this.move(input, oldPositionT, oldPositionS, positionT, oldPositionS, left, parseFloat(input.style.top.replace("px", "")), gap, height);

      this.temporalColor.move(oldPositionT, positionT, -1, -1);
      this.drawCanvas(5);
      this.oninput.$apply(this.temporalColor);
    } else if (spatial && okS) {
      this.move(input, oldPositionT, oldPositionS, oldPositionT, positionS, parseFloat(input.style.left.replace("px", "")), top, gap, height);

      this.temporalColor.move(oldPositionT, positionT, oldPositionS, positionS);
      this.drawCanvas(5);
      this.oninput.$apply(this.temporalColor);
    }
  }

  private void move(HTMLElement input, double oldPositionT, double oldPositionS, double positionT, double positionS, double left, double top, double gap, double height) {
    this.temporalColor.getComponents().forEach((z4StopGradientColor, indexT, arrayT) -> {
      double brotherPositionT = z4StopGradientColor.getPosition();

      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) -> {
        double brotherPositionS = z4StopColor.getPosition();
        if (brotherPositionT == oldPositionT || brotherPositionS == oldPositionS) {
          HTMLElement brother = this.querySelector(".sliders input[value='" + brotherPositionT + "-" + brotherPositionS + "']");

          if (brotherPositionT != 0 && brotherPositionT != 1 && brotherPositionT == oldPositionT) {
            brother.setAttribute("value", positionT + "-" + brotherPositionS);
            brother.setAttribute("T", "" + positionT);
            brother.style.left = left + "px";
          }

          if (brotherPositionS != 0 && brotherPositionS != 1 && brotherPositionS == oldPositionS) {
            double brotherTop = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);

            brother.setAttribute("value", brotherPositionT + "-" + positionS);
            brother.setAttribute("S", "" + positionS);
            brother.style.top = brotherTop + "px";
          }
        }
      });
    });

    input.setAttribute("value", positionT + "-" + positionS);
    input.setAttribute("T", "" + positionT);
    input.setAttribute("S", "" + positionS);
    input.style.left = left + "px";
    input.style.top = top + "px";
  }

  private void drawCanvas(int step) {
    this.canvas.width = Math.floor(Z4TemporalColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4TemporalColorUI.HEIGHT * window.devicePixelRatio);

    $OffscreenCanvas offscreen = new $OffscreenCanvas(Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < Z4TemporalColorUI.WIDTH; x += step) {
      Z4AbstractGradientColor<?> z4GradientColor = this.temporalColor.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);

      for (int y = 0; y < Z4TemporalColorUI.HEIGHT; y += step) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / Z4TemporalColorUI.HEIGHT, true, true).$getHEX();
        offscreenCtx.fillRect(x, Z4TemporalColorUI.HEIGHT - y - step, step, step);
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
