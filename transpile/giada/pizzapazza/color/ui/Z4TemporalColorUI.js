/**
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");

   spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");

   temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");

   spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");

   temporalFormRange = this.querySelector(".form-range-temporal");

   spatialFormRange = this.querySelector(".form-range-spatial");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   resizeObserver = new ResizeObserver(() => this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));

   selectedIndexT = 0;

   selectedIndexS = 0;

   selectedPositionT = 0.0;

   selectedPositionS = 0.0;

   mouseDown = false;

   dataChanged = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  /**
   * Creates a Z4TemporalColorUI
   */
  constructor() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1));
    this.querySelector(".temporal-inverted").onclick = (event) => this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) => this.inverted(false, true);
    this.querySelector(".temporal-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => this.onMouseDown(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchmove = (event) => this.onMouseMove(event, event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchend = (event) => this.onMouseUp(event);
      this.canvas.ontouchcancel = (event) => this.onMouseUp(event);
    } else {
      this.canvas.onmousedown = (event) => this.onMouseDown(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmousemove = (event) => this.onMouseMove(event, event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmouseup = (event) => this.onMouseUp(event);
      this.canvas.onmouseleave = (event) => this.onMouseUp(event);
    }
    let mirror = (event) => {
      this.value.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".temporal-mirrored-label").setAttribute("for", this.temporalMirroredCheck.id);
    this.spatialMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".spatial-mirrored-label").setAttribute("for", this.spatialMirroredCheck.id);
    this.temporalFormRange.oninput = (event) => this.setRipple(this.getStep());
    this.spatialFormRange.oninput = (event) => this.setRipple(this.getStep());
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPositionT, this.selectedPositionS, z4Color.getARGB());
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showOpenQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE2"), Z4MessageFactory.get("DELETE_COLOR_BOTH"), () => {
        this.value.removeColor(this.selectedPositionT, this.selectedPositionS);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("DELETE_COLOR_TEMPORAL"), () => {
        this.value.removeColor(this.selectedPositionT, -1);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("DELETE_COLOR_SPATIAL"), () => {
        this.value.removeColor(-1, this.selectedPositionS);
        this.drawCanvas(0, 0, 1);
        this.onchange(this.value);
      }, Z4MessageFactory.get("CANCEL"), () => {
      });
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4TemporalColor());
  }

   onMouseMove(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
    if (this.mouseDown) {
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let free = this.selectedIndexT !== 0 && this.selectedIndexT !== 1 && this.selectedIndexS !== 0 && this.selectedIndexS !== 1 && x < width && gap < y && y < gap + height;
        let temporal = this.selectedIndexT !== 0 && this.selectedIndexT !== 1 && x < width;
        let spatial = this.selectedIndexS !== 0 && this.selectedIndexS !== 1 && gap < y && y < gap + height;
        let okT = this.value.getComponents().every((color, indexT, array) => indexT === this.selectedIndexT || Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, indexS, array) => indexS === this.selectedIndexS || Math.abs(positionS - color.getPosition()) > 0.1);
        if (free) {
          if (okT && okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        } else if (temporal) {
          if (okT) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, -1, -1);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        } else if (spatial) {
          if (okS) {
            this.dataChanged = true;
            this.value.move(this.selectedPositionT, positionT, this.selectedPositionS, positionS);
            this.drawCanvas(this.selectedIndexT, this.selectedIndexS, this.getStep());
            this.oninput(this.value);
          }
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
        if (okT || okS) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
            z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
              if (Z4Math.distance(x, y, z4StopGradientColor.getPosition() * width, (1 - z4StopColor.getPosition()) * height + gap) >= 8) {
              } else if (indexT !== 0 && indexT !== 1 && indexS !== 0 && indexS !== 1) {
                this.canvas.style.cursor = "move";
              } else if (indexT !== 0 && indexT !== 1) {
                this.canvas.style.cursor = "ew-resize";
              } else if (indexS !== 0 && indexS !== 1) {
                this.canvas.style.cursor = "ns-resize";
              }
            });
          });
        }
      }
    }
    return null;
  }

   onMouseDown(event, x, y) {
    event.stopPropagation();
    let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
    if (x < width && gap < y && y < gap + height) {
      let positionT = x / width;
      let positionS = (height - y + gap) / height;
      let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
      let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.value.generateColor(positionT, positionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else if (okT) {
        this.value.generateColor(positionT, this.selectedPositionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else if (okS) {
        this.value.generateColor(this.selectedPositionT, positionS);
        this.canvas.style.cursor = "move";
        this.drawCanvas(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1, 1);
        this.onchange(this.value);
      } else {
        this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
          z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
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

   onMouseUp(event) {
    event.stopPropagation();
    if (this.dataChanged) {
      this.drawCanvas(this.selectedIndexT, this.selectedIndexS, 1);
      this.onchange(this.value);
    }
    this.mouseDown = false;
    this.dataChanged = false;
    return null;
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.value.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(this.selectedIndexT, this.selectedIndexS, step);
    if (step === 1) {
      this.onchange(this.value);
    } else {
      this.oninput(this.value);
    }
    return null;
  }

   inverted(temporal, spatial) {
    this.setValue(this.value.inverted(temporal, spatial));
    this.onchange(this.value);
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
   setTemporalColorLabel(token, bold, italic) {
    let temporalColorLabel = this.querySelector(".temporal-color-label");
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
   setColorLabel(token, bold, italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    this.value = value;
    this.temporalMirroredCheck.checked = this.value.isTemporalyMirrored();
    this.spatialMirroredCheck.checked = this.value.isSpatialyMirrored();
    this.temporalFormRange.valueAsNumber = this.value.getTemporalRipple();
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRange.valueAsNumber = this.value.getSpatialRipple();
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.drawCanvas(0, 0, 1);
    return this;
  }

   getStep() {
    return Math.max(2, parseInt(this.canvas.width / 100));
  }

   drawCanvas(selectedIndexT, selectedIndexS, step) {
    this.selectedIndexT = selectedIndexT;
    this.selectedIndexS = selectedIndexS;
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      for (let x = 0; x < this.canvas.clientWidth; x += step) {
        let z4GradientColor = this.value.getZ4GradientColorAt(x / this.canvas.clientWidth, true, true);
        for (let y = 0; y < this.canvas.clientHeight; y += step) {
          offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / this.canvas.clientHeight, true, true).getHEX();
          offscreenCtx.fillRect(x, this.canvas.clientHeight - y - step, step, step);
        }
      }
      let width = this.canvas.clientWidth / (this.value.isTemporalyMirrored() ? 2 : 1);
      let height = this.canvas.clientHeight / (this.value.isSpatialyMirrored() ? 2 : 1);
      let gap = this.value.isSpatialyMirrored() ? this.canvas.clientHeight / 2 : 0;
      this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
        let positionT = z4StopGradientColor.getPosition();
        z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
          let positionS = z4StopColor.getPosition();
          offscreenCtx.save();
          offscreenCtx.translate(positionT * width, (1 - positionS) * height + gap);
          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
          offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("white");
          offscreenCtx.strokeStyle = Z4AbstractColor.getFillStyle("lightgray");
          offscreenCtx.fill();
          offscreenCtx.stroke();
          if (this.selectedIndexT === indexT && this.selectedIndexS === indexS) {
            this.selectedPositionT = positionT;
            this.selectedPositionS = positionS;
            offscreenCtx.beginPath();
            offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
            offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
            offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("#0d6efd");
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

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
