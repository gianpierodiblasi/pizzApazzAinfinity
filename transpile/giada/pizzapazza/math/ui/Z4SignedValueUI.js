/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
class Z4SignedValueUI extends Z4AbstractComponentWithValueUI {

   valueLabel = this.querySelector(".signed-value-value-label");

   checkSpinner = this.querySelector(".signed-value-check-spinner");

   spinner = this.querySelector(".signed-value-range-input");

   applySpin = () => this.spin();

   applyMinusPlus = (sign, speed) => this.doMinusPlus(sign, speed, this.isApplyMinusPlus, () => this.applyMinusPlus(sign, Math.min(50, speed + 1)));

   isApplySpin = false;

   isApplyMinusPlus = false;

   timeoutID = 0;

   signVisible = true;

   min = 0;

   max = 1000000000;

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  constructor() {
    super(Z4SignedValueUI.UI);
    let imgs = this.querySelectorAll(".signed-value-sign-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".signed-value-sign-dropdown-menu button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".signed-value-sign-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
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
    this.checkSpinner.onchange = (event) => {
      let list = this.querySelectorAll(".signed-value-form-control .form-label");
      for (let i = 0; i < list.length; i++) {
        (list.item(i)).style.display = this.checkSpinner.checked ? "inline-block" : "none";
      }
      if (this.checkSpinner.checked) {
        this.spinner.setAttribute("min", "-50");
        this.spinner.setAttribute("max", "50");
        this.spinner.value = "0";
      } else {
        this.configureRange();
      }
      return null;
    };
    let minus = this.querySelector(".signed-value-range-minus");
    let plus = this.querySelector(".signed-value-range-plus");
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) => this.startSpin();
      this.spinner.ontouchend = (event) => this.stopSpin();
      minus.ontouchstart = (event) => this.minusPlus(-1);
      minus.ontouchend = (event) => this.minusPlus(0);
      plus.ontouchstart = (event) => this.minusPlus(1);
      plus.ontouchend = (event) => this.minusPlus(0);
    } else {
      this.spinner.onmousedown = (event) => this.startSpin();
      this.spinner.onmouseup = (event) => this.stopSpin();
      minus.onmousedown = (event) => this.minusPlus(-1);
      minus.onmouseup = (event) => this.minusPlus(0);
      minus.onmouseleave = (event) => this.minusPlus(0);
      plus.onmousedown = (event) => this.minusPlus(1);
      plus.onmouseup = (event) => this.minusPlus(0);
      plus.onmouseleave = (event) => this.minusPlus(0);
    }
    this.spinner.oninput = (event) => {
      if (!this.checkSpinner.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.oninput(this.value.setValue(v));
      }
      return null;
    };
    this.spinner.onchange = (event) => {
      if (!this.checkSpinner.checked) {
        let v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.onchange(this.value.setValue(v));
      }
      return null;
    };
    this.setValue(new Z4SignedValue());
  }

   startSpin() {
    if (this.checkSpinner.checked) {
      this.isApplySpin = true;
      this.applySpin();
    }
    return null;
  }

   stopSpin() {
    if (this.checkSpinner.checked) {
      this.isApplySpin = false;
      this.spinner.value = "0";
      this.onchange(this.value);
    }
    return null;
  }

   spin() {
    let abs = Math.max(1, Math.abs(this.spinner.valueAsNumber));
    if (this.spinner.valueAsNumber) {
      this.doMinusPlus(this.spinner.valueAsNumber > 0 ? 1 : -1, abs, this.isApplySpin, this.applySpin);
    } else {
      clearTimeout(this.timeoutID);
      if (this.isApplySpin) {
        this.timeoutID = setTimeout(this.applySpin, 500 / abs);
      }
    }
  }

   minusPlus(sign) {
    if (sign) {
      this.isApplyMinusPlus = true;
      this.applyMinusPlus(sign, 1.0);
    } else {
      this.isApplyMinusPlus = false;
      clearTimeout(this.timeoutID);
      this.onchange(this.value);
    }
    return null;
  }

   doMinusPlus(sign, speed, isApply, apply) {
    let rangedMax = this.getRangedValue(this.max);
    let rangedValue = Math.max(0, this.getRangedValue(this.value.getValue()) + sign);
    rangedValue = Math.min(rangedValue, rangedMax);
    let reversedValue = this.getReversedValue(rangedValue);
    this.valueLabel.innerText = "" + reversedValue;
    if (!this.checkSpinner.checked) {
      this.spinner.value = "" + rangedValue;
    }
    this.oninput(this.value.setValue(reversedValue));
    clearTimeout(this.timeoutID);
    if (isApply) {
      this.timeoutID = setTimeout(apply, 500 / speed);
    }
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (1000000000 to show infinite)
   * @return This Z4SignedValueUI
   */
   setRange(min, max) {
    this.min = min;
    this.max = max;
    this.querySelector(".signed-value-range-span").innerHTML = "[" + min + "," + (max === 1000000000 ? "&infin;" : max) + "]";
    if (!this.checkSpinner.checked) {
      this.configureRange();
    }
    return this;
  }

   configureRange() {
    this.spinner.setAttribute("min", "0");
    this.spinner.setAttribute("max", "" + this.getRangedValue(this.max));
    this.spinner.value = "" + this.getRangedValue(this.value.getValue());
  }

   getRangedValue(limit) {
    let count = 0;
    let counter = this.min;
    while (counter < limit) {
      count++;
      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }
    return count;
  }

   getReversedValue(limit) {
    let count = 0;
    let counter = this.min;
    while (count < limit) {
      count++;
      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }
    return counter;
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
      this.querySelector(".signed-value-sign-button").classList.remove("sign-not-visible");
      this.querySelector(".signed-value-form-control").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".signed-value-sign-button").classList.add("sign-not-visible");
      this.querySelector(".signed-value-form-control").classList.add("sign-not-visible");
    }
    return this;
  }

  /**
   * Checks if the sign is visible
   *
   * @return true if the sign is visible, false otherwise
   */
   isSignVisible() {
    return this.signVisible;
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
    let label = this.querySelector(".signed-value-label");
    label.setAttribute("data-token-lang-inner_text", token);
    label.innerHTML = Z4MessageFactory.get(token);
    label.style.fontWeight = bold ? "700" : "400";
    label.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    this.valueLabel.innerText = "" + this.value.getValue();
    if (this.value.getSign() === Z4Sign.POSITIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='positive']").getAttribute("src"));
    } else if (this.value.getSign() === Z4Sign.NEGATIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='negative']").getAttribute("src"));
    } else if (this.value.getSign() === Z4Sign.RANDOM) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='random']").getAttribute("src"));
    } else {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='alternate']").getAttribute("src"));
    }
    return this;
  }

   dispose() {
  }
}
