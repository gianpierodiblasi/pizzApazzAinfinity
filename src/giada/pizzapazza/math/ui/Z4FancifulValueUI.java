package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Array;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import simulation.js.$MutationObserver;
import simulation.js.$Object;

/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI<Z4FancifulValue> {

//  private final HTMLElement valueSpan = this.querySelector(".fanciful-value-span");
//  private final $HTMLElement uniformCheck = this.querySelector(".uniform-check");
//
  private final Z4SignedValueUI constantUI = new Z4SignedValueUI();
  private final Z4SignedRandomValueUI randomUI = new Z4SignedRandomValueUI();
//
//  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.setSpan());
//  private boolean constantSignVisible = true;
//  private boolean randomSignVisible = true;
//  private boolean constantVisible = true;
//  private boolean randomVisible = true;
//  private Array<String> selector = new Array<>();
//
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
//      this.value.setUniformSign(this.uniformCheck.checked);
//
//      this.setUI();
//      this.setSpan();
//      this.onchange.$apply(this.value);
//      return null;
//    };
//
//    NodeList imgs = this.querySelectorAll(".btn-group-uniform img");
//    for (int i = 0; i < imgs.length; i++) {
//      HTMLElement img = (HTMLElement) imgs.item(i);
//      img.setAttribute("src", Z4FancifulValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
//    }
//
//    NodeList buttons = this.querySelectorAll(".btn-group-uniform button");
//    for (int i = 0; i < buttons.length; i++) {
//      HTMLElement button = (HTMLElement) buttons.item(i);
//      button.onclick = (event) -> {
//        switch (button.getAttribute("data-value")) {
//          case "positive":
//            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.POSITIVE));
//            break;
//          case "negative":
//            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.NEGATIVE));
//            break;
//          case "random":
//            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.RANDOM));
//            break;
//          case "alternate":
//            this.constantUI.setValue(this.constantUI.getValue().setSign(Z4Sign.alternate()));
//            break;
//        }
//        this.value.setConstant(this.constantUI.getValue());
//
//        this.setUI();
//        this.setSpan();
//        this.onchange.$apply(this.value);
//        return null;
//      };
//    }
//
//    this.constantUI.appendToElement(this.querySelector(".fanciful-costant"));
//    this.constantUI.setValueLabel("CONSTANT", false, true);
//    this.randomUI.appendToElement(this.querySelector("div.fanciful-random"));
//    this.randomUI.setValueLabel("RANDOM", false, true);
//
//    this.constantUI.oninput = (event) -> this.onInput();
//    this.randomUI.oninput = (event) -> this.onInput();
//    this.constantUI.onchange = (event) -> this.onChange();
//    this.randomUI.onchange = (event) -> this.onChange();
//
//    NodeList spans = this.querySelectorAll(".value-span");
//    for (int i = 0; i < spans.length; i++) {
//      ((HTMLElement) spans.item(i)).style.display = "none";
//    }
//
//    Array<String> array = new Array<>("class");
//    $Object observerConfig = new $Object();
//    observerConfig.$set("attributes", true);
//    observerConfig.$set("attributeFilter", array);
//    this.mutationObserver.observe(document.querySelector("body"), observerConfig);

    this.setValue(new Z4FancifulValue());
  }

  private Object onInput() {
//    this.value.
//            setConstant(this.constantUI.getValue()).
//            setRandom(this.randomUI.getValue()).
//
//    this.oninput.$apply(this.value);
    return null;
  }

  private Object onChange() {
//    this.value.
//            setConstant(this.constantUI.getValue()).
//            setRandom(this.randomUI.getValue());
//
//    this.setSpan();
//    this.onchange.$apply(this.value);
    return null;
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI compact() {
//    this.valueSpan.classList.remove("fanciful-value-not-compact");
//
//    this.querySelector(".form-compact .dropdown-toggle-split").style.display = "inline-block";
//    this.querySelector(".form-expanded").classList.add("mx-1");
//    this.querySelector(".form-compact .dropdown-menu").appendChild(this.querySelector(".form-expanded"));
    return this;
  }

  /**
   * Sets the visibility of the components
   *
   * @param constant true to make the constant component visible, false
   * otherwise
   * @param random true to make the random component visible, false otherwise
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setComponentsVisible(boolean constant, boolean random) {
//    this.constantVisible = constant;
//    this.randomVisible = random;
//
//    this.setUI();
//    this.setSpan();
    return this;
  }

  /**
   * Sets the visibility of the signs
   *
   * @param constant true to make the constant sign visible, false otherwise
   * @param random true to make the random sign visible, false otherwise
   * otherwise
   * @return
   */
  public Z4FancifulValueUI setSignsVisible(boolean constant, boolean random) {
//    this.constantSignVisible = constant;
//    this.randomSignVisible = random;
//
//    this.setUI();
//    this.setSpan();
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
//    this.constantUI.setRange(min, max);
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
//    this.randomUI.setRange(min, max);
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
//    this.randomUI.setLengthRange(min, max);
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
//    $HTMLElement valueLabel = this.querySelector(".fanciful-label");
//    valueLabel.setAttribute("data-token-lang-inner_text", token);
//    valueLabel.innerHTML = Z4MessageFactory.get(token);
//    valueLabel.style.fontWeight = bold ? "700" : "400";
//    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4FancifulValue value) {
    this.value = value;

//    this.uniformCheck.checked = this.value.isUniformSign();
//    this.constantUI.setValue(this.value.getConstant());
//    this.randomUI.setValue(this.value.getRandom());
//
//    this.setUI();
//    this.setSpan();
    return (T) this;
  }

  private void setUI() {
//    this.selector.forEach(sel -> {
//      this.querySelector(".fanciful-container").classList.remove(sel);
//    });
//
//    this.selector = new Array<>(
//            "cv-" + this.constantVisible,
//            "rv-" + this.randomVisible,
//            "csv-" + this.constantSignVisible,
//            "rsv-" + this.randomSignVisible,
//            "u-" + this.uniformCheck.checked
//    );
//
//    this.selector.forEach(sel -> {
//      this.querySelector(".fanciful-container").classList.add(sel);
//    });
  }

//  private String decodeSign(Z4Sign sign) {
//    if (sign == Z4Sign.POSITIVE) {
//      return "&plus;";
//    } else if (sign == Z4Sign.NEGATIVE) {
//      return "&minus;";
//    } else if (sign == Z4Sign.RANDOM) {
//      return "&plusmn;";
//    } else {
//      return "&plusmn;<sup>&UpArrowDownArrow;</sup>";
//    }
//  }

//  private String decodeRandom(Z4SignedRandomValue value) {
//    if (value.isClassic()) {
//      return "rnd";
//    } else if (value.isBezier()) {
//      return "rnd&#8767;<sup>" + value.getLength() + "</sup>";
//    } else if (value.isPolyline()) {
//      return "rnd&#8896;<sup>" + value.getLength() + "</sup>";
//    } else if (value.isStepped()) {
//      return "rnd&#8851;<sup>" + value.getLength() + "</sup>";
//    } else {
//      return "";
//    }
//  }

  @Override
  public void dispose() {
//    this.mutationObserver.unobserve(document.querySelector("body"));
  }
}
