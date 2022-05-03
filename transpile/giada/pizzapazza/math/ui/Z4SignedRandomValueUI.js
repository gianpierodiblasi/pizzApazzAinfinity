/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI {

   toggleType = this.querySelector(".toggle-type");

   toggleTypeImg = this.querySelector(".toggle-type img");

   valueLength = this.querySelector(".type-length");

   spinnerLength = this.querySelector(".type-length-spinner");

   signedValueUI = new Z4SignedValueUI();

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
    this.signedValueUI.oninput = (signedValue) => this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    this.signedValueUI.onchange = (signedValue) => this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + this.toggleType.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".toggle-type-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".toggle-type-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleType.setAttribute("data-value", str);
        this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + str + ".svg");
        // JS equality for strings
        this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
        // JS equality for strings
        this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
        this.onchange(this.createSignedRandomValue(str));
        return null;
      };
    }
    this.valueLength.oninput = (event) => {
      this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
      return null;
    };
    this.valueLength.onchange = (event) => {
      this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
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
    this.signedValueUI.prependElement(this.querySelector(".type-label"));
    this.querySelector(".number-group").prepend(this.querySelector(".toggle-type-dropdown-menu"));
    this.querySelector(".number-group").prepend(this.toggleType);
    this.querySelector(".sign-label").style.width = "50px";
    this.querySelector(".range-label").classList.add("signed-random-value");
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
      this.oninput(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }
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
    let str = null;
    if (this.value.isClassic()) {
      str = "classic";
    } else if (this.value.isBezier()) {
      str = "bezier";
    } else if (this.value.isPolyline()) {
      str = "polyline";
    } else if (this.value.isStepped()) {
      str = "stepped";
    }
    this.toggleType.setAttribute("data-value", str);
    this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + str + ".svg");
    this.signedValueUI.setValue(new Z4SignedValue().setValue(this.value.getValue()).setSign(this.value.getSign()));
    // JS equality for strings
    this.querySelector(".divider-length").style.display = str === "classic" ? "none" : "block";
    // JS equality for strings
    this.querySelector(".container-length").style.display = str === "classic" ? "none" : "block";
    this.valueLength.value = "" + this.getValue().getLength();
    return this;
  }

   createSignedRandomValue(str) {
    let signedValue = this.signedValueUI.getValue();
    switch(str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
    }
    return this.value;
  }

   dispose() {
  }
}
