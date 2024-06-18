package giada.pizzapazza.painter.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.ui.Z4ColorUI;
import giada.pizzapazza.math.Z4Shape2D;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.painter.Z4Shape2DPainter;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

public class Z4Shape2DPainterUI extends Z4PainterUI<Z4Shape2DPainter> {

  private void setSize(boolean onChange) {
    if (onChange) {
      this.onchange.$apply(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
    } else {
      this.oninput.$apply(this.value.setSize(this.width.getValue(), this.height.getValue(), this.regularCheck.checked));
    }
    this.height.setEnabled(!this.regularCheck.checked);
    this.drawCanvas();
  }

  private void setShadow(boolean onChange) {
    if (onChange) {
      this.onchange.$apply(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
    } else {
      this.oninput.$apply(this.value.setShadow(this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), this.shadowColor.getValue()));
    }
    this.drawCanvas();
  }

  private void setBorder(boolean onChange) {
    if (onChange) {
      this.onchange.$apply(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
    } else {
      this.oninput.$apply(this.value.setBorder(this.borderWidth.getValue(), this.borderHeight.getValue(), this.borderColor.getValue()));
    }
    this.drawCanvas();
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
  }
}
