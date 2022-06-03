/**
 * The component to edit a Z4Shape2DPainter
 *
 * @author gianpiero.di.blasi
 */
class Z4Shape2DPainterUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".shape2d-painter-canvas");

   ctx = this.canvas.getContext("2d");

  // 
  // private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".shape2d-painter-container"));
  // private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".shape2d-painter-container"));
  // 
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
    // this.rotation.oninput = (v) -> {
    // this.oninput.$apply(this.value.setRotation(v));
    // this.drawCanvas();
    // };
    // this.rotation.onchange = (v) -> {
    // this.onchange.$apply(this.value.setRotation(v));
    // this.drawCanvas();
    // };
    // 
    // this.progression.oninput = (v) -> {
    // this.oninput.$apply(this.value.setProgression(v));
    // this.drawCanvas();
    // };
    // this.progression.onchange = (v) -> {
    // this.onchange.$apply(this.value.setProgression(v));
    // this.drawCanvas();
    // };
    // 
    this.setValue(new Z4Shape2DPainter());
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
    // this.rotation.setValue(this.value.getRotation());
    // this.progression.setValue(this.value.getProgression());
    this.drawCanvas();
    return this;
  }

   drawCanvas() {
    if (this.canvas.clientWidth) {
      // this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      // this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      // 
      // $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      // $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      // this.value.drawDemo(offscreenCtx, this.canvas.clientWidth, this.canvas.clientHeight);
      // 
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // 
      // this.ctx.save();
      // this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      // this.ctx.drawImage(offscreen, 0, 0);
      // this.ctx.restore();
    }
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
