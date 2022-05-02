package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a signed random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI<Z4SignedRandomValue, Z4SignedRandomValueUI> {

  private final HTMLElement toggleType = this.querySelector(".toggle-type");
  private final HTMLElement toggleTypeImg = this.querySelector(".toggle-type img");
  private final $HTMLElement valueLength = this.querySelector(".type-length");
  private final $HTMLElement spinnerLength = this.querySelector(".type-length-spinner");
  private final Z4SignedValueUI signedValueUI = new Z4SignedValueUI();

  private final $Apply_0_Void applySpin = () -> this.spin();
  private boolean isApplySpin = false;

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedRandomValueUI.html");

  /**
   * Creates a Z4SignedRandomValueUI
   */
  @SuppressWarnings("StringEquality")
  public Z4SignedRandomValueUI() {
    super(Z4SignedRandomValueUI.UI);
    this.signedValueUI.appendTo(this.root);

    this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + this.toggleType.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".toggle-type-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".toggle-type-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        String str = button.getAttribute("data-value");
        this.toggleType.setAttribute("data-value", str);
        this.toggleTypeImg.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + str + ".svg");

        this.querySelector(".divider-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
        this.querySelector(".container-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings

        this.onchange.$apply(this.createSignedRandomValue(str));
        return null;
      };
    }

    this.valueLength.oninput = (event) -> {
      this.oninput.$apply(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
      return null;
    };
    this.valueLength.onchange = (event) -> {
      this.onchange.$apply(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
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

    this.signedValueUI.root.prepend(this.querySelector(".type-label"));
    this.querySelector(".number-group").prepend(this.querySelector(".toggle-type-dropdown-menu"));
    this.querySelector(".number-group").prepend(this.toggleType);
    this.querySelector(".sign-label").style.width = "50px";

    this.setValue(Z4SignedRandomValue.classic(0));
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
      this.oninput.$apply(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }

    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange.$apply(this.createSignedRandomValue(this.toggleType.getAttribute("data-value")));
    }
  }

  private Z4SignedRandomValue createSignedRandomValue(String str) {
    Z4SignedValue signedValue = this.signedValueUI.getValue();
    switch (str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        break;
    }
    return this.value;
  }
}
