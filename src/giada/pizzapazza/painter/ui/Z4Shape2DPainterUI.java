package giada.pizzapazza.painter.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Array;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.math.Z4Shape2D;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.painter.Z4Shape2DPainter;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$MutationObserver;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;

/**
 * The component to edit a Z4Shape2DPainter
 *
 * @author gianpiero.di.blasi
 */
public class Z4Shape2DPainterUI extends Z4AbstractComponentWithValueUI<Z4Shape2DPainter> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".shape2d-painter-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");
//
//  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".shape2d-painter-container"));
//  private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".shape2d-painter-container"));
//  
  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/painter/ui/Z4Shape2DPainterUI.html");

  /**
   * Creates a Z4Shape2DPainterUI
   */
  public Z4Shape2DPainterUI() {
    super(Z4Shape2DPainterUI.UI);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);

    NodeList imgs = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu img[data-type='shape']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4Shape2DPainterUI.PATH + "z4shape2d_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu button[data-type='shape']");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.querySelector(".shape2d-painter-shape-button img[data-type='shape']").setAttribute("src", button.querySelector("img").getAttribute("src"));

        switch (button.getAttribute("data-value")) {
          case "circle":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.CIRCLE));
            break;
          case "triangle":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.TRIANGLE));
            break;
          case "square":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.SQUARE));
            break;
          case "diamond":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.DIAMOND));
            break;
          case "pentagon":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.PENTAGON));
            break;
          case "hexagon":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.HEXAGON));
            break;
          case "septagon":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.SEPTAGON));
            break;
          case "heptagon":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.HEPTAGON));
            break;
          case "star":
            this.onchange.$apply(this.value.setShape2D(Z4Shape2D.STAR));
            break;
        }

        this.drawCanvas();
        return null;
      };
    }

//    this.rotation.oninput = (v) -> {
//      this.oninput.$apply(this.value.setRotation(v));
//      this.drawCanvas();
//    };
//    this.rotation.onchange = (v) -> {
//      this.onchange.$apply(this.value.setRotation(v));
//      this.drawCanvas();
//    };
//    
//    this.progression.oninput = (v) -> {
//      this.oninput.$apply(this.value.setProgression(v));
//      this.drawCanvas();
//    };
//    this.progression.onchange = (v) -> {
//      this.onchange.$apply(this.value.setProgression(v));
//      this.drawCanvas();
//    };
//    
    this.setValue(new Z4Shape2DPainter());
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Shape2DPainter value) {
    this.value = value;

    if (this.value.getShape() == Z4Shape2D.CIRCLE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='circle']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.TRIANGLE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='triangle']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.SQUARE) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='square']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.DIAMOND) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='diamond']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.PENTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='pentagon']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.HEXAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='hexagon']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.SEPTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='septagon']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.HEPTAGON) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='heptagon']").getAttribute("src"));
    } else if (this.value.getShape() == Z4Shape2D.STAR) {
      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='star']").getAttribute("src"));
    }

//    this.rotation.setValue(this.value.getRotation());
//    this.progression.setValue(this.value.getProgression());
    this.drawCanvas();

    return (T) this;
  }

  private void drawCanvas() {
    if ($exists(this.canvas.clientWidth)) {
//      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
//      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);
//
//      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
//      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
//      this.value.drawDemo(offscreenCtx, this.canvas.clientWidth, this.canvas.clientHeight);
//
//      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//
//      this.ctx.save();
//      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
//      this.ctx.drawImage(offscreen, 0, 0);
//      this.ctx.restore();
    }
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
