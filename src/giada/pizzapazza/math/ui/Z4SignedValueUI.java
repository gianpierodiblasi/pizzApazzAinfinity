package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedValueUI extends Z4AbstractComponentWithValueUI<Z4SignedValue> {

  private final HTMLElement toggle = this.querySelector(".sign-button");
  private final HTMLElement toggleImg = this.querySelector(".sign-button img");
  private final $HTMLElement text = this.querySelector(".value");
  private final $HTMLElement spinner = this.querySelector(".spinner");

  private final $Apply_0_Void applySpin = () -> this.spin();
  private boolean isApplySpin = false;

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  public Z4SignedValueUI() {
    super(Z4SignedValueUI.UI);

    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + this.toggle.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        String str = button.getAttribute("data-value");
        this.toggle.setAttribute("data-value", str);
        this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");

        switch (str) {
          case "positive":
            this.onchange.$apply(this.value.setSign(Z4Sign.POSITIVE));
            break;
          case "negative":
            this.onchange.$apply(this.value.setSign(Z4Sign.NEGATIVE));
            break;
          case "random":
            this.onchange.$apply(this.value.setSign(Z4Sign.RANDOM));
            break;
          case "alternate":
            this.onchange.$apply(this.value.setSign(Z4Sign.alternate()));
            break;
        }

        return null;
      };
    }

    this.text.oninput = (event) -> {
      this.oninput.$apply(this.value.setValue(this.text.valueAsNumber));
      return null;
    };
    this.text.onchange = (event) -> {
      this.onchange.$apply(this.value.setValue(this.text.valueAsNumber));
      return null;
    };
    this.text.onfocus = (event) -> {
      this.text.select();
      return null;
    };

    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) -> this.startSpin();
      this.spinner.ontouchend = (event) -> this.stopSpin();
    } else {
      this.spinner.onmousedown = (event) -> this.startSpin();
      this.spinner.onmouseup = (event) -> this.stopSpin();
    }

    this.setValue(new Z4SignedValue());
  }

  private Object startSpin() {
    this.isApplySpin = true;
    this.applySpin.$apply();
    return null;
  }

  private Object stopSpin() {
    this.isApplySpin = false;
    this.spinner.value = "0";
    return null;
  }

  private void spin() {
    double min = parseFloat(this.text.getAttribute("min"));
    double max = parseFloat(this.text.getAttribute("max"));

    double v = this.spinner.valueAsNumber;
    double abs = 1;

    if ($exists(v)) {
      abs = Math.abs(v);

      v = Math.max(min, this.text.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);

      this.text.value = "" + v;
      this.oninput.$apply(this.value.setValue(this.text.valueAsNumber));
    }

    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange.$apply(this.value.setValue(this.text.valueAsNumber));
    }
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setRange(int min, int max) {
    this.text.setAttribute("min", "" + min);
    this.text.setAttribute("max", "" + max);
    this.querySelector(".range-label").innerText = "[" + min + "," + (max == 999999999 ? "&infin;" : max) + "]";

    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setSignVisible(boolean visible) {
    if (visible) {
      this.querySelector(".sign-label").classList.remove("sign-label-not-visible");
      this.toggle.classList.remove("sign-toggle-not-visible");
    } else {
      this.querySelector(".sign-label").classList.add("sign-label-not-visible");
      this.toggle.classList.add("sign-toggle-not-visible");
    }

    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setValueLabel(String token, boolean bold, boolean italic) {
    $HTMLElement valueLabel = this.querySelector(".value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4SignedValue value) {
    super.setValue(value);

    String str;
    if (value.getSign() == Z4Sign.POSITIVE) {
      str = "positive";
    } else if (value.getSign() == Z4Sign.NEGATIVE) {
      str = "negative";
    } else if (value.getSign() == Z4Sign.RANDOM) {
      str = "random";
    } else {
      str = "alternate";
    }

    this.toggle.setAttribute("data-value", str);
    this.toggleImg.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + str + ".svg");

    this.text.value = "" + value.getValue();
    return (T) this;
  }
}
