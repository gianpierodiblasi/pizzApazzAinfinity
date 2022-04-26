package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4NumberUI extends Z4ComponentUI<Object> {

  private final $HTMLElement valueLabel = this.querySelector(".value-label");
  private final HTMLElement toggle = this.querySelector(".dropdown-toggle");
  private final HTMLElement toggleImg = this.querySelector(".dropdown-toggle img");
  private final $HTMLElement value = this.querySelector(".form-control");

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4ComponentUI.loadHTML("giada/pizzapazza/math/ui/Z4NumberUI.html");

  /**
   * Creates a Z4ColorUI
   */
  public Z4NumberUI() {
    super(Z4NumberUI.UI);

    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + "-sm.png");

    NodeList imgs = this.querySelectorAll(".dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".png");
    }

    NodeList buttons = this.querySelectorAll(".dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.toggle.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + button.getAttribute("data-value") + "-sm.png");
        this.onchange.$apply(null);
        return null;
      };
    }

    this.value.oninput = (event) -> {
      this.oninput.$apply(null);
      return null;
    };
    this.value.onchange = (event) -> {
      this.onchange.$apply(null);
      return null;
    };
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
  public Z4NumberUI setValueLabel(String token) {
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
  public Z4NumberUI setSign(Z4Sign sign) {
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

    this.toggle.setAttribute("data-value", str);
    this.toggleImg.setAttribute("src", Z4NumberUI.PATH + "z4sign_" + str + "-sm.png");

    return this;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
  public Z4Sign getSign() {
    switch (this.toggle.getAttribute("data-value")) {
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
  public Z4NumberUI setValue(int value) {
    this.value.value = "" + value;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public Double getValue() {
    return this.value.valueAsNumber;
  }
}
