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

   resizeObserver = new ResizeObserver(() => this.drawCanvas(this.selectedIndex));

   selectedIndex = 0;

   selectedPosition = 0.0;

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas(this.selectedIndex));
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
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => this.onMouseDown(event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchmove = (event) => this.onMouseMove(event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.ontouchend = (event) => this.onMouseUp();
    } else {
      this.canvas.onmousedown = (event) => this.onMouseDown(event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmousemove = (event) => this.onMouseMove(event.clientX - this.canvas.getBoundingClientRect().left, event.clientY - this.canvas.getBoundingClientRect().top);
      this.canvas.onmouseup = (event) => this.onMouseUp();
    }
    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
      return null;
    };
    this.formRange.oninput = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.oninput(this.value);
      return null;
    };
    this.formRange.onchange = (event) => {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value.setRipple(this.formRange.valueAsNumber);
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
      return null;
    };
    this.z4ColorUI.appendToElement(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());
      this.drawCanvas(this.selectedIndex);
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      this.value.addOrUpdateColor(this.selectedPosition, z4Color.getARGB());
      this.drawCanvas(this.selectedIndex);
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerHTML = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        this.value.removeColor(this.selectedPosition);
        this.drawCanvas(0);
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.resizeObserver.observe(this.canvas);
    this.setValue(new Z4GradientColor());
  }

   onMouseMove(x, y) {
    if (this.mouseDown) {
      let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
          // //////////////
        }
      }
    } else {
      this.canvas.style.cursor = "default";
      let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
          this.canvas.style.cursor = "pointer";
        } else {
          this.value.getComponents().forEach((color, index, array) => {
            if (index !== 0 && index !== 1 && Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
              this.canvas.style.cursor = "ew-resize";
            }
          });
        }
      }
    }
    return null;
  }

  // private void configureSliders(int selected) {
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
   onMouseDown(x, y) {
    let width = this.canvas.clientWidth / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.drawCanvas(this.value.getComponents().length - 1);
        this.onchange(this.value);
      } else {
        this.value.getComponents().forEach((color, index, array) => {
          if (Z4Math.distance(x, y, color.getPosition() * width, this.canvas.clientHeight / 2) < 8) {
            this.mouseDown = true;
            this.drawCanvas(index);
          }
        });
      }
    }
    return null;
  }

   onMouseUp() {
    this.mouseDown = false;
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
    this.drawCanvas(0);
    return this;
  }

   drawCanvas(selected) {
    this.selectedIndex = selected;
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
        offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("white");
        offscreenCtx.strokeStyle = Z4AbstractColor.getFillStyle("lightgray");
        offscreenCtx.fill();
        offscreenCtx.stroke();
        if (this.selectedIndex === index) {
          this.selectedPosition = position;
          offscreenCtx.beginPath();
          offscreenCtx.arc(0, 0, 8, 0, Z4Math.TWO_PI, false);
          offscreenCtx.arc(0, 0, 4, 0, Z4Math.TWO_PI, true);
          offscreenCtx.fillStyle = Z4AbstractColor.getFillStyle("#0d6efd");
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
      if (this.selectedIndex === 0 || this.selectedIndex === 1) {
        this.del.setAttribute("disabled", "");
      } else {
        this.del.removeAttribute("disabled");
      }
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
  }
}
