package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4RandomValue;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4ComponentUI<Z4FancifulValue, Z4FancifulValueUI> {

  private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
  private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
  private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");

  private final Z4NumberUI constantUI = new Z4NumberUI();
  private final Z4NumberUI randomUI = new Z4NumberUI();
  private final Z4NumberUI proportionalUI = new Z4NumberUI();

  private final HTMLElement toggleRandom = this.querySelector(".toggle-random");
  private final HTMLElement toggleRandomImg = this.querySelector(".toggle-random img");

  private final $HTMLElement valueLength = this.querySelector(".random-length");
  private final $HTMLElement spinnerLength = this.querySelector(".random-length-spinner");

  private Z4FancifulValue fancifulValue = new Z4FancifulValue();
  private boolean constantSignVisible = true;
  private boolean randomSignVisible = true;
  private boolean proportionalSignVisible = true;
  private boolean constantVisible = true;
  private boolean randomVisible = true;
  private boolean proportionalVisible = true;

  private final $Apply_0_Void applySpin = () -> this.spin();
  private boolean isApplySpin = false;

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  @SuppressWarnings("StringEquality")
  public Z4FancifulValueUI() {
    super(Z4FancifulValueUI.UI);

    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) -> {
      this.setUI();
      this.onchange.$apply(this.fancifulValue.setUniformSign(this.uniformCheck.checked));
      return null;
    };

    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.toggleUniform.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + button.getAttribute("data-value") + ".svg");

        this.constantUI.setSign(this.getUniformSign());
        this.onchange.$apply(this.fancifulValue.setConstant(this.getUniformSign(), this.constantUI.getValue()));
        return null;
      };
    }

    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + this.toggleRandom.getAttribute("data-value") + ".svg");

    imgs = this.querySelectorAll(".toggle-random-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }

    buttons = this.querySelectorAll(".toggle-random-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        String str = button.getAttribute("data-value");
        this.toggleRandom.setAttribute("data-value", str);
        this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + ".svg");

        this.querySelector(".divider-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
        this.querySelector(".container-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings

        this.onchange.$apply(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
        return null;
      };
    }

    this.valueLength.oninput = (event) -> {
      this.oninput.$apply(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
      return null;
    };
    this.valueLength.onchange = (event) -> {
      this.onchange.$apply(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
      return null;
    };
    this.valueLength.onfocus = (event) -> {
      this.valueLength.select();
      return null;
    };
    if (Z4Loader.touch) {
      this.spinnerLength.ontouchstart = (event) -> this.startSpin();
      this.spinnerLength.ontouchend = (event) -> this.stopSpin();
    } else {
      this.spinnerLength.onmousedown = (event) -> this.startSpin();
      this.spinnerLength.onmouseup = (event) -> this.stopSpin();
    }

    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT");
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM");
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL");

    this.querySelector(".fanciful-random > div").prepend(this.querySelector(".random-type-label"));
    this.randomUI.querySelector(".number-group").prepend(this.querySelector(".toggle-random-dropdown-menu"));
    this.randomUI.querySelector(".number-group").prepend(this.toggleRandom);
    this.randomUI.querySelector(".sign-label").style.width = "64px";

    this.constantUI.oninput = (event) -> this.onInput();
    this.randomUI.oninput = (event) -> this.onInput();
    this.proportionalUI.oninput = (event) -> this.onInput();
    this.constantUI.onchange = (event) -> this.onChange();
    this.randomUI.onchange = (event) -> this.onChange();
    this.proportionalUI.onchange = (event) -> this.onChange();

    this.setValue(this.fancifulValue);
  }

  private Object onInput() {
    this.setUniformSign(this.constantUI.getSign());

    this.oninput.$apply(this.fancifulValue.
            setConstant(this.constantUI.getSign(), this.constantUI.getValue()).
            setRandom(this.randomUI.getSign(), this.getRandom()).
            setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue())
    );

    return null;
  }

  private Object onChange() {
    this.setUniformSign(this.constantUI.getSign());

    this.onchange.$apply(this.fancifulValue.
            setConstant(this.constantUI.getSign(), this.constantUI.getValue()).
            setRandom(this.randomUI.getSign(), this.getRandom()).
            setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue()));

    return null;
  }

  private Object startSpin() {
    this.isApplySpin = true;
    this.applySpin.$apply();
    return null;
  }

  private Object stopSpin() {
    this.isApplySpin = false;
    this.spinnerLength.value = "0";
    return null;
  }

  private void spin() {
    double min = parseFloat(this.valueLength.getAttribute("min"));
    double max = parseFloat(this.valueLength.getAttribute("max"));

    double v = this.spinnerLength.valueAsNumber;
    double abs = 1;

    if ($exists(v)) {
      abs = Math.abs(v);

      v = Math.max(min, this.valueLength.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);

      this.valueLength.value = "" + v;
      this.oninput.$apply(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
    }

    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange.$apply(this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom()));
    }
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
  public Z4FancifulValueUI setComponentsVisible(boolean constant, boolean random, boolean proportional) {
    this.constantVisible = constant;
    this.randomVisible = random;
    this.proportionalVisible = proportional;

    this.setUI();
    return this;
  }

  /**
   * Sets the visibility of the signs
   *
   * @param constant true to make the constant sign visible, false otherwise
   * @param random true to make the random sign visible, false otherwise
   * @param proportional true to make the proportional sign visible, false
   * otherwise
   * @return
   */
  public Z4FancifulValueUI setSignsVisible(boolean constant, boolean random, boolean proportional) {
    this.constantSignVisible = constant;
    this.randomSignVisible = random;
    this.proportionalSignVisible = proportional;

    this.setUI();
    return this;
  }

  /**
   * Sets the range of the constant component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setConstantRange(int min, int max) {
    this.constantUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the range of the random component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setRandomRange(int min, int max) {
    this.randomUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the range of the proportional component
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setProportionalRange(int min, int max) {
    this.proportionalUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setRandomLengthRange(int min, int max) {
    this.valueLength.setAttribute("min", "" + min);
    this.valueLength.setAttribute("max", "" + max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
  public Z4FancifulValueUI setValueLabel(String token) {
    $HTMLElement valueLabel = this.querySelector(".fanciful-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the horizontal orientation
   *
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setHorizontal() {
    $HTMLElement element = this.querySelector(".fanciful-container");
    element.classList.remove("fanciful-container-vertical");
    element.classList.add("fanciful-container-horizontal");
    return this;
  }

  /**
   * Sets the vertical orientation
   *
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setVertical() {
    $HTMLElement element = this.querySelector(".fanciful-container");
    element.classList.add("fanciful-container-vertical");
    element.classList.remove("fanciful-container-horizontal");
    return this;
  }

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4NumberUI
   */
  public Z4FancifulValueUI setValue(Z4FancifulValue value) {
    this.fancifulValue = value;

    this.uniformCheck.checked = this.fancifulValue.isUniformSign();

    this.constantUI.setSign(this.fancifulValue.getConstantSign());
    this.constantUI.setValue(this.fancifulValue.getConstantValue());
    this.setUniformSign(this.fancifulValue.getConstantSign());

    this.randomUI.setSign(this.fancifulValue.getRandomSign());
    this.setRandom(this.fancifulValue.getRandomValue());

    this.proportionalUI.setSign(this.fancifulValue.getProportionalSign());
    this.proportionalUI.setValue(this.fancifulValue.getProportionalValue());

    this.setUI();
    return this;
  }

  private void setUI() {
    //    if (visible) {
//      this.querySelector(".fanciful-random").classList.remove("fanciful-random-not-visible");
//    } else {
//      this.querySelector(".fanciful-random").classList.add("fanciful-random-not-visible");
//    }

//    if (visible) {
//      this.querySelector(".fanciful-proportional").classList.remove("fanciful-proportional-not-visible");
//    } else {
//      this.querySelector(".fanciful-proportional").classList.add("fanciful-proportional-not-visible");
//    }
//    boolean bR = this.querySelector(".fanciful-random").classList.contains("fanciful-random-not-visible");
//    boolean bP = this.querySelector(".fanciful-proportional").classList.contains("fanciful-proportional-not-visible");
//
//    this.constantUI.setSignVisible(!this.uniformCheck.checked || (bR && bP));
//    this.randomUI.setSignVisible(!this.constantSignVisible || !this.uniformCheck.checked);
//    this.randomUI.querySelector(".number-group").classList.add("input-group");
//    this.proportionalUI.setSignVisible(!this.constantSignVisible || !this.uniformCheck.checked);
//
//    if (this.constantSignVisible) {
//      this.constantUI.querySelector(".sign-label").classList.remove("sign-label-never-visible");
//      this.constantUI.querySelector(".dropdown-toggle").classList.remove("sign-toggle-never-visible");
////      this.constantUI.querySelector(".form-control").classList.remove("with-sing-not-visible");
//    } else {
//      this.constantUI.querySelector(".sign-label").classList.add("sign-label-never-visible");
//      this.constantUI.querySelector(".dropdown-toggle").classList.add("sign-toggle-never-visible");
////      this.constantUI.querySelector(".form-control").classList.add("with-sing-not-visible");
//    }
//    if (this.randomSignVisible) {
//      this.randomUI.querySelector(".sign-label").classList.remove("sign-label-never-visible");
//      this.randomUI.querySelector(".dropdown-toggle").classList.remove("sign-toggle-never-visible");
////      this.randomUI.querySelector(".form-control").classList.remove("with-sing-not-visible");
//    } else {
//      this.randomUI.querySelector(".sign-label").classList.add("sign-label-never-visible");
//      this.randomUI.querySelector(".dropdown-toggle").classList.add("sign-toggle-never-visible");
////      this.randomUI.querySelector(".form-control").classList.add("with-sing-not-visible");
//    }
//    if (this.proportionalSignVisible) {
//      this.proportionalUI.querySelector(".sign-label").classList.remove("sign-label-never-visible");
//      this.proportionalUI.querySelector(".dropdown-toggle").classList.remove("sign-toggle-never-visible");
////      this.proportionalUI.querySelector(".form-control").classList.remove("with-sing-not-visible");
//    } else {
//      this.proportionalUI.querySelector(".sign-label").classList.add("sign-label-never-visible");
//      this.proportionalUI.querySelector(".dropdown-toggle").classList.add("sign-toggle-never-visible");
////      this.proportionalUI.querySelector(".form-control").classList.add("with-sing-not-visible");
//    }
//
//    if (!this.constantSignVisible || !this.uniformCheck.checked || (bR && bP)) {
//      this.querySelector(".uniform-container").classList.add("uniform-container-not-visible");
//    } else {
//      this.querySelector(".uniform-container").classList.remove("uniform-container-not-visible");
//    }
//
//    if (!this.constantSignVisible || (bR && bP)) {
//      this.querySelector(".uniform-label").classList.add("uniform-label-not-visible");
//      this.uniformCheck.classList.add("uniform-check-not-visible");
//    } else {
//      this.querySelector(".uniform-label").classList.remove("uniform-label-not-visible");
//      this.uniformCheck.classList.remove("uniform-check-not-visible");
//    }
//
//    if (this.constantSignVisible && bR) {
//      this.constantUI.querySelector(".sign-label").classList.add("sign-label-force-visible");
//      this.constantUI.querySelector(".dropdown-toggle").classList.add("sign-toggle-force-visible");
//      this.querySelector(".uniform-container").classList.add("uniform-container-force-not-visible");
//      this.querySelector(".uniform-label").classList.add("uniform-label-force-not-visible");
//      this.uniformCheck.classList.add("uniform-check-force-not-visible");
//    } else {
//      this.constantUI.querySelector(".sign-label").classList.remove("sign-label-force-visible");
//      this.constantUI.querySelector(".dropdown-toggle").classList.remove("sign-toggle-force-visible");
//      this.querySelector(".uniform-container").classList.remove("uniform-container-force-not-visible");
//      this.querySelector(".uniform-label").classList.remove("uniform-label-force-not-visible");
//      this.uniformCheck.classList.remove("uniform-check-force-not-visible");
//    }
  }

  private void setUniformSign(Z4Sign sign) {
    String str;

    if (sign == Z4Sign.POSITIVE) {
      str = "positive";
    } else if (sign == Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (sign == Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }

    this.toggleUniform.setAttribute("data-value", str);
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
  }

  public Z4Sign getUniformSign() {
    switch (this.toggleUniform.getAttribute("data-value")) {
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

  @SuppressWarnings("StringEquality")
  private void setRandom(Z4RandomValue random) {
    String str = null;
    if (random.isClassic()) {
      str = "classic";
    } else if (random.isBezier()) {
      str = "bezier";
    } else if (random.isPolyline()) {
      str = "polyline";
    } else if (random.isStepped()) {
      str = "stepped";
    }

    this.toggleRandom.setAttribute("data-value", str);
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + ".svg");

    this.randomUI.setValue(random.getValue());

    this.querySelector(".divider-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
    this.querySelector(".container-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
    this.valueLength.value = "" + random.getLength();
  }

  private Z4RandomValue getRandom() {
    switch (this.toggleRandom.getAttribute("data-value")) {
      case "classic":
        return Z4RandomValue.classic(this.randomUI.getValue());
      case "bezier":
        return Z4RandomValue.bezier(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      case "polyline":
        return Z4RandomValue.polyline(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      case "stepped":
        return Z4RandomValue.stepped(this.randomUI.getValue(), this.valueLength.valueAsNumber);
      default:
        return null;
    }
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public Z4FancifulValue getValue() {
    return this.fancifulValue;
  }
}
