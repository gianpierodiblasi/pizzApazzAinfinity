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
 * @author gianpiero.di.blasi
 */
public class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI<Z4SignedRandomValue> {

  private final Z4SignedValueUI signedValueUI = new Z4SignedValueUI().appendToComponent(this);
  private final Z4SignedValueUI lengthUI = new Z4SignedValueUI().setSignVisible(false).setValueLabel("LENGTH", false, false).setRange(1, 1000000000).appendToElement(this.querySelector(".signed-random-value-length-ui"));
  private final $HTMLElement lengthBadge = this.querySelector(".signed-random-value-length-badge");

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  @SuppressWarnings("StringEquality")
  public Z4SignedRandomValueUI() {
    super(Z4SignedRandomValueUI.UI);

    this.signedValueUI.oninput = (signedValue) -> this.oninput.$apply(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));
    this.signedValueUI.onchange = (signedValue) -> this.onchange.$apply(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));

    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-button"));
    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-dropdown-menu"));

    NodeList imgs = this.querySelectorAll(".signed-random-value-type-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".signed-random-value-type-dropdown-menu button[class='dropdown-item']");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.querySelector(".signed-random-value-type-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));

        Z4SignedValue signedValue = this.signedValueUI.getValue();
        switch (button.getAttribute("data-value")) {
          case "classic":
            this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
            break;
          case "bezier":
            this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
          case "polyline":
            this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
          case "stepped":
            this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.lengthUI.getValue().getValue());
            break;
        }

        this.lengthUI.setEnabled(!this.value.isClassic());
        this.lengthBadge.style.display = this.value.isClassic() ? "none" : "inline-block";
        
        this.onchange.$apply(this.value.setSign(signedValue.getSign()));        
        return null;
      };
    }

    this.lengthUI.oninput = (signedValue) -> {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.oninput.$apply(this.value.setLength(signedValue.getValue()));
    };
    this.lengthUI.onchange = (signedValue) -> {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.onchange.$apply(this.value.setLength(signedValue.getValue()));
    };

    this.setValue(Z4SignedRandomValue.classic(0));
  }

  /**
   * Sets the compact mode
   *
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setCompact() {
    this.signedValueUI.setCompact();
    this.querySelector(".signed-random-value-type-button img").setAttribute("width", "20");
    return this;
  }

  /**
   * Sets the range of this Z4SignedRandomValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setRange(int min, int max) {
    this.signedValueUI.setRange(min, max);
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

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setLengthRange(int min, int max) {
    this.lengthUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setValueLabel(String token, boolean bold, boolean italic) {
    this.signedValueUI.setValueLabel(token, bold, italic);
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

  @Override
  public void dispose() {
  }
}
