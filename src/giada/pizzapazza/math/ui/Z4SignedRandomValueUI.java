package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
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
public class Z4SignedRandomValueUI extends Z4AbstractComponentWithValueUI<Z4SignedRandomValue> {

  private final $HTMLElement valueLength = this.querySelector(".type-length");
  private final $HTMLElement spinnerLength = this.querySelector(".type-length-spinner");
  private final Z4SignedValueUI signedValueUI = new Z4SignedValueUI();
  private final HTMLElement valueSpan = this.signedValueUI.querySelector(".value-span");

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
    this.signedValueUI.appendToComponent(this);
    this.signedValueUI.oninput = (signedValue) -> this.oninput.$apply(this.createSignedRandomValue(this.getType()));
    this.signedValueUI.onchange = (signedValue) -> this.onchange.$apply(this.createSignedRandomValue(this.getType()));

    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".btn-group-type-container"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));
    this.signedValueUI.querySelector(".form-expanded").insertBefore(this.querySelector(".container-length"), this.signedValueUI.querySelector(".form-expanded .value-label-fixed"));

    NodeList imgs = this.querySelectorAll(".btn-group-type img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4SignedRandomValueUI.PATH + "z4randomvalue_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".btn-group-type button");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.onchange.$apply(this.createSignedRandomValue(button.getAttribute("data-value")));
        return null;
      };
    }

    this.valueLength.oninput = (event) -> {
      this.oninput.$apply(this.createSignedRandomValue(this.getType()));
      return null;
    };
    this.valueLength.onchange = (event) -> {
      this.onchange.$apply(this.createSignedRandomValue(this.getType()));
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
      this.oninput.$apply(this.createSignedRandomValue(this.getType()));
    }

    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange.$apply(this.createSignedRandomValue(this.getType()));
    }
  }

  /**
   * Sets the compact visualization
   *
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI compact() {
    this.signedValueUI.compact();
    return this;
  }

  /**
   * Sets the range of this Z4SignedRandomValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setRange(int min, int max) {
    this.signedValueUI.setRange(min, max);
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setSignVisible(boolean visible) {
    this.signedValueUI.setSignVisible(visible);
    return this;
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (999999999 to show infinite)
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setLengthRange(int min, int max) {
    this.valueLength.setAttribute("min", "" + min);
    this.valueLength.setAttribute("max", "" + max);
    this.querySelector(".range-length-label").innerHTML = "[" + min + "," + (max == 999999999 ? "&infin;" : max) + "]";
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4SignedRandomValueUI
   */
  public Z4SignedRandomValueUI setValueLabel(String token, boolean bold, boolean italic) {
    this.signedValueUI.setValueLabel(token, bold, italic);
    return this;
  }

  @Override
  @SuppressWarnings({"StringEquality", "unchecked"})
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4SignedRandomValue value) {
    this.value = value;
    this.signedValueUI.setValue(new Z4SignedValue().setValue(this.value.getValue()).setSign(this.value.getSign()));

    if (this.value.isClassic()) {
      this.valueLength.setAttribute("disabled", "disabled");
      this.spinnerLength.setAttribute("disabled", "disabled");
    } else if (this.value.isBezier()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isPolyline()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    } else if (this.value.isStepped()) {
      this.valueLength.removeAttribute("disabled");
      this.spinnerLength.removeAttribute("disabled");
    }
    this.valueLength.value = "" + this.getValue().getLength();

    this.setSpan();
    return (T) this;
  }

  private Z4SignedRandomValue createSignedRandomValue(String str) {
    Z4SignedValue signedValue = this.signedValueUI.getValue();

    switch (str) {
      case "classic":
        this.value = Z4SignedRandomValue.classic(signedValue.getValue()).setSign(signedValue.getSign());
        this.valueLength.setAttribute("disabled", "disabled");
        this.spinnerLength.setAttribute("disabled", "disabled");
        break;
      case "bezier":
        this.value = Z4SignedRandomValue.bezier(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "polyline":
        this.value = Z4SignedRandomValue.polyline(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
      case "stepped":
        this.value = Z4SignedRandomValue.stepped(signedValue.getValue(), this.valueLength.valueAsNumber).setSign(signedValue.getSign());
        this.valueLength.removeAttribute("disabled");
        this.spinnerLength.removeAttribute("disabled");
        break;
    }

    this.setSpan();
    return this.value;
  }

  private String getType() {
    if (this.value.isClassic()) {
      return "classic";
    } else if (this.value.isBezier()) {
      return "bezier";
    } else if (this.value.isPolyline()) {
      return "polyline";
    } else if (this.value.isStepped()) {
      return "stepped";
    } else {
      return null;
    }
  }

  private void setSpan() {
    String sign = "";
    if (!this.signedValueUI.isSignVisible()) {
    } else if (this.value.getSign() == Z4Sign.POSITIVE) {
      sign = "&plus;";
    } else if (this.value.getSign() == Z4Sign.NEGATIVE) {
      sign = "&minus;";
    } else if (this.value.getSign() == Z4Sign.RANDOM) {
      sign = "&plusmn;";
    } else {
      sign = "&plusmn;<sup>&UpArrowDownArrow;</sup>";
    }

    String rnd = "";
    if (this.value.isClassic()) {
      rnd = "rnd";
    } else if (this.value.isBezier()) {
      rnd = "rnd&#8767;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isPolyline()) {
      rnd = "rnd&#8896;<sup>" + this.value.getLength() + "</sup>";
    } else if (this.value.isStepped()) {
      rnd = "rnd&#8851;<sup>" + this.value.getLength() + "</sup>";
    }

    this.valueSpan.innerHTML = sign + rnd + "(" + this.value.getValue() + ")";
  }

  @Override
  public void dispose() {
  }
}
