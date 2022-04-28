package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4RandomValue;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.parseInt;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4ComponentUI<Z4FancifulValue> {

  private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
  private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
  private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");

  private final Z4NumberUI constantUI = new Z4NumberUI();
  private final Z4NumberUI randomUI = new Z4NumberUI();
  private final Z4NumberUI proportionalUI = new Z4NumberUI();

  private final HTMLElement toggleRandom = this.querySelector(".toggle-random");
  private final HTMLElement toggleRandomImg = this.querySelector(".toggle-random img");

  private Z4FancifulValue fancifulValue = new Z4FancifulValue();

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4ColorUI
   */
  public Z4FancifulValueUI() {
    super(Z4FancifulValueUI.UI);

    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) -> {
      this.setUniform(this.uniformCheck.checked);
      this.onchange.$apply(this.fancifulValue.setUniformSign(this.uniformCheck.checked));
      return null;
    };

    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + "-sm.png");

    NodeList imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".png");
    }

    NodeList buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.toggleUniform.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + button.getAttribute("data-value") + "-sm.png");

        this.fancifulValue.setConstant(this.getUniformSign(), this.constantUI.getValue());
        this.constantUI.setSign(this.getUniformSign());
        this.onchange.$apply(this.fancifulValue);
        return null;
      };
    }

    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + this.toggleRandom.getAttribute("data-value") + "-sm.png");

    imgs = this.querySelectorAll(".toggle-random-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".png");
    }

    buttons = this.querySelectorAll(".toggle-random-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.toggleRandom.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + button.getAttribute("data-value") + "-sm.png");

        this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
        this.onchange.$apply(this.fancifulValue);
        return null;
      };
    }

    this.randomUI.querySelector(".number-group").prepend(this.querySelector(".toggle-random-dropdown-menu"));
    this.randomUI.querySelector(".number-group").prepend(this.toggleRandom);
    this.randomUI.querySelector(".sign-label").style.marginLeft = "89px";

    this.constantUI.oninput = (event) -> this.onInput();
    this.randomUI.oninput = (event) -> this.onInput();
    this.proportionalUI.oninput = (event) -> this.onInput();
    this.constantUI.onchange = (event) -> this.onChange();
    this.randomUI.onchange = (event) -> this.onChange();
    this.proportionalUI.onchange = (event) -> this.onChange();

    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT");
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM");
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL");
  }

  private Object onInput() {
    this.setUniformSign(this.constantUI.getSign());

    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());

    this.oninput.$apply(this.fancifulValue);
    return null;
  }

  private Object onChange() {
    this.setUniformSign(this.constantUI.getSign());

    this.fancifulValue.setConstant(this.constantUI.getSign(), this.constantUI.getValue());
    this.fancifulValue.setRandom(this.randomUI.getSign(), this.getRandom());
    this.fancifulValue.setProportional(this.proportionalUI.getSign(), this.proportionalUI.getValue());

    this.onchange.$apply(this.fancifulValue);
    return null;
  }

  /**
   * Sets the range of this Z4NumberUI
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4NumberUI
   */
//  public Z4FancifulValueUI setRange(int min, int max) {
//    this.value.setAttribute("min", "" + min);
//    this.value.setAttribute("max", "" + max);
//    return this;
//  }
//  
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

    this.setUniform(this.fancifulValue.isUniformSign());

    this.constantUI.setSign(this.fancifulValue.getConstantSign());
    this.constantUI.setValue(this.fancifulValue.getConstantValue());
    this.setUniformSign(this.fancifulValue.getConstantSign());

    this.randomUI.setSign(this.fancifulValue.getRandomSign());
    this.setRandom(this.fancifulValue.getRandomValue());

    this.proportionalUI.setSign(this.fancifulValue.getProportionalSign());
    this.proportionalUI.setValue(this.fancifulValue.getProportionalValue());

    return this;
  }

  private void setUniform(boolean uniform) {
    this.uniformCheck.checked = uniform;
    this.constantUI.setSignVisible(!this.uniformCheck.checked);
    this.randomUI.setSignVisible(!this.uniformCheck.checked);
    this.randomUI.querySelector(".number-group").classList.add("input-group");
    this.proportionalUI.setSignVisible(!this.uniformCheck.checked);
    this.querySelector(".uniform-container").style.display = this.uniformCheck.checked ? "block" : "none";
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
    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + "-sm.png");
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
    this.toggleRandomImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4randomvalue_" + str + "-sm.png");
  }

  private Z4RandomValue getRandom() {
    switch (this.toggleRandom.getAttribute("data-value")) {
      case "classic":
        return Z4RandomValue.classic(this.randomUI.getValue());
      case "bezier":
        return Z4RandomValue.bezier(this.randomUI.getValue(), 0);
      case "polyline":
        return Z4RandomValue.polyline(this.randomUI.getValue(), 0);
      case "stepped":
        return Z4RandomValue.stepped(this.randomUI.getValue(), 0);
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
