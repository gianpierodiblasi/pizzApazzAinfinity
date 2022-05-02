package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Array;
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
 * The component to edit a fanciful value
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

  private Z4FancifulValue fancifulValue = new Z4FancifulValue();
  private boolean constantSignVisible = true;
  private boolean randomSignVisible = true;
  private boolean proportionalSignVisible = true;
  private boolean constantVisible = true;
  private boolean randomVisible = true;
  private boolean proportionalVisible = true;
  private Array<String> selector = new Array<>();

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

    

    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT");
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM");
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL");

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
   * @return This Z4FancifulValueUI
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
   * @return This Z4FancifulValueUI
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
    this.selector.forEach(sel -> {
      this.querySelector(".fanciful-label").classList.remove(sel);
      this.querySelector(".form-check").classList.remove(sel);
      this.querySelector(".fanciful-container").classList.remove(sel);
    });

    this.selector = new Array<>(
            "cv-" + this.constantVisible,
            "rv-" + this.randomVisible,
            "pv-" + this.proportionalVisible,
            "csv-" + this.constantSignVisible,
            "rsv-" + this.randomSignVisible,
            "psv-" + this.proportionalSignVisible,
            "u-" + this.uniformCheck.checked
    );

    this.selector.forEach(sel -> {
      this.querySelector(".fanciful-label").classList.add(sel);
      this.querySelector(".form-check").classList.add(sel);
      this.querySelector(".fanciful-container").classList.add(sel);
    });
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

  /**
   * Returns the value
   *
   * @return The value
   */
  public Z4FancifulValue getValue() {
    return this.fancifulValue;
  }
}
