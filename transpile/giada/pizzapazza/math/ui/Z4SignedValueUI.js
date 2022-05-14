/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValueUI extends Z4AbstractComponentWithValueUI {

   valueSpan = this.querySelector(".value-span");

   text = this.querySelector(".value");

   spinner = this.querySelector(".spinner");

   applySpin = () => this.spin();

   isApplySpin = false;

   signVisible = true;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    let imgs = this.querySelectorAll(".btn-group img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".btn-group button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
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
        this.setSpan();
        return null;
      };
    }
    this.text.oninput = (event) => {
      this.oninput(this.value.setValue(this.text.valueAsNumber));
      this.setSpan();
      return null;
    };
    this.text.onchange = (event) => {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
      this.setSpan();
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
      this.setSpan();
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.value.setValue(this.text.valueAsNumber));
      this.setSpan();
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
    this.signVisible = visible;
    if (visible) {
      this.querySelector(".btn-group").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".btn-group").classList.add("sign-not-visible");
    }
    this.setSpan();
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
    this.text.value = "" + value.getValue();
    this.setSpan();
    return this;
  }

   setSpan() {
    if (!this.signVisible) {
      this.valueSpan.innerHTML = "" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.POSITIVE) {
      this.valueSpan.innerHTML = "&plus;" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      this.valueSpan.innerHTML = "&minus;" + this.value.getValue();
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      this.valueSpan.innerHTML = "&plusmn;" + this.value.getValue();
    } else {
      this.valueSpan.innerHTML = "&plusmn;<sup>&UpArrowDownArrow;</sup>" + this.value.getValue();
    }
  }

   dispose() {
  }
}
