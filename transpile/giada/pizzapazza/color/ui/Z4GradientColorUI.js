/**
 * The component to show a gradient color
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = this.ctx.createPattern(Z4ImageFactory.get("CHESSBOARD"), "repeat");

   sliders = this.querySelector(".sliders");

   formRangeLabel = this.querySelector(".form-range-label");

   mirroredCheck = this.querySelector(".mirrored-check");

   formRange = this.querySelector(".form-range");

   del = document.createElement("button");

   z4ColorUI = new Z4ColorUI();

   key = new Date().getTime() + "_" + parseInt(1000 * Math.random());

   devicePixelRatioListener = null;

   mouseDown = false;

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4GradientColorUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 50;

  /**
   * Creates a Z4GradientColorUI
   */
  constructor() {
    super(Z4GradientColorUI.UI);
    this.initDevicePixelRatio();
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
    // 
    // this.querySelector(".gradient-guided-tour").onclick = (event) -> {
    // Z4GradientColorGuidedTourUI.show();
    // return null;
    // };
    // 
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4GradientColorUI.WIDTH + "px";
    this.canvas.style.height = Z4GradientColorUI.HEIGHT + "px";
    this.sliders.onmousemove = (event) => {
      this.sliders.style.cursor = "default";
      let x = event.clientX - this.sliders.getBoundingClientRect().left - 8;
      let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
      if (x < width) {
        let position = x / width;
        if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
          this.sliders.style.cursor = "pointer";
        }
      }
      return null;
    };
    if (Z4Loader.touch) {
      this.sliders.ontouchstart = (event) => {
        this.addColor(event.changedTouches[0].clientX);
        return null;
      };
    } else {
      this.sliders.onmousedown = (event) => {
        this.addColor(event.clientX);
        return null;
      };
    }
    this.mirroredCheck.id = "mirrored_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".mirrored-label").setAttribute("for", this.mirroredCheck.id);
    this.mirroredCheck.onchange = (event) => {
      this.value.setMirrored(this.mirroredCheck.checked);
      this.configureSliders(-1);
      this.drawCanvas();
      this.onchange(this.value);
      return null;
    };
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
    this.z4ColorUI.appendTo(this.querySelector(".canvas-container"));
    this.z4ColorUI.oninput = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.oninput(this.value);
    };
    this.z4ColorUI.onchange = (z4Color) => {
      let input = this.querySelector(".sliders .form-check-input:checked");
      this.value.addOrUpdateColor(parseFloat(input.value), z4Color.getARGB());
      this.drawCanvas();
      this.onchange(this.value);
    };
    this.del.setAttribute("class", "dropdown-item delete-color");
    this.del.setAttribute("type", "button");
    this.del.setAttribute("data-token-lang-inner_text", "DELETE");
    this.del.innerText = Z4MessageFactory.get("DELETE");
    this.del.onclick = (event) => {
      Z4ModalMessageUI.showQuestion(Z4MessageFactory.get("TITLE"), Z4MessageFactory.get("DELETE_COLOR_MESSAGE"), () => {
        let input = this.querySelector(".sliders .form-check-input:checked");
        this.value.removeColor(parseFloat(input.value));
        this.configureSliders(-1);
        this.drawCanvas();
        this.onchange(this.value);
      }, () => {
      }, null, null);
      return null;
    };
    this.querySelector(".negative").parentElement.appendChild(document.createElement("li")).appendChild(this.del);
    this.setValue(new Z4GradientColor());
  }

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.drawCanvas();
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
    x -= this.sliders.getBoundingClientRect().left + 8;
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => Math.abs(position - color.getPosition()) > 0.05)) {
        this.value.generateColor(position);
        this.configureSliders(this.value.getComponents().length - 1);
        this.drawCanvas();
        this.onchange(this.value);
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
   setGradientColorLabel(token, bold, italic) {
    let gradientColorLabel = this.querySelector(".gradient-color-label");
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
   setColorLabel(token, bold, italic) {
    this.z4ColorUI.setColorLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
    super.setValue(value);
    this.mirroredCheck.checked = this.value.isMirrored();
    this.formRange.valueAsNumber = this.value.getRipple();
    this.formRangeLabel.innerText = this.formRange.value;
    this.configureSliders(-1);
    this.drawCanvas();
    return this;
  }

   configureSliders(selected) {
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    this.sliders.innerHTML = "";
    this.value.getComponents().forEach((z4StopColor, index, array) => {
      let position = z4StopColor.getPosition();
      let left = width * position - (index * 16);
      let input = document.createElement("input");
      input.setAttribute("class", "form-check-input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "colors_" + this.key);
      input.setAttribute("value", "" + position);
      input.setAttribute("style", (index !== 0 && index !== 1 ? "cursor:ew-resize;" : "") + "position:relative;left:" + left + "px");
      input.onchange = (event) => {
        this.z4ColorUI.setValue(Z4Color.fromARGB(z4StopColor.getARGB()));
        if (index === 0 || index === 1) {
          this.del.setAttribute("disabled", "");
        } else {
          this.del.removeAttribute("disabled");
        }
        return null;
      };
      if (Z4Loader.touch) {
        input.ontouchstart = (event) => this.manageEvent(event, true, false, index, input, event.changedTouches[0].clientX);
        input.ontouchmove = (event) => this.manageEvent(event, this.mouseDown, true, index, input, event.changedTouches[0].clientX);
        input.ontouchend = (event) => this.manageEvent(event, false, false, index, input, event.changedTouches[0].clientX);
        input.ontouchcancel = (event) => this.manageEvent(event, false, false, index, input, event.changedTouches[0].clientX);
      } else {
        input.onmousedown = (event) => this.manageEvent(event, true, false, index, input, event.clientX);
        input.onmousemove = (event) => this.manageEvent(event, this.mouseDown, true, index, input, event.clientX);
        input.onmouseup = (event) => this.manageEvent(event, false, false, index, input, event.clientX);
        input.onmouseleave = (event) => this.manageEvent(event, false, false, index, input, event.clientX);
      }
      if (selected !== -1 && index === selected) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromARGB(z4StopColor.getARGB()));
        this.del.removeAttribute("disabled");
      } else if (selected === -1 && index === 0) {
        input.setAttribute("checked", "");
        this.z4ColorUI.setValue(Z4Color.fromARGB(z4StopColor.getARGB()));
        this.del.setAttribute("disabled", "");
      }
      this.sliders.appendChild(input);
    });
  }

   manageEvent(event, mouseDown, check, index, input, x) {
    event.stopPropagation();
    if (this.mouseDown && !mouseDown) {
      this.onchange(this.value);
    }
    this.mouseDown = mouseDown;
    if (check && this.mouseDown && index !== 0 && index !== 1) {
      this.moveColor(input, index, x);
    }
    return null;
  }

   moveColor(input, idx, x) {
    x -= this.sliders.getBoundingClientRect().left + 8;
    let width = Z4GradientColorUI.WIDTH / (this.value.isMirrored() ? 2 : 1);
    if (x < width) {
      let position = x / width;
      if (this.value.getComponents().every((color, index, array) => index === idx || Math.abs(position - color.getPosition()) > 0.05)) {
        let oldPosition = parseFloat(input.value);
        let left = width * position - (idx * 16);
        input.setAttribute("value", "" + position);
        input.style.left = left + "px";
        this.value.move(oldPosition, position);
        this.drawCanvas();
        this.oninput(this.value);
      }
    }
  }

   drawCanvas() {
    this.canvas.width = Math.floor(Z4GradientColorUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4GradientColorUI.HEIGHT * window.devicePixelRatio);
    let offscreen = new OffscreenCanvas(Z4GradientColorUI.WIDTH, Z4GradientColorUI.HEIGHT);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < Z4GradientColorUI.WIDTH; x++) {
      offscreenCtx.fillStyle = this.value.getZ4ColorAt(x / Z4GradientColorUI.WIDTH, true, true).getHEX();
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
