/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI {

   signedValueUI = new Z4SignedValueUI().appendToComponent(this);

   lengthUI = new Z4SignedValueUI().setSignVisible(false).setValueLabel("LENGTH", false, false).setRange(1, 1000000000, true).appendToElement(this.querySelector(".signed-random-value-length-ui"));

   lengthBadge = this.querySelector(".signed-random-value-length-badge");

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  constructor() {
    super(Z4SignedRandomValueUI.UI);
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.value.setValue(signedValue.getValue()).setSign(signedValue.getSign()));
    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-button"));
    this.signedValueUI.querySelector(".signed-value-input-group").appendChild(this.querySelector(".signed-random-value-type-dropdown-menu"));
    let imgs = this.querySelectorAll(".signed-random-value-type-dropdown-menu img[data-type='signed-random-value']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-random-value-type-dropdown-menu button[data-type='signed-random-value']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-random-value-type-button img[data-type='signed-random-value']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        let signedValue = this.signedValueUI.getValue();
        switch(button.getAttribute("data-value")) {
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
        this.onchange(this.value.setSign(signedValue.getSign()));
        return null;
      };
    }
    this.lengthUI.oninput = (signedValue) => {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.oninput(this.value.setLength(signedValue.getValue()));
    };
    this.lengthUI.onchange = (signedValue) => {
      this.lengthBadge.innerText = "" + signedValue.getValue();
      this.onchange(this.value.setLength(signedValue.getValue()));
    };
    this.setValue(Z4SignedRandomValue.classic(0));
  }

  /**
   * Sets the compact mode
   *
   * @return This Z4SignedRandomValueUI
   */
   setCompact() {
    this.signedValueUI.setCompact();
    this.querySelector(".signed-random-value-type-button img").setAttribute("width", "20");
    return this;
  }

  /**
   * Sets the range of this Z4SignedRandomValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @param tenMultiplier true to use the ten multiplier for range spinner,
   * false otherwise
   * @return This Z4SignedRandomValueUI
   */
   setRange(min, max, tenMultiplier) {
    this.signedValueUI.setRange(min, max, tenMultiplier);
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedRandomValueUI
   */
   setSignVisible(visible) {
    this.signedValueUI.setSignVisible(visible);
    return this;
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @param tenMultiplier true to use the ten multiplier for range spinner,
   * false otherwise
   * @return This Z4SignedRandomValueUI
   */
   setLengthRange(min, max, tenMultiplier) {
    this.lengthUI.setRange(min, max, tenMultiplier);
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
   setValueLabel(token, bold, italic) {
    this.signedValueUI.setValueLabel(token, bold, italic);
    return this;
  }

   setValue(value) {
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
    return this;
  }

   dispose() {
  }
}
