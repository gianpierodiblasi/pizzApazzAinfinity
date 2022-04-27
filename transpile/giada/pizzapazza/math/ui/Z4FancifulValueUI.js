/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4ComponentUI {

   constantUI = new Z4NumberUI();

   randomUI = new Z4NumberUI();

   proportionalUI = new Z4NumberUI();

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4ColorUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    // this.toggleImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + "-sm.png");
    // 
    // NodeList imgs = this.querySelectorAll(".dropdown-menu img");
    // for (int i = 0; i < imgs.length; i++) {
    // HTMLElement img = (HTMLElement) imgs.item(i);
    // img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".png");
    // }
    // 
    // NodeList buttons = this.querySelectorAll(".dropdown-item");
    // for (int i = 0; i < buttons.length; i++) {
    // HTMLElement button = (HTMLElement) buttons.item(i);
    // button.onclick = (event) -> {
    // this.toggle.setAttribute("data-value", button.getAttribute("data-value"));
    // this.toggleImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + button.getAttribute("data-value") + "-sm.png");
    // this.onchange.$apply(null);
    // return null;
    // };
    // }
    // 
    // this.value.oninput = (event) -> {
    // this.oninput.$apply(null);
    // return null;
    // };
    // this.value.onchange = (event) -> {
    // this.onchange.$apply(null);
    // return null;
    // };
    // this.value.onfocus = (event) -> {
    // this.value.select();
    // return null;
    // };
    // 
    // if (Z4Loader.touch) {
    // this.spinner.ontouchstart = (event) -> this.startSpin();
    // this.spinner.ontouchend = (event) -> this.stopSpin();
    // } else {
    // this.spinner.onmousedown = (event) -> this.startSpin();
    // this.spinner.onmouseup = (event) -> this.stopSpin();
    // }
    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.randomUI.appendTo(this.querySelector(".fanciful-random"));
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
  }
  /**
   * Sets the range of this Z4NumberUI
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setRange(int min, int max) {
  // this.value.setAttribute("min", "" + min);
  // this.value.setAttribute("max", "" + max);
  // return this;
  // }
  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setSignVisible(boolean visible) {
  // this.querySelector(".sign-label").style.display = visible ? "inline-block" : "none";
  // this.toggle.style.display = visible ? "inline-block" : "none";
  // 
  // if (visible) {
  // this.querySelector(".number-group").classList.add("input-group");
  // } else {
  // this.querySelector(".number-group").classList.remove("input-group");
  // }
  // 
  // return this;
  // }
  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setValueLabel(String token) {
  // $HTMLElement valueLabel = this.querySelector(".value-label");
  // valueLabel.setAttribute("data-token-lang", token);
  // valueLabel.innerText = Z4MessageFactory.get(token);
  // return this;
  // }
  /**
   * Sets the Z4Sign
   *
   * @param sign The Z4Sign
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setSign(Z4Sign sign) {
  // String str;
  // 
  // if (sign == Z4Sign.POSITIVE) {
  // str = "positive";
  // } else if (sign == Z4Sign.NEGATIVE) {
  // str = "negative";
  // } else if (sign == Z4Sign.RANDOM) {
  // str = "random";
  // } else {
  // str = "alternate";
  // }
  // 
  // this.toggle.setAttribute("data-value", str);
  // this.toggleImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + "-sm.png");
  // 
  // return this;
  // }
  /**
   * Returns the sign
   *
   * @return The sign
   */
  // public Z4Sign getSign() {
  // switch (this.toggle.getAttribute("data-value")) {
  // case "positive":
  // return Z4Sign.POSITIVE;
  // case "negative":
  // return Z4Sign.NEGATIVE;
  // case "random":
  // return Z4Sign.RANDOM;
  // case "alternate":
  // return Z4Sign.alternate();
  // default:
  // return null;
  // }
  // }
  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4NumberUI
   */
  // public Z4FancifulValueUI setValue(int value) {
  // this.value.value = "" + value;
  // return this;
  // }
  /**
   * Returns the value
   *
   * @return The value
   */
  // public Double getValue() {
  // return this.value.valueAsNumber;
  // }
}
