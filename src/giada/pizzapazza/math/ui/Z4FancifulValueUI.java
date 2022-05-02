package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Array;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.parseInt;

/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI<Z4FancifulValue> {

  private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
  private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
  private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");

  private final Z4SignedValueUI constantUI = new Z4SignedValueUI();
  private final Z4SignedRandomValueUI randomUI = new Z4SignedRandomValueUI();
  private final Z4SignedValueUI proportionalUI = new Z4SignedValueUI();

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
  public Z4FancifulValueUI() {
    super(Z4FancifulValueUI.UI);

    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) -> {
      this.setUI();
      this.onchange.$apply(this.value.setUniformSign(this.uniformCheck.checked));
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
        String str = button.getAttribute("data-value");
        this.toggleUniform.setAttribute("data-value", str);
        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");

        this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
        this.onchange.$apply(this.value.setConstant(this.constantUI.getValue()));
        return null;
      };
    }

    this.constantUI.appendTo(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendTo(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendTo(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);

    this.constantUI.oninput = (event) -> this.onInput();
    this.randomUI.oninput = (event) -> this.onInput();
    this.proportionalUI.oninput = (event) -> this.onInput();
    this.constantUI.onchange = (event) -> this.onChange();
    this.randomUI.onchange = (event) -> this.onChange();
    this.proportionalUI.onchange = (event) -> this.onChange();

    this.setValue(new Z4FancifulValue());
  }

  private Object onInput() {
    this.setUniformSign(this.constantUI.getValue().getSign());

    this.oninput.$apply(this.value.
            setConstant(this.constantUI.getValue()).
            setRandom(this.randomUI.getValue()).
            setProportional(this.proportionalUI.getValue())
    );
    return null;
  }

  private Object onChange() {
    this.setUniformSign(this.constantUI.getValue().getSign());

    this.onchange.$apply(this.value.
            setConstant(this.constantUI.getValue()).
            setRandom(this.randomUI.getValue()).
            setProportional(this.proportionalUI.getValue())
    );
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
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setRandomLengthRange(int min, int max) {
    this.randomUI.setLengthRange(min, max);
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
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setValueLabel(String token, boolean bold, boolean italic) {
    $HTMLElement valueLabel = this.querySelector(".fanciful-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
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

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4FancifulValue value) {
    super.setValue(value);

    this.uniformCheck.checked = this.value.isUniformSign();

    this.constantUI.setValue(this.value.getConstant());
    this.setUniformSign(this.value.getConstant().getSign());
    this.randomUI.setValue(this.value.getRandom());
    this.proportionalUI.setValue(this.value.getProportional());

    this.setUI();
    return (T) this;
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

  private Z4Sign getUniformSign(String str) {
    switch (str) {
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
