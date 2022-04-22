/* global Date, Math, Object, OffscreenCanvas, Z4ColorUI, Z4ComponentUI, Z4ImageFactory, Z4MessageFactory, Z4ModalMessageUI, Z4TemporalColor, parseFloat, parseInt */

/**
 * The component to show a temporal color
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorUI extends Z4ComponentUI {

   temporalColorLabel = this.querySelector(".temporal-color-label");

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

   temporalColor = new Z4TemporalColor();

   devicePixelRatioListener = null;

  // private boolean mouseDown;
  // 
  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4TemporalColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 200;

  /**
   * Creates a Z4TemporalColorUI
   */
  constructor() {
    super(Z4TemporalColorUI.UI);
    this.initDevicePixelRatio();
    this.querySelector(".temporal-inverted").onclick = (event) => this.inverted(true, false);
    this.querySelector(".spatial-inverted").onclick = (event) => this.inverted(false, true);
    this.querySelector(".temporal-negative").onclick = (event) => {
      this.setZ4TemporalColor(this.temporalColor.negative());
      this.onchange(this.temporalColor);
      return null;
    };
    // this.querySelector(".gradient-guided-tour").onclick = (event) -> {
    // Z4GradientColorGuidedTourUI.show();
    // return null;
    // };
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4TemporalColorUI.WIDTH + "px";
    this.canvas.style.height = Z4TemporalColorUI.HEIGHT + "px";
    // this.slidersTemporal.onmousemove = (event) -> {
    // double x = event.clientX - this.slidersTemporal.getBoundingClientRect().left;
    // double width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isMirrored() ? 2 : 1);
    // this.sliders.style.cursor = x < width ? "pointer" : "default";
    // return null;
    // };
    if (Z4Loader.touch) {
      // this.sliders.ontouchstart = (event) -> {
      // this.addColor(event.changedTouches.$get(0).clientX);
      // return null;
      // };
    } else {
      // this.sliders.onmousedown = (event) -> {
      // this.addColor(event.clientX);
      // return null;
      // };
    }
    let mirror = (event) => {
      this.temporalColor.setMirrored(this.temporalMirroredCheck.checked, this.spatialMirroredCheck.checked);
      this.configureSliders(-1, -1);
      this.drawCanvas(1);
      this.onchange(this.temporalColor);
      return null;
    };
    this.temporalMirroredCheck.onchange = mirror;
    this.spatialMirroredCheck.onchange = mirror;
    this.temporalFormRange.oninput = (event) => this.setRipple(5);
    this.spatialFormRange.oninput = (event) => this.setRipple(5);
    this.temporalFormRange.onchange = (event) => this.setRipple(1);
    this.spatialFormRange.onchange = (event) => this.setRipple(1);
    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(5);
      this.oninput(this.temporalColor);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.temporalColor.addOrUpdateColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")), z4Color.getARGB());
      this.drawCanvas(1);
      this.onchange(this.temporalColor);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.temporalColor.removeColor(parseFloat(input.getAttribute("T")), parseFloat(input.getAttribute("S")));
        this.configureSliders(-1, -1);
        this.drawCanvas(1);
        this.onchange(this.temporalColor);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setZ4TemporalColor(this.temporalColor);
  }

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.drawCanvas(1);
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

   addDevicePixelRatioListener() {
    let options = new Object();
    options["once"] = true;
    window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

   addColor(x) {
    // x -= this.sliders.getBoundingClientRect().left + 8;
    // double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    // if (x < width) {
    // double position = x / width;
    // 
    // if (this.gradientColor.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
    // this.gradientColor.generateColor(position);
    // this.configureSliders(this.gradientColor.getComponents().length - 1);
    // this.drawCanvas();
    // this.onchange.$apply(this.gradientColor);
    // }
    // }
  }

   setRipple(step) {
    this.temporalFormRangeLabel.innerText = this.temporalFormRange.value;
    this.spatialFormRangeLabel.innerText = this.spatialFormRange.value;
    this.temporalColor.setRipple(this.temporalFormRange.valueAsNumber, this.spatialFormRange.valueAsNumber);
    this.drawCanvas(step);
    if (step === 1) {
      this.onchange(this.temporalColor);
    } else {
      this.oninput(this.temporalColor);
    }
    return null;
  }

   inverted(temporal, spatial) {
    this.setZ4TemporalColor(this.temporalColor.inverted(temporal, spatial));
    this.onchange(this.temporalColor);
    return null;
  }

  /**
   * Sets the token of the temporal color label
   *
   * @param token The token of the temporal color label
   * @return This Z4TemporalColorUI
   */
   setTemporalColorLabel(token) {
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
   setColorLabel(token) {
    this.z4ColorUI.setColorLabel(token);
    return this;
  }

  /**
   * Returns the Z4TemporalColor
   *
   * @return The Z4TemporalColor
   */
   getZ4TemporalColor() {
    return this.temporalColor;
  }

  /**
   * Sets the Z4TemporalColor
   *
   * @param color The Z4TemporalColor
   * @return This Z4TemporalColorUI
   */
   setZ4TemporalColor(color) {
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

   configureSliders(selectedT, selectedS) {
    let width = Z4TemporalColorUI.WIDTH / (this.temporalColor.isTemporalyMirrored() ? 2 : 1);
    let height = Z4TemporalColorUI.HEIGHT / (this.temporalColor.isSpatialyMirrored() ? 2 : 1);
    this.sliders.innerHTML = "";
    this.temporalColor.getComponents().forEach((z4StopGradientColor, indexT, arrayT) => {
      let positionT = z4StopGradientColor.getPosition();
      let left = -8 + width * positionT;
      z4StopGradientColor.getComponents().forEach((z4StopColor, indexS, arrayS) => {
        let positionS = z4StopColor.getPosition();
        let top = -8 + height * (1 - positionS) - ((indexS + arrayS.length * indexT) * 16);
        let input = document.createElement("input");
        input.setAttribute("class", "form-check-input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "colors_" + this.key);
        input.setAttribute("value", positionT + "-" + positionS);
        input.setAttribute("T", "" + positionT);
        input.setAttribute("S", "" + positionS);
        input.setAttribute("style", ((indexT !== 0 && indexT !== 1) || (indexS !== 0 && indexS !== 1) ? "cursor:ew-resize;" : "") + "margin-top:0px;position:relative;left:" + left + "px;top:" + top + "px");
        input.onchange = (event) => {
          this.z4ColorUI.setZ4Color(z4StopColor);
          // 
          // if (index == 0 || index == 1) {
          // this.del.setAttribute("disabled", "");
          // } else {
          // this.del.removeAttribute("disabled");
          // }
          return null;
        };
        // 
        if (Z4Loader.touch) {
          // input.ontouchstart = (event) -> this.manageEvent(event, true, false, index, input, event.changedTouches.$get(0).clientX);
          // input.ontouchmove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches.$get(0).clientX);
          // input.ontouchend = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
          // input.ontouchcancel = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
        } else {
          // input.onmousedown = (event) -> this.manageEvent(event, true, false, index, input, event.clientX);
          // input.onmousemove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
          // input.onmouseup = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
          // input.onmouseleave = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
        }
        if (selectedT !== -1 && selectedS !== -1 && indexT === selectedT && indexS === selectedS) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setZ4Color(z4StopColor);
          this.del.removeAttribute("disabled");
        } else if (selectedT === -1 && selectedS === -1 && indexT === 0 && indexS === 0) {
          input.setAttribute("checked", "");
          this.z4ColorUI.setZ4Color(z4StopColor);
          this.del.setAttribute("disabled", "");
        }
        this.sliders.appendChild(input);
      });
    });
  }

   manageEvent(event, mouseDown, check, index, input, x) {
    // event.stopPropagation();
    // this.mouseDown = mouseDown;
    // if (check && this.mouseDown && index != 0 && index != 1) {
    // this.moveColor(input, index, x);
    // }
    // 
    return null;
  }

   moveColor(input, idx, x) {
    // x -= this.sliders.getBoundingClientRect().left + 8;
    // double width = Z4TemporalColorUI.WIDTH / (this.gradientColor.isMirrored() ? 2 : 1);
    // 
    // if (x < width) {
    // double position = x / width;
    // double left = width * position - (idx * 16);
    // if (this.gradientColor.getComponents().every((color, index, array) -> index == idx || Math.abs(position - color.getPosition()) > 0.05)) {
    // double oldPosition = parseFloat(input.value);
    // 
    // input.setAttribute("value", "" + position);
    // input.setAttribute("style", "cursor:ew-resize;position:relative;left:" + left + "px");
    // this.gradientColor.move(oldPosition, position);
    // this.drawCanvas();
    // this.onchange.$apply(this.gradientColor);
    // }
    // }
  }

   drawCanvas(step) {
    this.canvas.width = Math.floor(Z4TemporalColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4TemporalColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4TemporalColorUI.WIDTH, Z4TemporalColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4TemporalColorUI.WIDTH; x += step) {
      let z4GradientColor = this.temporalColor.getZ4GradientColorAt(x / Z4TemporalColorUI.WIDTH, true, true);
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
