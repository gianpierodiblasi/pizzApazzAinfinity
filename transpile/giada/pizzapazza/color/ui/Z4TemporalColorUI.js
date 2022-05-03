/**
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   sliders = this.querySelector(".sliders");

   temporalFormRangeLabel = this.querySelector(".temporal-form-range-label");

   spatialFormRangeLabel = this.querySelector(".spatial-form-range-label");

   temporalMirroredCheck = this.querySelector(".temporal-mirrored-check");

   spatialMirroredCheck = this.querySelector(".spatial-mirrored-check");

   temporalFormRange = this.querySelector(".form-range-temporal");

   spatialFormRange = this.querySelector(".form-range-spatial");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   key = new Date().getTime() + "_" + parseInt(1000 * Math.random());

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 200;

  /**
   * Creates a Z4TemporalColorUI
   */
  constructor() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas(1));
    this.querySelector(".temporal-inverted").onclick = (event) => this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) => this.inverted(false, true);
    this.querySelector(".temporal-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".temporal-guided-tour").onclick = (event) => {
      Z4TemporalColorGuidedTourUI.show();
      return null;
    };
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4TemporalColorUI.WIDTH + "px";
    this.canvas.style.height = Z4TemporalColorUI.HEIGHT + "px";
    this.canvas.onmousemove = (event) => {
      this.canvas.style.cursor = "default";
      let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
      let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
      let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
      let x = event.clientX - this.canvas.getBoundingClientRect().left;
      let y = event.clientY - this.canvas.getBoundingClientRect().top;
      if (x < width && gap < y && y < gap + height) {
        let positionT = x / width;
        let positionS = (height - y + gap) / height;
        let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
        let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
        if (okT && okS) {
          this.canvas.style.cursor = "pointer";
        }
      }
      return null;
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => {
        this.addColor(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        return null;
      };
    } else {
      this.canvas.onmousedown = (event) => {
        this.addColor(event.clientX, event.clientY);
        return null;
      };
    }
    let mirror = (event) => {
      this.value.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.configureSliders(-1, -1);
      this.drawCanvas(1);
      this.onchange(this.value);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".temporal-mirrored-label").setAttribute("for", this.temporalMirroredCheck.id);
    this.spatialMirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".spatial-mirrored-label").setAttribute("for", this.spatialMirroredCheck.id);
    this.temporalFormRange.oninput = (event) => this.setRipple(5);
    this.spatialFormRange.oninput = (event) => this.setRipple(5);
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(5);
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(1);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.value.removeColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")));
        this.configureSliders(-1, -1);
        this.drawCanvas(1);
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setValue(new Z4TemporalColor());
  }

   addColor(x, y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    if (x < width && gap < y && y < gap + height) {
      let positionT = x / width;
      let positionS = (height - y + gap) / height;
      let okT = this.value.getComponents().every((color, index, array) => Math.abs(positionT - color.getPosition()) > 0.05);
      let okS = this.value.getComponents()[0].getComponents().every((color, index, array) => Math.abs(positionS - color.getPosition()) > 0.1);
      if (okT && okS) {
        this.value.generateColor(positionT, positionS);
        this.configureSliders(this.value.getComponents().length - 1, this.value.getComponents()[0].getComponents().length - 1);
        this.drawCanvas(1);
        this.onchange(this.value);
      }
    }
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.value.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(step);
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
    this.configureSliders(-1, -1);
    this.drawCanvas(1);
    return this;
  }

   configureSliders(selectedT, selectedS) {
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    this.sliders.innerHTML = "";
    this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
      let positionT = z4StopGradientColor.getPosition();
      let left = -8 + width * positionT;
      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
        let positionS = z4StopColor.getPosition();
        let top = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);
        let input = document.createElement("input");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "colors_" + this.key);
        input.setAttribute("value", positionT + "-" + positionS);
        input.setAttribute("T", "" + positionT);
        input.setAttribute("S", "" + positionS);
        input.setAttribute("style", "margin-top:0px;position:relative;left:" + left + "px;top:" + top + "px");
        if (indexT !== 0 && indexT !== 1 && indexS !== 0 && indexS !== 1) {
          input.style.cursor = "move";
        } else if (indexT !== 0 && indexT !== 1) {
          input.style.cursor = "ew-resize";
        } else if (indexS !== 0 && indexS !== 1) {
          input.style.cursor = "ns-resize";
        }
        input.onchange = (event) => {
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          if ((indexT !== 0 && indexT !== 1) || (indexS !== 0 && indexS !== 1)) {
            this.del.removeAttribute("disabled");
          } else {
            this.del.setAttribute("disabled", "");
          }
          return null;
        };
        if (Z4Loader.touch) {
          input.ontouchstart = (event) => this.manageEvent(event, true, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchmove = (event) => this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchend = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
          input.ontouchcancel = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        } else {
          input.onmousedown = (event) => this.manageEvent(event, true, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmousemove = (event) => this.manageEvent(event, this.mouseDown, true, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseup = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
          input.onmouseleave = (event) => this.manageEvent(event, false, false, indexT, indexS, input, event.clientX, event.clientY);
        }
        if (selectedT !== -1 && selectedS !== -1 && indexT === selectedT && indexS === selectedS) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          this.del.removeAttribute("disabled");
        } else if (selectedT === -1 && selectedS === -1 && indexT === 0 && indexS === 0) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
          this.del.setAttribute("disabled", "");
        }
        this.sliders.appendChild(input);
      });
    });
  }

   manageEvent(event, mouseDown, check, indexT, indexS, input, x, y) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.drawCanvas(1);
      this.onchange(this.value);
    }
    this.mouseDown = mouseDown;
    if (check && this.mouseDown && ((indexT !== 0 && indexT !== 1) || (indexS !== 0 && indexS !== 1))) {
      this.moveColor(input, indexT, indexS, x, y);
    }
    return null;
  }

   moveColor(input, idxT, idxS, x, y) {
    x -= this.canvas.getBoundingClientRect().left;
    y -= this.canvas.getBoundingClientRect().top;
    let width = Z4TemporalColorUI.WIDTH / (this.value.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.value.isSpatialyMirrored() ? 2 : 1);
    let gap = this.value.isSpatialyMirrored() ? Z4TemporalColorUI.HEIGHT / 2 : 0;
    let free = idxT !== 0 && idxT !== 1 && idxS !== 0 && idxS !== 1 && x < width && gap < y && y < gap + height;
    let temporal = idxT !== 0 && idxT !== 1 && x < width;
    let spatial = idxS !== 0 && idxS !== 1 && gap < y && y < gap + height;
    let positionT = x / width;
    let positionS = (height - y + gap) / height;
    let okT = this.value.getComponents().every((color, indexT, array) => indexT === idxT || Math.abs(positionT - color.getPosition()) > 0.05);
    let okS = this.value.getComponents()[0].getComponents().every((color, indexS, array) => indexS === idxS || Math.abs(positionS - color.getPosition()) > 0.1);
    let oldPositionT = parseFloat(input.getAttribute("T"));
    let oldPositionS = parseFloat(input.getAttribute("S"));
    let left = -8 + width * positionT;
    let top = gap - 8 + height * (1 - positionS) - ((idxS + this.value.getComponents()[0].getComponents().length * idxT) * 16);
    if (free) {
      if (okT && okS) {
        this.move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height);
        this.value.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    } else if (temporal) {
      if (okT) {
        this.move(input, oldPositionT, oldPositionS, positionT, oldPositionS, left, parseFloat(input.style.top.replace("px", "")), gap, height);
        this.value.move(oldPositionT, positionT, -1, -1);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    } else if (spatial) {
      if (okS) {
        this.move(input, oldPositionT, oldPositionS, oldPositionT, positionS, parseFloat(input.style.left.replace("px", "")), top, gap, height);
        this.value.move(oldPositionT, positionT, oldPositionS, positionS);
        this.drawCanvas(5);
        this.oninput(this.value);
      }
    }
  }

   move(input, oldPositionT, oldPositionS, positionT, positionS, left, top, gap, height) {
    this.value.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
      let brotherPositionT = z4StopGradientColor.getPosition();
      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
        let brotherPositionS = z4StopColor.getPosition();
        if (brotherPositionT === oldPositionT || brotherPositionS === oldPositionS) {
          let brother = this.querySelector(".sliders input[value='" + brotherPositionT + "-" + brotherPositionS + "']");
          if (brotherPositionT !== 0 && brotherPositionT !== 1 && brotherPositionT === oldPositionT) {
            brother.setAttribute("value", positionT + "-" + brotherPositionS);
            brother.setAttribute("T", "" + positionT);
            brother.style.left = left + "px";
          }
          if (brotherPositionS !== 0 && brotherPositionS !== 1 && brotherPositionS === oldPositionS) {
            let brotherTop = gap - 8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);
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

   drawCanvas(step) {
    this.canvas.width = Math.floor(Z4TemporalColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4TemporalColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4TemporalColorUI.WIDTH; x += step) {
      let z4GradientColor = this.value.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);
      for (let y = 0; y < Z4TemporalColorUI.HEIGHT; y += step) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / Z4TemporalColorUI.HEIGHT, true, true).getHEX();
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
