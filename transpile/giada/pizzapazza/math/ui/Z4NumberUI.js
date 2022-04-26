/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4NumberUI extends Z4ComponentUI {

   valueLabel = this.querySelector(".value-label");

   toggle = this.querySelector(".dropdown-toggle");

   toggleImg = this.querySelector(".dropdown-toggle img");

   value = this.querySelector(".form-control");

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4ComponentUI.loadHTML("giada/pizzapazza/math/ui/Z4NumberUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4NumberUI.UI);
    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + "-sm.png");
    let imgs = this.querySelectorAll(".dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".png");
    }
    let buttons = this.querySelectorAll(".dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.toggle.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + button.getAttribute("data-value") + "-sm.png");
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
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
   setValueLabel(token) {
    this.valueLabel.setAttribute("data-token-lang", token);
    this.valueLabel.innerText = Z4MessageFactory.get(token);
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
    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + str + "-sm.png");
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
