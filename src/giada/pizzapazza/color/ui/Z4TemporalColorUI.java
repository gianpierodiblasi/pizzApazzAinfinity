package giada.pizzapazza.color.ui;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.Event;
import def.dom.HTMLElement;
import def.dom.UIEvent;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4AbstractColor;
import giada.pizzapazza.color.Z4AbstractGradientColor;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4TemporalColor;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4ImageFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import giada.pizzapazza.ui.Z4ModalMessageUI;
import java.util.function.Function;
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
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
public class Z4TemporalColorUI extends Z4AbstractComponentWithValueUI<Z4TemporalColor> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
  private final Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");
  private final $HTMLElement temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");
  private final $HTMLElement spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");
  private final $HTMLElement temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");
  private final $HTMLElement spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");
  private final $HTMLElement temporalFormRange = this.querySelector(".form-range-temporal");
  private final $HTMLElement spatialFormRange = this.querySelector(".form-range-spatial");
  private final HTMLElement del = document.createElement("button");
  private final Z4ColorUI z4ColorUI = new Z4ColorUI();

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));
  private int selectedIndexT;
  private int selectedIndexS;
  private double selectedPositionT;
  private double selectedPositionS;
  private boolean mouseDown;
  private boolean dataChanged;

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  /**
   * Creates a Z4TemporalColorUI
   */
  public Z4TemporalColorUI() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio(() -> this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));

    this.querySelector(".temporal-inverted").onclick = (event) -> this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) -> this.inverted(false, true);

    this.querySelector(".temporal-negative").onclick = (event) -> {
      this.setValue(this.value.negative());
      this.onchange.$apply(this.value);
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

    Function<Event, Object> mirror = (event) -> {
      this.value.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange.$apply(this.value);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;

    this.temporalMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".temporal-mirrored-label").setAttribute("for", this.temporalMirroredCheck.id);
    this.spatialMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".spatial-mirrored-label").setAttribute("for", this.spatialMirroredCheck.id);

    this.temporalFormRange.oninput = (event) -> this.setRipple(this.getStep());
    this.spatialFormRange.oninput = (event) -> this.setRipple(this.getStep());
    this.temporalFormRange.onchange = (event) -> this.setRipple(1);
    this.spatialFormRange.onchange = (event) -> this.setRipple(1);

    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) -> {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());

      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
      this.oninput.$apply(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) -> {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());

      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange.$apply(this.value);
    };

    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) -> {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () -> {
        this.value.removeColor(this.selectedPositionT, this.selectedIndexS);
        this.drawCanvas(0, 0, 1);
        this.onchange.$apply(this.value);
      }, () -> {
      }, null, null);

      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);

    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4TemporalColor());
  }

  private Object onMouseMove(UIEvent event, double x, double y) {
    event.stopPropagation();
    double width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    double height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    double gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;

    if (this.mouseDown) {
      if (x < width && gap < y && y < gap + height) {
        double positionT = x / width;
        double positionS = (height - y + gap) / height;

        boolean free = this.selectedIndexT != 0 && this.selectedIndexT != 1 && this.selectedIndexS != 0 && this.selectedIndexS != 1 && x < width && gap < y && y < gap + height;
        boolean temporal = this.selectedIndexT != 0 && this.selectedIndexT != 1 && x < width;
        boolean spatial = this.selectedIndexS != 0 && this.selectedIndexS != 1 && gap < y && y < gap + height;

        boolean okT = this.value.getComponents().every((color, indexT, array) -> indexT == this.selectedIndexT || Math.abs(positionT - color.getPosition()) > 0.05);
        boolean okS = this.value.getComponents().$get(0).getComponents().every((color, indexS, array) -> indexS == this.selectedIndexS || Math.abs(positionS - color.getPosition()) > 0.1);

        if (free) {
          if (okT && okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput.$apply(this.value);
          }
        } else if (temporal) {
          if (okT) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, -1, -1);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput.$apply(this.value);
          }
        } else if (spatial) {
          if (okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput.$apply(this.value);
          }
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      if (x < width && gap < y && y < gap + height) {
        double positionT = x / width;
        double positionS = (height - y + gap) / height;

        boolean okT = this.value.getComponents().every((color, index, array) -> Math.abs(positionT - color.getPosition()) > 0.05);
        boolean okS = this.value.getComponents().$get(0).getComponents().every((color, index, array) -> Math.abs(positionS - color.getPosition()) > 0.1);
        if (okT && okS) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) -> {
            z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) -> {
              if (Z4Math.distance(x, y, z4StopGradientColor.getPosition() * width, (1 - z4StopColor.getPosition()) * height + gap) >= 8) {
              } else if (indexT != 0 && indexT != 1 && indexS != 0 && indexS != 1) {
                this.canvas.style.cursor = "move";
              } else if (indexT != 0 && indexT != 1) {
                this.canvas.style.cursor = "ew-resize";
              } else if (indexS != 0 && indexS != 1) {
                this.canvas.style.cursor = "ns-resize";
              }
            });
          });
        }
      }
    }

    return null;
  }

  private Object onMouseDown(UIEvent event, double x, double y) {
    event.stopPropagation();
    double width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    double height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    double gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;

    if (x < width && gap < y && y < gap + height) {
      double positionT = x / width;
      double positionS = (height - y + gap) / height;

      boolean okT = this.value.getComponents().every((color, index, array) -> Math.abs(positionT - color.getPosition()) > 0.05);
      boolean okS = this.value.getComponents().$get(0).getComponents().every((color, index, array) -> Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.value.generateColor(positionT, positionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents().$get(0).getComponents().length - 1, 1);
        this.onchange.$apply(this.value);
      } else {
        this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) -> {
          z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) -> {
            if (Z4Math.distance(x, y, z4StopGradientColor.getPosition() * width, (1 - z4StopColor.getPosition()) * height + gap) < 8) {
              this.mouseDown = true;
              this.drawCanvas(indexT, indexS, 1);
            }
          });
        });
      }
    }

    return null;
  }

  private Object onMouseUp(UIEvent event) {
    event.stopPropagation();
    if (this.dataChanged) {
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange.$apply(this.value);
    }
    this.mouseDown = false;
    this.dataChanged = false;
    return null;
  }

  private Object setRipple(int step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.value.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(this.selectedIndexT, this.selectedIndexS, step);
    if (step == 1) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }

    return null;
  }

  private Object inverted(boolean temporal, boolean spatial) {
    this.setValue(this.value.inverted(temporal, spatial));
    this.onchange.$apply(this.value);

    return null;
  }

  /**
   * Sets the token of the temporal color label
   *
   * @param token The token of the temporal color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4TemporalColorUI
   */
  public Z4TemporalColorUI setTemporalColorLabel(String token, boolean bold, boolean italic) {
    $HTMLElement temporalColorLabel = this.querySelector(".temporal-color-label");
    temporalColorLabel.setAttribute("data-token-lang-inner_text", token);
    temporalColorLabel.innerHTML = Z4MessageFactory.get(token);
    temporalColorLabel.style.fontWeight = bold ? "700" : "400";
    temporalColorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4TemporalColorUI
   */
  public Z4TemporalColorUI setColorLabel(String token, boolean bold, boolean italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4TemporalColor value) {
    this.value = value;

    this.temporalMirroredCheck.checked = this.value.isTemporalyMirrored();
    this.spatialMirroredCheck.checked = this.value.isSpatialyMirrored();
    this.temporalFormRange.valueAsNumber = this.value.getTemporalRipple();
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRange.valueAsNumber = this.value.getSpatialRipple();
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;

    this.drawCanvas(0, 0, 1);
    return (T) this;
  }

  private int getStep() {
    return Math.max(2, parseInt(this.canvas.width / 100));
  }

  private void drawCanvas(int selectedIndexT, int selectedIndexS, int step) {
    this.selectedIndexT = selectedIndexT;
    this.selectedIndexS = selectedIndexS;
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      for (int x = 0; x < this.canvas.clientWidth; x += step) {
        Z4AbstractGradientColor<?> z4GradientColor = this.value.getZ4GradientColorAt(x / this.canvas.clientWidth, true, true);

        for (int y = 0; y < this.canvas.clientHeight; y += step) {
          offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / this.canvas.clientHeight, true, true).$getHEX();
          offscreenCtx.fillRect(x, this.canvas.clientHeight - y - step, step, step);
        }
      }

      double width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
      double height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
      double gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
      this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) -> {
        double positionT = z4StopGradientColor.getPosition();

        z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) -> {
          double positionS = z4StopColor.getPosition();

          offscreenCtx.save();
          offscreenCtx.translate(positionT * width, (1 - positionS) * height + gap);

          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
          offscreenCtx.fillStyle = Z4AbstractColor.$getFillStyle("white");
          offscreenCtx.strokeStyle = Z4AbstractColor.$getFillStyle("lightgray");
          offscreenCtx.fill();
          offscreenCtx.stroke();

          if (this.selectedIndexT == indexT && this.selectedIndexS == indexS) {
            this.selectedPositionT = positionT;
            this.selectedPositionS = positionS;

            offscreenCtx.beginPath();
            offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
            offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
            offscreenCtx.fillStyle = Z4AbstractColor.$getFillStyle("#0d6efd");
            offscreenCtx.fill();

            this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          }

          offscreenCtx.restore();
        });
      });

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
