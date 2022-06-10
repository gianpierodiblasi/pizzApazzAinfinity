package giada.pizzapazza.ui;

import def.dom.ClientRect;
import def.dom.Element;
import def.dom.Event;
import def.dom.HTMLElement;
import def.dom.NodeList;
import def.dom.TouchEvent;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.ui.Z4GradientColorUI;
import giada.pizzapazza.iterator.Z4Action;
import giada.pizzapazza.iterator.Z4PointIterator;
import giada.pizzapazza.iterator.ui.Z4AirbrushUI;
import giada.pizzapazza.iterator.ui.Z4PointIteratorUI;
import giada.pizzapazza.iterator.ui.Z4SpirographUI;
import giada.pizzapazza.iterator.ui.Z4StamperUI;
import giada.pizzapazza.iterator.ui.Z4TracerUI;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.painter.ui.Z4PainterUI;
import giada.pizzapazza.painter.ui.Z4Shape2DPainterUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.setTimeout;
import static simulation.js.$Globals.window;
import simulation.js.$ResizeObserver;

/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
public class Z4ToolComposerUI extends Z4AbstractComponentUI {

  private final Z4StamperUI stamperUI = new Z4StamperUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));
  private final Z4TracerUI tracerUI = new Z4TracerUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));
  private final Z4AirbrushUI airbrushUI = new Z4AirbrushUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));
  private final Z4SpirographUI spirographUI = new Z4SpirographUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

  private final Z4Shape2DPainterUI shape2DPainterUI = new Z4Shape2DPainterUI().appendToElement(this.querySelector(".tool-composer-container-painter"));
  private final Z4GradientColorUI gradientColorUI = new Z4GradientColorUI().setGradientColorLabel("COLOR", true, true).setVertical().appendToElement(this.querySelector(".tool-composer-container-gradient-color"));

  private final $Canvas canvas = ($Canvas) this.querySelector(".tool-composer-canvas-try-me");
  private final $CanvasRenderingContext2D canvasCtx = this.canvas.getContext("2d");
  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.createOffscreen());
  private ClientRect canvasRect;
  private $OffscreenCanvas offscreenCanvas;
  private $CanvasRenderingContext2D offscreenCtx;
  private boolean offscreenCreated;
  private String background = "white";
  private boolean mouseDown;

  private Z4PointIterator<?> pointIterator;
  private Z4Painter<?> painter;
  private Z4GradientColor gradientColor;

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  public Z4ToolComposerUI() {
    super(Z4ToolComposerUI.UI);

    this.initDevicePixelRatio(() -> this.createOffscreen());
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

    this.gradientColorUI.oninput = (v) -> {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.airbrushUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);

      this.shape2DPainterUI.setGradientColor(v);
    };
    this.gradientColorUI.onchange = (v) -> {
      this.gradientColor = v;
      this.stamperUI.setGradientColor(v);
      this.tracerUI.setGradientColor(v);
      this.airbrushUI.setGradientColor(v);
      this.spirographUI.setGradientColor(v);

      this.shape2DPainterUI.setGradientColor(v);
    };

    if (Z4Loader.touch) {
      this.canvas.ontouchstart = (event) -> this.manageStart(event);
      this.canvas.ontouchmove = (event) -> this.manageContinue(event);
      this.canvas.ontouchend = (event) -> this.manageStop(event);
    } else {
      this.canvas.onmousedown = (event) -> this.manageStart(event);
      this.canvas.onmousemove = (event) -> this.manageContinue(event);
      this.canvas.onmouseup = (event) -> this.manageStop(event);
      this.canvas.onmouseleave = (event) -> this.manageStop(event);
    }
  }

  private void configTabs() {
    NodeList imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (int i = 0; i < anchors.length; i++) {
      HTMLElement anchor = (HTMLElement) anchors.item(i);
      anchor.onclick = (event) -> {
        for (int j = 0; j < anchors.length; j++) {
          ((Element) anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");

        this.querySelector(".tool-composer-container-point-iterator").style.display = "none";
        this.querySelector(".tool-composer-container-painter").style.display = "none";
        this.querySelector(".tool-composer-container-try-me").style.display = "none";
        switch (anchor.getAttribute("data-value")) {
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

  private void configPointIterators() {
    NodeList imgs = this.querySelectorAll(".tool-composer-btn-group-point-iterator img[data-type='tool-composer-tab-point-iterator']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    String name = this.getUniqueName();
    NodeList inputs = this.querySelectorAll(".tool-composer-btn-group-point-iterator input[data-type='tool-composer-tab-point-iterator']");
    for (int i = 0; i < inputs.length; i++) {
      HTMLElement input = (HTMLElement) inputs.item(i);
      String id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);

      input.onclick = (event) -> {
        String dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(5)").style.display = "none";

        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");

        switch (dataValue) {
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

  private void configPointPainters() {
    NodeList imgs = this.querySelectorAll(".tool-composer-btn-group-painter img[data-type='tool-composer-tab-painter']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    String name = this.getUniqueName();
    NodeList inputs = this.querySelectorAll(".tool-composer-btn-group-painter input[data-type='tool-composer-tab-painter']");
    for (int i = 0; i < inputs.length; i++) {
      HTMLElement input = (HTMLElement) inputs.item(i);
      String id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);

      input.onclick = (event) -> {
        String dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "none";

        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");

        switch (dataValue) {
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

  private void setPointIteratorUI(Z4PointIteratorUI<?> pointIteratorUI) {
    pointIteratorUI.setPainter(this.painter);
    pointIteratorUI.setGradientColor(this.gradientColor);
    pointIteratorUI.oninput = (v) -> {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
    pointIteratorUI.onchange = (v) -> {
      this.pointIterator = v;
      this.shape2DPainterUI.setPointIterator(v);
    };
  }

  private void setPainterUI(Z4PainterUI<?> painterUI) {
    painterUI.setPointIterator(this.pointIterator);
    painterUI.setGradientColor(this.gradientColor);
    painterUI.oninput = (v) -> {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.airbrushUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
    painterUI.onchange = (v) -> {
      this.painter = v;
      this.stamperUI.setPainter(v);
      this.tracerUI.setPainter(v);
      this.airbrushUI.setPainter(v);
      this.spirographUI.setPainter(v);
    };
  }

  private void configTryMe() {
    $HTMLElement standardColorButtons = this.querySelector(".tool-composer-btn-group-try-me");

    Z4Color.STANDARD_COLOR.forEach(color -> {
      HTMLElement button = document.createElement("button");
      button.setAttribute("type", "button");
      button.className = "btn btn-outline-secondary";
      button.style.width = "38px";
      button.style.height = "38px";
      button.style.background = color;
      button.onclick = (event) -> {
        this.fillCanvas(color);
        return null;
      };

      standardColorButtons.appendChild(button);
    });
  }

  private void createOffscreen() {
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      this.offscreenCanvas = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      this.offscreenCtx = this.offscreenCanvas.getContext("2d");

      this.canvasRect = this.canvas.getBoundingClientRect();

      this.fillCanvas(this.background);
    }
  }

  private void fillCanvas(String background) {
    this.background = background;

    this.offscreenCtx.fillStyle = Z4Color.$getFillStyle(this.background);
    this.offscreenCtx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);

    this.canvasCtx.save();
    this.canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvasCtx.drawImage(this.offscreenCanvas, 0, 0);
    this.canvasCtx.restore();
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);

    this.stamperUI.dispose();
    this.tracerUI.dispose();
    this.airbrushUI.dispose();
    this.spirographUI.dispose();

    this.shape2DPainterUI.dispose();
  }

  private Object manageStart(Event event) {
    this.mouseDown = true;
    this.manage(true, event, Z4Action.START);
    return null;
  }

  private Object manageContinue(Event event) {
    this.manage(this.mouseDown, event, Z4Action.CONTINUE);
    return null;
  }

  private Object manageStop(Event event) {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.manage(true, event, Z4Action.STOP);
    }
    return null;
  }

  private void convertCoordinates(Event event) {
    if ($exists(((TouchEvent) event).changedTouches)) {
      event.$set("pageX", ((TouchEvent) event).changedTouches.$get(0).pageX);
      event.$set("pageY", ((TouchEvent) event).changedTouches.$get(0).pageY);
    }
    event.preventDefault();
  }

  private void manage(boolean doIt, Event event, Z4Action action) {
    this.convertCoordinates(event);

    if (doIt && this.pointIterator.draw(action, (Double) event.$get("pageX") - this.canvasRect.left, (Double) event.$get("pageY") - this.canvasRect.top)) {
      this.iteratePoint();
    }
  }

  private void iteratePoint() {
    Z4Point next;
    while ((next = this.pointIterator.next()) != null) {
      Z4Vector vector = next.getZ4Vector();
      $CanvasRenderingContext2D ctx = next.isDrawBounds() ? this.canvasCtx : this.offscreenCtx;

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

    if (this.pointIterator.isInfinitePointGenerator() && this.mouseDown) {
      setTimeout(() -> this.iteratePoint(), this.pointIterator.getInfinitePointGeneratorSleep());
    }
  }
}
