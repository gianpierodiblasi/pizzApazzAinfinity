/**
 * The component to edit a Z4Shape2DPainter
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainterUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".shape2d-painter-canvas");

   ctx = this.canvas.getContext("2d");

   width = new Z4FancifulValueUI().setValueLabel("WIDTH", true, true).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-first-row"));

   height = new Z4FancifulValueUI().setValueLabel("HEIGHT", true, true).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-first-row"));

   regularCheck = this.querySelector(".shape2d-painter-regular-check");

   shadowShiftX = new Z4FancifulValueUI().setValueLabel("DELTA_X", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));

   shadowShiftY = new Z4FancifulValueUI().setValueLabel("DELTA_Y", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));

   shadowColor = new Z4ColorUI().setColorLabel("COLOR", true, false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));

   borderWidth = new Z4FancifulValueUI().setValueLabel("WIDTH", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));

   borderHeight = new Z4FancifulValueUI().setValueLabel("HEIGHT", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));

   borderColor = new Z4ColorUI().setColorLabel("COLOR", true, false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));

   pointIterator = new Z4Stamper();

   resizeObserver = new ResizeObserver(() => this.drawCanvas());

   mutationObserver = new MutationObserver(() => this.drawCanvas());

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/painter/ui/Z4Shape2DPainterUI.html");

  /**
   * Creates a Z4Shape2DPainterUI
   */
  constructor() {
    super(Z4Shape2DPainterUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.resizeObserver.observe(this.canvas);
    let config = new Object();
    config["attributeFilter"] = new Array("class");
    this.mutationObserver.observe(document.body, config);
    let imgs = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu img[data-type='shape']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4Shape2DPainterUI.PATH + "z4shape2d_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu button[data-type='shape']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".shape2d-painter-shape-button img[data-type='shape']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
          case "circle":
            this.onchange(this.value.setShape2D(Z4Shape2D.CIRCLE));
            break;
          case "triangle":
            this.onchange(this.value.setShape2D(Z4Shape2D.TRIANGLE));
            break;
          case "square":
            this.onchange(this.value.setShape2D(Z4Shape2D.SQUARE));
            break;
          case "diamond":
            this.onchange(this.value.setShape2D(Z4Shape2D.DIAMOND));
            break;
          case "pentagon":
            this.onchange(this.value.setShape2D(Z4Shape2D.PENTAGON));
            break;
          case "hexagon":
            this.onchange(this.value.setShape2D(Z4Shape2D.HEXAGON));
            break;
          case "septagon":
            this.onchange(this.value.setShape2D(Z4Shape2D.SEPTAGON));
            break;
          case "heptagon":
            this.onchange(this.value.setShape2D(Z4Shape2D.HEPTAGON));
            break;
          case "star":
            this.onchange(this.value.setShape2D(Z4Shape2D.STAR));
            break;
        }
        this.drawCanvas();
        return null;
      };
    }
    this.regularCheck.id = this.getUniqueID();
    this.querySelector(".shape2d-painter-regular-label").setAttribute("for", this.regularCheck.id);
    this.regularCheck.onchange = (event) => {
      this.setSize(true);
      return null;
    };
    this.width.oninput = (v) => this.setSize(false);
    this.width.onchange = (v) => this.setSize(true);
    this.height.oninput = (v) => this.setSize(false);
    this.height.onchange = (v) => this.setSize(true);
    this.shadowShiftX.oninput = (v) => this.setShadow(false);
    this.shadowShiftX.onchange = (v) => this.setShadow(true);
    this.shadowShiftY.oninput = (v) => this.setShadow(false);
    this.shadowShiftY.onchange = (v) => this.setShadow(true);
    this.shadowColor.oninput = (v) => this.setShadow(false);
    this.shadowColor.onchange = (v) => this.setShadow(true);
    this.borderWidth.oninput = (v) => this.setBorder(false);
    this.borderWidth.onchange = (v) => this.setBorder(true);
    this.borderHeight.oninput = (v) => this.setBorder(false);
    this.borderHeight.onchange = (v) => this.setBorder(true);
    this.borderColor.oninput = (v) => this.setBorder(false);
    this.borderColor.onchange = (v) => this.setBorder(true);
    this.setValue(new Z4Shape2DPainter());
  }

   setSize(onChange) {
    if (onChange) {
      this.onchange(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
    } else {
      this.oninput(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
    }
    this.height.setEnabled(!this.regularCheck.checked);
    this.drawCanvas();
  }

   setShadow(onChange) {
    if (onChange) {
      this.onchange(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
    } else {
      this.oninput(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
    }
    this.drawCanvas();
  }

   setBorder(onChange) {
    if (onChange) {
      this.onchange(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
    } else {
      this.oninput(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
    }
    this.drawCanvas();
  }

  /**
   * Sets the Z4PointIterator to draw the demo
   *
   * @param pointIterator The Z4PointIterator
   * @return This Z4Shape2DPainterUI
   */
   setPointIterator(pointIterator) {
    this.pointIterator = pointIterator;
    return this;
  }

   setValue(value) {
    this.value = value;
    if (this.value.getShape() === Z4Shape2D.CIRCLE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='circle']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.TRIANGLE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='triangle']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.SQUARE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='square']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.DIAMOND) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='diamond']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.PENTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='pentagon']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.HEXAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='hexagon']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.SEPTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='septagon']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.HEPTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='heptagon']").getAttribute("src"));
    } else if (this.value.getShape() === Z4Shape2D.STAR) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='star']").getAttribute("src"));
    }
    this.regularCheck.checked = this.value.isRegular();
    this.width.setValue(this.value.getWidth());
    this.height.setValue(this.value.getHeight());
    this.height.setEnabled(!this.regularCheck.checked);
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColor.setValue(this.value.getShadowColor());
    this.borderWidth.setValue(this.value.getBorderWidth());
    this.borderHeight.setValue(this.value.getBorderHeight());
    this.borderColor.setValue(this.value.getBorderColor());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      let offscreen = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      let offscreenCtx = offscreen.getContext("2d");
      this.pointIterator.drawDemo(offscreenCtx, this.value, null, this.canvas.clientWidth, this.canvas.clientHeight);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
