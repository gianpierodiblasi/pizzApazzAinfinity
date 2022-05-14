/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI {

   valueLength = this.querySelector(".type-length");

   spinnerLength = this.querySelector(".type-length-spinner");

   signedValueUI = new Z4SignedValueUI();

   valueSpan = this.signedValueUI.querySelector(".value-span");

   applySpin = () => this.spin();

   isApplySpin = false;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  constructor() {
    super(Z4SignedRandomValueUI.UI);
    this.signedValueUI.appendToComponent(this);
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.createSignedRandomValue(this.getType()));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.createSignedRandomValue(this.getType()));
    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".btn-group-type-container"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));
    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".container-length"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));
    let imgs = this.querySelectorAll(".btn-group-type img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".btn-group-type button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.onchange(this.createSignedRandomValue(button.getAttribute("data-value")));
        return null;
      };
    }
    this.valueLength.oninput = (event) => {
      this.oninput(this.createSignedRandomValue(this.getType()));
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.onchange(this.createSignedRandomValue(this.getType()));
      return null;
    };
    this.valueLength.onfocus = (event) => {
      this.valueLength.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinnerLength.ontouchstart = (event) => this.startSpin();
      this.spinnerLength.ontouchend = (event) => this.stopSpin();
    } else {
      this.spinnerLength.onmousedown = (event) => this.startSpin();
      this.spinnerLength.onmouseup = (event) => this.stopSpin();
    }
    this.setValue(Z4SignedRandomValue.classic(0));
  }

   startSpin() {
    this.isApplySpin = true;
    this.applySpin();
    return null;
  }

   stopSpin() {
    this.isApplySpin = false;
    this.spinnerLength.value = "0";
    return null;
  }

   spin() {
    let min = parseFloat(this.valueLength.getAttribute("min"));
    let max = parseFloat(this.valueLength.getAttribute("max"));
    let v = this.spinnerLength.valueAsNumber;
    let abs = 1;
    if (v) {
      abs = Math.abs(v);
      v = Math.max(min, this.valueLength.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      this.valueLength.value = "" + v;
      this.oninput(this.createSignedRandomValue(this.getType()));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.createSignedRandomValue(this.getType()));
    }
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4SignedRandomValueUI
   */
   compact() {
    this.signedValueUI.compact();
    return this;
  }

  /**
   * Sets the range of this Z4SignedRandomValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
   setRange(min, max) {
    this.signedValueUI.setRange(min, max);
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
   * @return This Z4SignedRandomValueUI
   */
   setLengthRange(min, max) {
    this.valueLength.setAttribute("min", "" + min);
    this.valueLength.setAttribute("max", "" + max);
    this.querySelector(".range-length-label").innerHTML = "[" + min + "," + (max === 999999999 ? "&infin;" : max) + "]";
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
      this.valueLength.setAttribute("disabled", "disabled");
      this.spinnerLength.setAttribute("disabled", "disabled");
    } else if (this.value.isBezier()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isPolyline()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isStepped()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    }
    this.valueLength.value = "" + this.getValue().getLength();
    this.setSpan();
    return this;
  }

   createSignedRandomValue(str) {
    let signedValue = this.signedValueUI.getValue();
    switch(str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        this.valueLength.setAttribute("disabled", "disabled");
        this.spinnerLength.setAttribute("disabled", "disabled");
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
    }
    this.setSpan();
    return this.value;
  }

   getType() {
    if (this.value.isClassic()) {
      return "classic";
    } else if (this.value.isBezier()) {
      return "bezier";
    } else if (this.value.isPolyline()) {
      return "polyline";
    } else if (this.value.isStepped()) {
      return "stepped";
    } else {
      return null;
    }
  }

   setSpan() {
    let sign = "";
    if (!this.signedValueUI.isSignVisible()) {
    } else if (this.value.getSign() === Z4Sign.POSITIVE) {
      sign = "&plus;";
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      sign = "&minus;";
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      sign = "&plusmn;";
    } else {
      sign = "&plusmn;<sup>&UpArrowDownArrow;</sup>";
    }
    let rnd = "";
    if (this.value.isClassic()) {
      rnd = "rnd";
    } else if (this.value.isBezier()) {
      rnd = "rnd&#8767;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isPolyline()) {
      rnd = "rnd&#8896;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isStepped()) {
      rnd = "rnd&#8851;<sup>" + this.value.getLength() + "</sup>";
    }
    this.valueSpan.innerHTML = sign + rnd + "(" + this.value.getValue() + ")";
  }

   dispose() {
  }
}
