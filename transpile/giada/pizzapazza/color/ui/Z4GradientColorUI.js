/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   formRangeLabel = this.querySelector(".form-range-label");

   mirroredCheck = this.querySelector(".mirrored-check");

   formRange = this.querySelector(".form-range");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.querySelector(".gradient-inverted").onclick = (event) => {
      this.setValue(this.value.inverted());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".gradient-negative").onclick = (event) => {
      this.setValue(this.value.negative());
      this.onchange(this.value);
      return null;
    };
    this.querySelector(".gradient-guided-tour").onclick = (event) => {
      Z4GradientColorGuidedTourUI.show();
      return null;
    };
    // 
    // this.sliders.onmousemove = (event) -> {
    // this.sliders.style.cursor = "default";
    // double x = event.clientX - this.sliders.getBoundingClientRect().left - 8;
    // double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
    // 
    // if (x < width) {
    // double position = x / width;
    // 
    // if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
    // this.sliders.style.cursor = "pointer";
    // }
    // }
    // 
    // return null;
    // };
    // 
    if (Z4Loader.touch) {
      // this.canvas.ontouchstart = (event) -> {
      // this.addColor(event.changedTouches.$get(0).clientX);
      // return null;
      // };
    } else {
      // this.canvas.onmousedown = (event) -> {
      // this.addColor(event.clientX);
      // return null;
      // };
    }
    // 
    // this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    // this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);
    // 
    // this.mirroredCheck.onchange = (event) -> {
    // this.value.setMirrored(this.mirroredCheck.checked);
    // this.configureSliders(-1);
    // this.drawCanvas();
    // this.onchange.$apply(this.value);
    // return null;
    // };
    // 
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas();
      this.onchange(this.value);
      return null;
    };
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      // $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      // this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      // 
      // this.drawCanvas();
      // this.oninput.$apply(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      // $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
      // this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      // 
      // this.drawCanvas();
      // this.onchange.$apply(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        // $HTMLElement input = this.querySelector(".sliders .form-check-input:checked");
        // this.value.removeColor(parseFloat(input.value));
        // this.drawCanvas();
        // this.onchange.$apply(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4GradientColor());
  }

  // private void addColor(double x) {
  // x -= this.sliders.getBoundingClientRect().left + 8;
  // double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
  // 
  // if (x < width) {
  // double position = x / width;
  // 
  // if (this.value.getComponents().every((color, index, array) -> Math.abs(position - color.getPosition()) > 0.05)) {
  // this.value.generateColor(position);
  // this.configureSliders(this.value.getComponents().length - 1);
  // this.drawCanvas();
  // this.onchange.$apply(this.value);
  // }
  // }
  // }
  /**
   * Sets the token of the gradient color label
   *
   * @param token The token of the gradient color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4GradientColorUI
   */
   setGradientColorLabel(token, bold, italic) {
    let gradientColorLabel = this.querySelector(".gradient-color-label");
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
   setColorLabel(token, bold, italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    this.value = value;
    this.mirroredCheck.checked = this.value.isMirrored();
    this.formRange.valueAsNumber = this.value.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;
    this.drawCanvas();
    return this;
  }

  // private void configureSliders(int selected) {
  // this.value.getComponents().forEach((z4StopColor, index, array) -> {
  // 
  // 
  // input.setAttribute("value", "" + position);
  // input.setAttribute("style", (index != 0 && index != 1 ? "cursor:ew-resize;" : "") + "position:absolute;left:" + (this.sliders.getBoundingClientRect().left + position * width) + "px");
  // input.onchange = (event) -> {
  // this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
  // 
  // if (index == 0 || index == 1) {
  // this.del.setAttribute("disabled", "");
  // } else {
  // this.del.removeAttribute("disabled");
  // }
  // return null;
  // };
  // 
  // if (Z4Loader.touch) {
  // input.ontouchstart = (event) -> this.manageEvent(event, true, false, index, input, event.changedTouches.$get(0).clientX);
  // input.ontouchmove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches.$get(0).clientX);
  // input.ontouchend = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
  // input.ontouchcancel = (event) -> this.manageEvent(event, false, false, index, input, event.changedTouches.$get(0).clientX);
  // } else {
  // input.onmousedown = (event) -> this.manageEvent(event, true, false, index, input, event.clientX);
  // input.onmousemove = (event) -> this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
  // input.onmouseup = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
  // input.onmouseleave = (event) -> this.manageEvent(event, false, false, index, input, event.clientX);
  // }
  // 
  // if (selected != -1 && index == selected) {
  // input.setAttribute("checked", "");
  // this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
  // this.del.removeAttribute("disabled");
  // } else if (selected == -1 && index == 0) {
  // input.setAttribute("checked", "");
  // this.z4ColorUI.setValue(Z4Color.fromZ4AbstractColor(z4StopColor));
  // this.del.setAttribute("disabled", "");
  // }
  // 
  // this.sliders.appendChild(input);
  // });
  // }
  // private Object manageEvent(UIEvent event, boolean mouseDown, boolean check, int index, $HTMLElement input, double x) {
  // event.stopPropagation();
  // if (this.mouseDown && !mouseDown) {
  // this.onchange.$apply(this.value);
  // }
  // 
  // this.mouseDown = mouseDown;
  // if (check && this.mouseDown && index != 0 && index != 1) {
  // this.moveColor(input, index, x);
  // }
  // 
  // return null;
  // }
  // private void moveColor($HTMLElement input, int idx, double x) {
  // x -= this.sliders.getBoundingClientRect().left + 8;
  // double width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
  // 
  // if (x < width) {
  // double position = x / width;
  // 
  // if (this.value.getComponents().every((color, index, array) -> index == idx || Math.abs(position - color.getPosition()) > 0.05)) {
  // double oldPosition = parseFloat(input.value);
  // double left = width * position - this.getShift(idx);
  // 
  // input.setAttribute("value", "" + position);
  // input.style.left = left + "px";
  // 
  // this.value.move(oldPosition, position);
  // this.drawCanvas();
  // this.oninput.$apply(this.value);
  // }
  // }
  // }
  // private int getShift(int index) {
  // switch (index) {
  // case 0:
  // case 1:
  // return index * 14;
  // default:
  // return index * (14 * index + 2);
  // }
  // }
   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      for (let x = 0; x < this.canvas.clientWidth; x++) {
        offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / this.canvas.clientWidth, true, true).getHEX();
        offscreenCtx.fillRect(x, 0, 1, this.canvas.clientHeight);
      }
      let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
      this.value.getComponents().forEach((z4StopColor, index, array) => {
        let position = z4StopColor.getPosition();
        offscreenCtx.save();
        offscreenCtx.translate(position * width, this.canvas.clientHeight / 2);
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
        offscreenCtx.strokeStyle = Z4AbstractColor.getFillStyle("lightgray");
        offscreenCtx.stroke();
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI);
        offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("white");
        offscreenCtx.fill();
        // offscreenCtx.fillStyle = Z4AbstractColor.$getFillStyle("#0d6efd");
        // offscreenCtx.fill();
        offscreenCtx.restore();
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
