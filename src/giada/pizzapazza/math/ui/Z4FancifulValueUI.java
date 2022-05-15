package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.js.Array;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.document;
import simulation.js.$MutationObserver;
import simulation.js.$Object;

/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI<Z4FancifulValue> {

  private final HTMLElement valueSpan = this.querySelector(".fanciful-value-span");

//  private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
//  private final HTMLElement toggleUniform = this.querySelector(".toggle-uniform");
//  private final HTMLElement toggleUniformImg = this.querySelector(".toggle-uniform img");
//
  private final Z4SignedValueUI constantUI = new Z4SignedValueUI();
  private final Z4SignedRandomValueUI randomUI = new Z4SignedRandomValueUI();
  private final Z4SignedValueUI proportionalUI = new Z4SignedValueUI();
//
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.setSpan());
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

//    this.uniformCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
//    this.querySelector(".uniform-label").setAttribute("for", this.uniformCheck.id);
//    this.uniformCheck.onchange = (event) -> {
//      this.setUI();
//      this.onchange.$apply(this.value.setUniformSign(this.uniformCheck.checked));
//      return null;
//    };
//
//    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + this.toggleUniform.getAttribute("data-value") + ".svg");
//
//    NodeList imgs = this.querySelectorAll(".toggle-uniform-dropdown-menu img");
//    for (int i = 0; i < imgs.length; i++) {
//      HTMLElement img = (HTMLElement) imgs.item(i);
//      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
//    }
//
//    NodeList buttons = this.querySelectorAll(".toggle-uniform-dropdown-menu .dropdown-item");
//    for (int i = 0; i < buttons.length; i++) {
//      HTMLElement button = (HTMLElement) buttons.item(i);
//      button.onclick = (event) -> {
//        String str = button.getAttribute("data-value");
//        this.toggleUniform.setAttribute("data-value", str);
//        this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
//
//        this.constantUI.setValue(this.constantUI.getValue().setSign(this.getUniformSign(str)));
//        this.onchange.$apply(this.value.setConstant(this.constantUI.getValue()));
//        return null;
//      };
//    }
//
    this.constantUI.appendToElement(this.querySelector(".fanciful-costant"));
    this.constantUI.setValueLabel("CONSTANT", false, true);
    this.randomUI.appendToElement(this.querySelector("div.fanciful-random"));
    this.randomUI.setValueLabel("RANDOM", false, true);
    this.proportionalUI.appendToElement(this.querySelector(".fanciful-proportional"));
    this.proportionalUI.setValueLabel("PROPORTIONAL", false, true);

    this.constantUI.oninput = (event) -> this.onInput();
    this.randomUI.oninput = (event) -> this.onInput();
    this.proportionalUI.oninput = (event) -> this.onInput();
    this.constantUI.onchange = (event) -> this.onChange();
    this.randomUI.onchange = (event) -> this.onChange();
    this.proportionalUI.onchange = (event) -> this.onChange();

    Array<String> array = new Array<>("class");
    $Object observerConfig = new $Object();
    observerConfig.$set("attributes", true);
    observerConfig.$set("attributeFilter", array);
    this.mutationObserver.observe(document.querySelector("body"), observerConfig);

    this.setValue(new Z4FancifulValue());
  }

  private Object onInput() {
    this.setUniformSign(this.constantUI.getValue().getSign());

    this.value.
            setConstant(this.constantUI.getValue()).
            setRandom(this.randomUI.getValue()).
            setProportional(this.proportionalUI.getValue());

    this.setSpan();
    this.oninput.$apply(this.value);
    return null;
  }

  private Object onChange() {
    this.setUniformSign(this.constantUI.getValue().getSign());

    this.value.
            setConstant(this.constantUI.getValue()).
            setRandom(this.randomUI.getValue()).
            setProportional(this.proportionalUI.getValue());

    this.setSpan();
    this.onchange.$apply(this.value);
    return null;
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI compact() {
    this.valueSpan.classList.remove("fanciful-value-not-compact");

    this.querySelector(".form-compact .dropdown-toggle-split").style.display = "inline-block";
    this.querySelector(".form-expanded").classList.add("mx-1");
    this.querySelector(".form-compact .dropdown-menu").appendChild(this.querySelector(".form-expanded"));
    return this;
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
    this.setSpan();
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
    this.setSpan();
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
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4FancifulValue value) {
    this.value = value;
//
//    this.uniformCheck.checked = this.value.isUniformSign();
//
    this.constantUI.setValue(this.value.getConstant());
    this.setUniformSign(this.value.getConstant().getSign());
    this.randomUI.setValue(this.value.getRandom());
    this.proportionalUI.setValue(this.value.getProportional());

    this.setUI();
    this.setSpan();
    return (T) this;
  }
//

  private void setUI() {
//    this.selector.forEach(sel -> {
//      this.querySelector(".fanciful-label").classList.remove(sel);
//      this.querySelector(".form-check").classList.remove(sel);
//      this.querySelector(".fanciful-container").classList.remove(sel);
//    });
//
//    this.selector = new Array<>(
//            "cv-" + this.constantVisible,
//            "rv-" + this.randomVisible,
//            "pv-" + this.proportionalVisible,
//            "csv-" + this.constantSignVisible,
//            "rsv-" + this.randomSignVisible,
//            "psv-" + this.proportionalSignVisible,
//            "u-" + this.uniformCheck.checked
//    );
//
//    this.selector.forEach(sel -> {
//      this.querySelector(".fanciful-label").classList.add(sel);
//      this.querySelector(".form-check").classList.add(sel);
//      this.querySelector(".fanciful-container").classList.add(sel);
//    });
  }
//

  private void setUniformSign(Z4Sign sign) {
//    String str;
//
//    if (sign == Z4Sign.POSITIVE) {
//      str = "positive";
//    } else if (sign == Z4Sign.NEGATIVE) {
//      str = "negative";
//    } else if (sign == Z4Sign.RANDOM) {
//      str = "random";
//    } else {
//      str = "alternate";
//    }
//
//    this.toggleUniform.setAttribute("data-value", str);
//    this.toggleUniformImg.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + str + ".svg");
  }
//
//  private Z4Sign getUniformSign(String str) {
//    switch (str) {
//      case "positive":
//        return Z4Sign.POSITIVE;
//      case "negative":
//        return Z4Sign.NEGATIVE;
//      case "random":
//        return Z4Sign.RANDOM;
//      case "alternate":
//        return Z4Sign.alternate();
//      default:
//        return null;
//    }
//  }
//  

  private void setSpan() {
//    if (!this.signVisible) {
//      this.valueSpan.innerHTML = "" + this.value.getValue();
//    } else if (this.value.getSign() == Z4Sign.POSITIVE) {
//      this.valueSpan.innerHTML = "&plus;" + this.value.getValue();
//    } else if (this.value.getSign() == Z4Sign.NEGATIVE) {
//      this.valueSpan.innerHTML = "&minus;" + this.value.getValue();
//    } else if (this.value.getSign() == Z4Sign.RANDOM) {
//      this.valueSpan.innerHTML = "&plusmn;" + this.value.getValue();
//    } else {
//      this.valueSpan.innerHTML = "&plusmn;<sup>&UpArrowDownArrow;</sup>" + this.value.getValue();
//    }
    if (Z4Setting.isLiteMode()) {
      this.valueSpan.innerHTML = "10 lite";
    } else if (Z4Setting.isStandardMode()) {
      this.valueSpan.innerHTML = "10 standard";
    } else if (Z4Setting.isProMode()) {
      this.valueSpan.innerHTML = "10 pro";
    }

//    if (Z4Setting.isLiteMode()) {
//      return this.constant.next();
//    } else if (Z4Setting.isStandardMode()) {
//      if (this.uniformSign) {
//        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned());
//      } else {
//        return this.constant.next() + this.random.nextSigned();
//      }
//    } else if (Z4Setting.isProMode()) {
//      if (this.uniformSign) {
//        return this.constant.getSign().next() * (this.constant.getValue() + this.random.nextUnsigned() + sensibility * this.proportional.getValue());
//      } else {
//        return this.constant.next() + this.random.nextSigned() + sensibility * this.proportional.next();
//      }
//    } else {
//      return 0;
//    }
  }

  @Override
  public void dispose() {
    this.mutationObserver.unobserve(document.querySelector("body"));
  }
}
