/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValueUI extends Z4AbstractComponentWithValueUI {

   toggle = this.querySelector(".sign-button");

   toggleImg = this.querySelector(".sign-button img");

   text = this.querySelector(".value");

   spinner = this.querySelector(".spinner");

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggle.setAttribute("data-value", str);
        this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");
        switch(str) {
          case "positive":
            this.onchange(this.value.setSign(Z4Sign.POSITIVE));
            break;
          case "negative":
            this.onchange(this.value.setSign(Z4Sign.NEGATIVE));
            break;
          case "random":
            this.onchange(this.value.setSign(Z4Sign.RANDOM));
            break;
          case "alternate":
            this.onchange(this.value.setSign(Z4Sign.alternate()));
            break;
        }
        return null;
      };
    }
    this.text.oninput = (event) => {
      this.oninput(this.value.setValue(this.text.valueAsNumber));
      return null;
    };
    this.text.onchange = (event) => {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
      return null;
    };
    this.text.onfocus = (event) => {
      this.text.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) => this.startSpin();
      this.spinner.ontouchend = (event) => this.stopSpin();
    } else {
      this.spinner.onmousedown = (event) => this.startSpin();
      this.spinner.onmouseup = (event) => this.stopSpin();
    }
    this.setValue(new Z4SignedValue());
  }

   startSpin() {
    this.isApplySpin = true;
    this.applySpin();
    return null;
  }

   stopSpin() {
    this.isApplySpin = false;
    this.spinner.value = "0";
    return null;
  }

   spin() {
    let min = parseFloat(this.text.getAttribute("min"));
    let max = parseFloat(this.text.getAttribute("max"));
    let v = this.spinner.valueAsNumber;
    let abs = 1;
    if (v) {
      abs = Math.abs(v);
      v = Math.max(min, this.text.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      this.text.value = "" + v;
      this.oninput(this.value.setValue(this.text.valueAsNumber));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
    }
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedValueUI
   */
   setRange(min, max) {
    this.text.setAttribute("min", "" + min);
    this.text.setAttribute("max", "" + max);
    this.querySelector(".range-label").innerHTML = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
   setSignVisible(visible) {
    if (visible) {
      this.querySelector(".sign-label").classList.remove("sign-label-not-visible");
      this.toggle.classList.remove("sign-toggle-not-visible");
    } else {
      this.querySelector(".sign-label").classList.add("sign-label-not-visible");
      this.toggle.classList.add("sign-toggle-not-visible");
    }
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedValueUI
   */
   setValueLabel(token, bold, italic) {
    let valueLabel = this.querySelector(".value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    let str = null;
    if (value.getSign() === Z4Sign.POSITIVE) {
      str = "positive";
    } else if (value.getSign() === Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (value.getSign() === Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }
    this.toggle.setAttribute("data-value", str);
    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");
    this.text.value = "" + value.getValue();
    return this;
  }

   dispose() {
  }
}
