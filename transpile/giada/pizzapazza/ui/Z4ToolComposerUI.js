/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
class Z4ToolComposerUI extends Z4AbstractComponentUI {

   stamperUI = new Z4StamperUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   tracerUI = new Z4TracerUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   airbrushUI = new Z4AirbrushUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   spirographUI = new Z4SpirographUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   shape2DPainterUI = new Z4Shape2DPainterUI().appendToElement(this.querySelector(".tool-composer-container-painter"));

   gradientColorUI = new Z4GradientColorUI().setGradientColorLabel("COLOR", true, true).setVertical().appendToElement(this.querySelector(".tool-composer-container-gradient-color"));

   canvas = this.querySelector(".tool-composer-canvas-try-me");

   canvasCtx = this.canvas.getContext("2d");

   resizeObserver = new ResizeObserver(() => this.createOffscreen());

   canvasRect = null;

   offscreenCanvas = null;

   offscreenCtx = null;

   offscreenCreated = false;

   background = "white";

   mouseDown = false;

   pointIterator = null;

   painter = null;

   gradientColor = null;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  constructor() {
    super(Z4ToolComposerUI.UI);
    this.initDevicePixelRatio(() => this.createOffscreen());
    this.resizeObserver.observe(this.canvas);
    this.configTabs();
    this.configPointIterators();
    this.configPointPainters();
    this.configTryMe();
    this.pointIterator = this.stamperUI.getValue();
    this.painter = this.shape2DPainterUI.getValue();
    this.gradientColor = this.gradientColorUI.getValue();
    this.setPointIteratorUI(this.stamperUI);
    this.setPointIteratorUI(this.tracerUI);
    this.setPointIteratorUI(this.airbrushUI);
    this.setPointIteratorUI(this.spirographUI);
    this.setPainterUI(this.shape2DPainterUI);
    this.gradientColorUI.oninput = (v) => {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.airbrushUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);
      this.shape2DPainterUI.setGradientColor(v);
    };
    this.gradientColorUI.onchange = (v) => {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.airbrushUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);
      this.shape2DPainterUI.setGradientColor(v);
    };
    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) => this.manageStart(event);
      this.canvas.ontouchmove = (event) => this.manageContinue(event);
      this.canvas.ontouchend = (event) => this.manageStop(event);
    } else {
      this.canvas.onmousedown = (event) => this.manageStart(event);
      this.canvas.onmousemove = (event) => this.manageContinue(event);
      this.canvas.onmouseup = (event) => this.manageStop(event);
      this.canvas.onmouseleave = (event) => this.manageStop(event);
    }
  }

   configTabs() {
    let imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (let i = 0; i < anchors.length; i++) {
      let anchor = anchors.item(i);
      anchor.onclick = (event) => {
        for (let j = 0; j < anchors.length; j++) {
          (anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");
        this.querySelector(".tool-composer-container-point-iterator").style.display = "none";
        this.querySelector(".tool-composer-container-painter").style.display = "none";
        this.querySelector(".tool-composer-container-try-me").style.display = "none";
        switch(anchor.getAttribute("data-value")) {
          case "stamper":
          case "tracer":
          case "airbrush":
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "block";
            break;
          case "shape2d":
            this.querySelector(".tool-composer-container-painter").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "block";
            break;
          case "tryme":
            this.querySelector(".tool-composer-container-try-me").style.display = "flex";
            this.querySelector(".tool-composer-container-gradient-color").style.display = "none";
            if (!this.offscreenCreated) {
              this.offscreenCreated = true;
              this.createOffscreen();
            }
            break;
        }
        return null;
      };
    }
    this.querySelector(".tool-composer-container-painter").style.display = "none";
    this.querySelector(".tool-composer-container-try-me").style.display = "none";
  }

   configPointIterators() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-point-iterator img[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-point-iterator input[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(5)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
          case "stamper":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "block";
            this.pointIterator = this.stamperUI.getValue();
            break;
          case "tracer":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "block";
            this.pointIterator = this.tracerUI.getValue();
            break;
          case "airbrush":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "block";
            this.pointIterator = this.airbrushUI.getValue();
            break;
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(5)").style.display = "block";
            this.pointIterator = this.spirographUI.getValue();
            break;
        }
        this.shape2DPainterUI.setPointIterator(this.pointIterator);
        return null;
      };
    }
    this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
    this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
    this.querySelector(".tool-composer-container-point-iterator > div:nth-child(5)").style.display = "none";
  }

   configPointPainters() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-painter img[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-painter input[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
          case "shape2d":
            this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "block";
            this.painter = this.shape2DPainterUI.getValue();
            break;
        }
        this.stamperUI.setPainter(this.painter);
        this.tracerUI.setPainter(this.painter);
        this.airbrushUI.setPainter(this.painter);
        this.spirographUI.setPainter(this.painter);
        return null;
      };
    }
  }

   setPointIteratorUI(pointIteratorUI) {
    pointIteratorUI.setPainter(this.painter);
    pointIteratorUI.setGradientColor(this.gradientColor);
    pointIteratorUI.oninput = (v) => {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
    pointIteratorUI.onchange = (v) => {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
  }

   setPainterUI(painterUI) {
    painterUI.setPointIterator(this.pointIterator);
    painterUI.setGradientColor(this.gradientColor);
    painterUI.oninput = (v) => {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.airbrushUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
    painterUI.onchange = (v) => {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.airbrushUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
  }

   configTryMe() {
    let standardColorButtons = this.querySelector(".tool-composer-btn-group-try-me");
    Z4Color.STANDARD_COLOR.forEach(color => {
      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.className = "btn btn-outline-secondary";
      button.style.width = "38px";
      button.style.height = "38px";
      button.style.background = color;
      button.onclick = (event) => {
        this.fillCanvas(color);
        return null;
      };
      standardColorButtons.appendChild(button);
    });
  }

   createOffscreen() {
    if (this.canvas.clientWidth) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
      this.offscreenCanvas = new OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      this.offscreenCtx = this.offscreenCanvas.getContext("2d");
      this.canvasRect = this.canvas.getBoundingClientRect();
      this.fillCanvas(this.background);
    }
  }

   fillCanvas(background) {
    this.background = background;
    this.offscreenCtx.fillStyle = Z4Color.getFillStyle(this.background);
    this.offscreenCtx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);
    this.canvasCtx.save();
    this.canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvasCtx.drawImage(this.offscreenCanvas, 0, 0);
    this.canvasCtx.restore();
  }

   dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.stamperUI.dispose();
    this.tracerUI.dispose();
    this.airbrushUI.dispose();
    this.spirographUI.dispose();
    this.shape2DPainterUI.dispose();
  }

   manageStart(event) {
    this.mouseDown = true;
    this.manage(true, event, Z4Action.START);
    return null;
  }

   manageContinue(event) {
    this.manage(this.mouseDown, event, Z4Action.CONTINUE);
    return null;
  }

   manageStop(event) {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.manage(true, event, Z4Action.STOP);
    }
    return null;
  }

   convertCoordinates(event) {
    if ((event).changedTouches) {
      event["pageX"] = (event).changedTouches[0].pageX;
      event["pageY"] = (event).changedTouches[0].pageY;
    }
    event.preventDefault();
  }

   manage(doIt, event, action) {
    this.convertCoordinates(event);
    if (doIt && this.pointIterator.draw(action, event["pageX"] - this.canvasRect.left, event["pageY"] - this.canvasRect.top)) {
      this.iteratePoint();
      if (this.pointIterator.isInfinitePointGenerator() && this.mouseDown) {
        setTimeout(() => this.iteratePoint(), 50);
      }
    }
  }

   iteratePoint() {
    let next = null;
    while ((next = this.pointIterator.next()) !== null) {
      let vector = next.getZ4Vector();
      let ctx = next.isDrawBounds() ? this.canvasCtx : this.offscreenCtx;
      ctx.save();
      ctx.translate(vector.getX0(), vector.getY0());
      ctx.rotate(vector.getPhase());
      this.painter.draw(ctx, next, this.gradientColor);
      ctx.restore();
      if (!next.isDrawBounds()) {
        this.canvasCtx.save();
        this.canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvasCtx.drawImage(this.offscreenCanvas, 0, 0);
        this.canvasCtx.restore();
      }
    }
  }
}
