/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4NumberUI extends Z4ComponentUI {

   toggle = this.querySelector(".sign-button");

   toggleImg = this.querySelector(".sign-button img");

   value = this.querySelector(".value");

   spinner = this.querySelector(".spinner");

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4NumberUI.html");

  /**
   * Creates a Z4NumberUI
   */
  constructor() {
    super(Z4NumberUI.UI);
    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.toggle.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + button.getAttribute("data-value") + ".svg");
        this.onchange(null);
        return null;
      };
    }
    this.value.oninput = (event) => {
      this.oninput(null);
      return null;
    };
    this.value.onchange = (event) => {
      this.onchange(null);
      return null;
    };
    this.value.onfocus = (event) => {
      this.value.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) => this.startSpin();
      this.spinner.ontouchend = (event) => this.stopSpin();
    } else {
      this.spinner.onmousedown = (event) => this.startSpin();
      this.spinner.onmouseup = (event) => this.stopSpin();
    }
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
    let min = parseFloat(this.value.getAttribute("min"));
    let max = parseFloat(this.value.getAttribute("max"));
    let v = this.spinner.valueAsNumber;
    let abs = 1;
    if (v) {
      abs = Math.abs(v);
      v = Math.max(min, this.value.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      this.value.value = "" + v;
      this.oninput(null);
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(null);
    }
  }

  /**
   * Sets the range of this Z4NumberUI
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4NumberUI
   */
   setRange(min, max) {
    this.value.setAttribute("min", "" + min);
    this.value.setAttribute("max", "" + max);
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4NumberUI
   */
   setSignVisible(visible) {
    if (visible) {
      this.querySelector(".number-group").classList.add("input-group");
      this.querySelector(".sign-label").classList.remove("sign-label-not-visible");
      this.toggle.classList.remove("sign-toggle-not-visible");
    } else {
      this.querySelector(".number-group").classList.remove("input-group");
      this.querySelector(".sign-label").classList.add("sign-label-not-visible");
      this.toggle.classList.add("sign-toggle-not-visible");
    }
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
   setValueLabel(token) {
    let valueLabel = this.querySelector(".value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Sign
   *
   * @param sign The Z4Sign
   * @return This Z4NumberUI
   */
   setSign(sign) {
    let str = null;
    if (sign === Z4Sign.POSITIVE) {
      str = "positive";
    } else if (sign === Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (sign === Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }
    this.toggle.setAttribute("data-value", str);
    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + str + ".svg");
    return this;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    switch(this.toggle.getAttribute("data-value")) {
      case "positive":
        return Z4Sign.POSITIVE;
      case "negative":
        return Z4Sign.NEGATIVE;
      case "random":
        return Z4Sign.RANDOM;
      case "alternate":
        return Z4Sign.alternate();
      default:
        return null;
    }
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4NumberUI
   */
   setValue(value) {
    this.value.value = "" + value;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value.valueAsNumber;
  }
}
