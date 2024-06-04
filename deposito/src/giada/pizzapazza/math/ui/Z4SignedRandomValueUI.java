package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to edit a signed random value
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI<Z4SignedRandomValue> {

  /**
   * Enables this Z4SignedRandomValueUI
   *
   * @param b true to enable this Z4SignedRandomValueUI, false otherwise
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setEnabled(boolean b) {
    this.signedValueUI.setEnabled(b);

    if (b) {
      this.querySelector(".signed-random-value-type-button").removeAttribute("disabled");
    } else {
      this.querySelector(".signed-random-value-type-button").setAttribute("disabled", "disabled");
    }

    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setSignVisible(boolean visible) {
    this.signedValueUI.setSignVisible(visible);
    return this;
  }

  @Override
  @SuppressWarnings({"StringEquality", "unchecked"})
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4SignedRandomValue value) {
    this.value = value;

    this.signedValueUI.setValue(new Z4SignedValue().setValue(this.value.getValue()).setSign(this.value.getSign()));

    if (this.value.isClassic()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='classic']").getAttribute("src"));
    } else if (this.value.isBezier()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='bezier']").getAttribute("src"));
    } else if (this.value.isPolyline()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='polyline']").getAttribute("src"));
    } else if (this.value.isStepped()) {
      this.querySelector(".signed-random-value-type-button img").setAttribute("src", this.querySelector(".signed-random-value-type-dropdown-menu img[data-icon='stepped']").getAttribute("src"));
    }

    this.lengthUI.setEnabled(!this.value.isClassic());
    this.lengthUI.setValue(new Z4SignedValue().setValue(this.value.getLength()));

    this.lengthBadge.style.display = this.value.isClassic() ? "none" : "inline-block";
    this.lengthBadge.innerText = "" + this.value.getLength();

    return (T) this;
  }
}
