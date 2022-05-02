/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI {

   uniformCheck = this.querySelector(".uniform-check");

   toggleUniform = this.querySelector(".toggle-uniform");

   toggleUniformImg = this.querySelector(".toggle-uniform img");

   constantUI = new Z4SignedValueUI();

   randomUI = new Z4SignedRandomValueUI();

   proportionalUI = new Z4SignedValueUI();

   constantSignVisible = true;

   randomSignVisible = true;

   proportionalSignVisible = true;

   constantVisible = true;

   randomVisible = true;

   proportionalVisible = true;

   selector = new Array();

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  constructor() {
    super(Z4FancifulValueUI.UI);
    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) => {
      this.setUI();
      this.onchange(this.value.setUniformSign(this.uniformCheck.checked));
      return null;
    };
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");
    let imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        let str = button.getAttribute("data-value");
        this.toggleUniform.setAttribute("data-value", str);
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
        this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
        this.onchange(this.value.setConstant(this.constantUI.getValue()));
        return null;
      };
    }
    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);
    this.constantUI.oninput = (event) => this.onInput();
    this.randomUI.oninput = (event) => this.onInput();
    this.proportionalUI.oninput = (event) => this.onInput();
    this.constantUI.onchange = (event) => this.onChange();
    this.randomUI.onchange = (event) => this.onChange();
    this.proportionalUI.onchange = (event) => this.onChange();
    this.setValue(new Z4FancifulValue());
  }

   onInput() {
    // this.setUniformSign(this.constantUI.getSign());
    // this.oninput.$apply(this.fancifulValue.
    // setConstant(this.constantUI.getSign(), this.constantUI.getValue()).
    // setRandom(this.randomUI.getSign(), this.getRandom()).
    // setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue())
    // );
    return null;
  }

   onChange() {
    // this.setUniformSign(this.constantUI.getSign());
    // this.onchange.$apply(this.fancifulValue.
    // setConstant(this.constantUI.getSign(), this.constantUI.getValue()).
    // setRandom(this.randomUI.getSign(), this.getRandom()).
    // setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue()));
    return null;
  }

  /**
   * Sets the visibility of the components
   *
   * @param constant true to make the constant component visible, false
   * otherwise
   * @param random true to make the random component visible, false otherwise
   * @param proportional true to make the proportional component visible, false
   * @return This Z4FancifulValueUI
   */
   setComponentsVisible(constant, random, proportional) {
    this.constantVisible = constant;
    this.randomVisible = random;
    this.proportionalVisible = proportional;
    this.setUI();
    return this;
  }

  /**
   * Sets the horizontal orientation
   *
   * @return This Z4FancifulValueUI
   */
   setHorizontal() {
    let element = this.querySelector(".fanciful-container");
    element.classList.remove("fanciful-container-vertical");
    element.classList.add("fanciful-container-horizontal");
    return this;
  }

  /**
   * Sets the vertical orientation
   *
   * @return This Z4FancifulValueUI
   */
   setVertical() {
    let element = this.querySelector(".fanciful-container");
    element.classList.add("fanciful-container-vertical");
    element.classList.remove("fanciful-container-horizontal");
    return this;
  }

   setValue(value) {
    super.setValue(value);
    this.setUI();
    return this;
  }

   setUI() {
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-label").classList.remove(sel);
      this.querySelector(".form-check").classList.remove(sel);
      this.querySelector(".fanciful-container").classList.remove(sel);
    });
    this.selector = new Array("cv-" + this.constantVisible, "rv-" + this.randomVisible, "pv-" + this.proportionalVisible, "csv-" + this.constantSignVisible, "rsv-" + this.randomSignVisible, "psv-" + this.proportionalSignVisible, "u-" + this.uniformCheck.checked);
    this.selector.forEach(sel => {
      this.querySelector(".fanciful-label").classList.add(sel);
      this.querySelector(".form-check").classList.add(sel);
      this.querySelector(".fanciful-container").classList.add(sel);
    });
  }

   getUniformSign(str) {
    switch(str) {
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
}
