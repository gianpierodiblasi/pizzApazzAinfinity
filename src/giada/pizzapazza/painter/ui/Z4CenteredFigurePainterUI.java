package giada.pizzapazza.painter.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.ui.Z4ColorUI;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.painter.Z4CenteredFigurePainter;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to edit a Z4CenteredFigurePainter
 *
 * @author gianpiero.di.blasi
 */
public class Z4CenteredFigurePainterUI extends Z4PainterUI<Z4CenteredFigurePainter> {

//  private final Z4FancifulValueUI width = new Z4FancifulValueUI().setValueLabel("WIDTH", true, true).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-first-row"));
//  private final Z4FancifulValueUI height = new Z4FancifulValueUI().setValueLabel("HEIGHT", true, true).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-first-row"));
//  private final $HTMLElement regularCheck = this.querySelector(".shape2d-painter-regular-check");
//  private final Z4FancifulValueUI shadowShiftX = new Z4FancifulValueUI().setValueLabel("DELTA_X", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));
//  private final Z4FancifulValueUI shadowShiftY = new Z4FancifulValueUI().setValueLabel("DELTA_Y", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));
//  private final Z4ColorUI shadowColor = new Z4ColorUI().setColorLabel("COLOR", true, false).appendToElement(this.querySelector(".shape2d-painter-container-second-row"));
//  private final Z4FancifulValueUI borderWidth = new Z4FancifulValueUI().setValueLabel("WIDTH", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));
//  private final Z4FancifulValueUI borderHeight = new Z4FancifulValueUI().setValueLabel("HEIGHT", true, false).setConstantRange(0, 100, false).setRandomRange(0, 100, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));
//  private final Z4ColorUI borderColor = new Z4ColorUI().setColorLabel("COLOR", true, false).appendToElement(this.querySelector(".shape2d-painter-container-third-row"));
  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/painter/ui/Z4CenteredFigurePainterUI.html");

  /**
   * Creates a Z4CenteredFigurePainterUI
   */
  public Z4CenteredFigurePainterUI() {
    super(Z4CenteredFigurePainterUI.UI);
//
//    NodeList imgs = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu img[data-type='shape']");
//    for (int i = 0; i < imgs.length; i++) {
//      HTMLElement img = (HTMLElement) imgs.item(i);
//      img.setAttribute("src", Z4CenteredFigurePainterUI.PATH + "z4shape2d_" + img.getAttribute("data-icon") + ".svg");
//    }
//
//    NodeList buttons = this.querySelectorAll(".shape2d-painter-shape-dropdown-menu button[data-type='shape']");
//    for (int i = 0; i < buttons.length; i++) {
//      HTMLElement button = (HTMLElement) buttons.item(i);
//      button.onclick = (event) -> {
//        this.querySelector(".shape2d-painter-shape-button img[data-type='shape']").setAttribute("src", button.querySelector("img").getAttribute("src"));
//
//        switch (button.getAttribute("data-value")) {
//          case "circle":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.CIRCLE));
//            break;
//          case "triangle":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.TRIANGLE));
//            break;
//          case "square":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.SQUARE));
//            break;
//          case "diamond":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.DIAMOND));
//            break;
//          case "pentagon":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.PENTAGON));
//            break;
//          case "hexagon":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.HEXAGON));
//            break;
//          case "septagon":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.SEPTAGON));
//            break;
//          case "heptagon":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.HEPTAGON));
//            break;
//          case "star":
//            this.onchange.$apply(this.value.setCenteredFigure(Z4CenteredFigure.STAR));
//            break;
//        }
//
//        this.drawCanvas();
//        return null;
//      };
//    }
//
//    this.regularCheck.id = this.getUniqueID();
//    this.querySelector(".shape2d-painter-regular-label").setAttribute("for", this.regularCheck.id);
//    this.regularCheck.onchange = (event) -> {
//      this.setSize(true);
//      return null;
//    };
//
//    this.width.oninput = (v) -> this.setSize(false);
//    this.width.onchange = (v) -> this.setSize(true);
//    this.height.oninput = (v) -> this.setSize(false);
//    this.height.onchange = (v) -> this.setSize(true);
//
//    this.shadowShiftX.oninput = (v) -> this.setShadow(false);
//    this.shadowShiftX.onchange = (v) -> this.setShadow(true);
//    this.shadowShiftY.oninput = (v) -> this.setShadow(false);
//    this.shadowShiftY.onchange = (v) -> this.setShadow(true);
//    this.shadowColor.oninput = (v) -> this.setShadow(false);
//    this.shadowColor.onchange = (v) -> this.setShadow(true);
//
//    this.borderWidth.oninput = (v) -> this.setBorder(false);
//    this.borderWidth.onchange = (v) -> this.setBorder(true);
//    this.borderHeight.oninput = (v) -> this.setBorder(false);
//    this.borderHeight.onchange = (v) -> this.setBorder(true);
//    this.borderColor.oninput = (v) -> this.setBorder(false);
//    this.borderColor.onchange = (v) -> this.setBorder(true);
//
    this.setValue(Z4CenteredFigurePainter.type0());
  }
//
//  private void setSize(boolean onChange) {
//    if (onChange) {
//      this.onchange.$apply(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
//    } else {
//      this.oninput.$apply(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
//    }
//    this.height.setEnabled(!this.regularCheck.checked);
//    this.drawCanvas();
//  }
//
//  private void setShadow(boolean onChange) {
//    if (onChange) {
//      this.onchange.$apply(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
//    } else {
//      this.oninput.$apply(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
//    }
//    this.drawCanvas();
//  }
//
//  private void setBorder(boolean onChange) {
//    if (onChange) {
//      this.onchange.$apply(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
//    } else {
//      this.oninput.$apply(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
//    }
//    this.drawCanvas();
//  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4CenteredFigurePainter value) {
    this.value = value;

//    if (this.value.getShape() == Z4CenteredFigure.CIRCLE) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='circle']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.TRIANGLE) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='triangle']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.SQUARE) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='square']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.DIAMOND) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='diamond']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.PENTAGON) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='pentagon']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.HEXAGON) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='hexagon']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.SEPTAGON) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='septagon']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.HEPTAGON) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='heptagon']").getAttribute("src"));
//    } else if (this.value.getShape() == Z4CenteredFigure.STAR) {
//      this.querySelector(".shape2d-painter-shape-button img").setAttribute("src", this.querySelector(".shape2d-painter-shape-dropdown-menu img[data-icon='star']").getAttribute("src"));
//    }
//
//    this.regularCheck.checked = this.value.isRegular();
//
//    this.width.setValue(this.value.getWidth());
//    this.height.setValue(this.value.getHeight());
//    this.height.setEnabled(!this.regularCheck.checked);
//
//    this.shadowShiftX.setValue(this.value.getShadowShiftX());
//    this.shadowShiftY.setValue(this.value.getShadowShiftY());
//    this.shadowColor.setValue(this.value.getShadowColor());
//
//    this.borderWidth.setValue(this.value.getBorderWidth());
//    this.borderHeight.setValue(this.value.getBorderHeight());
//    this.borderColor.setValue(this.value.getBorderColor());
//
    this.drawCanvas();

    return (T) this;
  }
}
