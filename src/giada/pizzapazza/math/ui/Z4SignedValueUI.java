package giada.pizzapazza.math.ui;

import static def.dom.Globals.clearTimeout;
import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_2_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a signed value
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedValueUI extends Z4AbstractComponentWithValueUI<Z4SignedValue> {

  private final $HTMLElement valueLabel = this.querySelector(".signed-value-value-label");
  private final $HTMLElement radioSpinner = this.querySelector(".signed-value-radio-spinner");
  private final $HTMLElement radioRange = this.querySelector(".signed-value-radio-range");
  private final $HTMLElement spinner = this.querySelector(".signed-value-range-input");

  private final $Apply_0_Void applySpin = () -> this.spin();
  private final $Apply_2_Void<Integer, Double> applyMinusPlus = (sign, speed) -> this.doMinusPlus(sign, speed, this.isApplyMinusPlus, () -> this.applyMinusPlus.$apply(sign, Math.min(50, speed + 1)));
  private boolean isApplySpin;
  private boolean isApplyMinusPlus;
  private int timeoutID;

  private boolean signVisible = true;
  private int min = 0;
  private int max = 1000000000;

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4SignedValueUI.html");

  /**
   * Creates a Z4SignedValueUI
   */
  public Z4SignedValueUI() {
    super(Z4SignedValueUI.UI);

    NodeList imgs = this.querySelectorAll(".signed-value-sign-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4SignedValueUI.PATH + "z4sign_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".signed-value-sign-dropdown-menu button");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.querySelector(".signed-value-sign-button img").setAttribute("src", button.querySelector("img").getAttribute("src"));

        switch (button.getAttribute("data-value")) {
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

    String name = this.getUniqueName();
    this.radioSpinner.id = this.getUniqueID();
    this.radioSpinner.setAttribute("name", name);
    this.radioSpinner.onchange = (event) -> {
      this.spinner.setAttribute("min", "-50");
      this.spinner.setAttribute("max", "50");
      this.spinner.value = "0";

      return null;
    };
    this.querySelector(".signed-value-radio-spinner-label").setAttribute("for", this.radioSpinner.id);

    this.radioRange.id = this.getUniqueID();
    this.radioRange.setAttribute("name", name);
    this.radioRange.onchange = (event) -> {
      this.configureRange();
      return null;
    };
    this.querySelector(".signed-value-radio-range-label").setAttribute("for", this.radioRange.id);

    $HTMLElement minus = this.querySelector(".signed-value-range-minus");
    $HTMLElement plus = this.querySelector(".signed-value-range-plus");

    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) -> this.startSpin();
      this.spinner.ontouchend = (event) -> this.stopSpin();
      minus.ontouchstart = (event) -> this.minusPlus(-1);
      minus.ontouchend = (event) -> this.minusPlus(0);
      plus.ontouchstart = (event) -> this.minusPlus(1);
      plus.ontouchend = (event) -> this.minusPlus(0);
    } else {
      this.spinner.onmousedown = (event) -> this.startSpin();
      this.spinner.onmouseup = (event) -> this.stopSpin();
      minus.onmousedown = (event) -> this.minusPlus(-1);
      minus.onmouseup = (event) -> this.minusPlus(0);
      minus.onmouseleave = (event) -> this.minusPlus(0);
      plus.onmousedown = (event) -> this.minusPlus(1);
      plus.onmouseup = (event) -> this.minusPlus(0);
      plus.onmouseleave = (event) -> this.minusPlus(0);
    }

    this.spinner.oninput = (event) -> {
      if (this.radioRange.checked) {
        int v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.oninput.$apply(this.value.setValue(v));
      }
      return null;
    };
    this.spinner.onchange = (event) -> {
      if (this.radioRange.checked) {
        int v = this.getReversedValue(this.spinner.valueAsNumber);
        this.valueLabel.innerText = "" + v;
        this.onchange.$apply(this.value.setValue(v));
      }
      return null;
    };
        
    this.setValue(new Z4SignedValue());
    this.configureRange();
  }

  private Object startSpin() {
    if (this.radioSpinner.checked) {
      this.isApplySpin = true;
      this.applySpin.$apply();
    }
    return null;
  }

  private Object stopSpin() {
    if (this.radioSpinner.checked) {
      this.isApplySpin = false;
      this.spinner.value = "0";
      this.onchange.$apply(this.value);
    }
    return null;
  }

  private void spin() {
    double abs = Math.max(1, Math.abs(this.spinner.valueAsNumber));

    if ($exists(this.spinner.valueAsNumber)) {
      this.doMinusPlus(this.spinner.valueAsNumber > 0 ? 1 : -1, abs, this.isApplySpin, this.applySpin);
    } else {
      clearTimeout(this.timeoutID);
      if (this.isApplySpin) {
        this.timeoutID = setTimeout(this.applySpin, 500 / abs);
      }
    }
  }

  private Object minusPlus(int sign) {
    if ($exists(sign)) {
      this.isApplyMinusPlus = true;
      this.applyMinusPlus.$apply(sign, 1.0);
    } else {
      this.isApplyMinusPlus = false;
      clearTimeout(this.timeoutID);
      this.onchange.$apply(this.value);
    }
    return null;
  }

  private void doMinusPlus(int sign, double speed, boolean isApply, $Apply_0_Void apply) {
    int rangedMax = this.getRangedValue(this.max);
    int rangedValue = Math.max(0, this.getRangedValue(this.value.getValue()) + sign);
    rangedValue = Math.min(rangedValue, rangedMax);
    int reversedValue = this.getReversedValue(rangedValue);

    this.valueLabel.innerText = "" + reversedValue;
    if (this.radioRange.checked) {
      this.spinner.value = "" + rangedValue;
    }

    this.oninput.$apply(this.value.setValue(reversedValue));
    clearTimeout(this.timeoutID);
    if (isApply) {
      this.timeoutID = setTimeout(apply, 500 / speed);
    }
  }

  /**
   * Sets the range of this Z4SignedValueUI
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value (1000000000 to show infinite)
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setRange(int min, int max) {
    this.min = min;
    this.max = max;

    this.querySelector(".signed-value-range-span").innerHTML = "[" + min + "," + (max == 1000000000 ? "&infin;" : max) + "]";
    if (this.radioRange.checked) {
      this.configureRange();
    }
    return this;
  }

  private void configureRange() {
    this.spinner.setAttribute("min", "0");
    this.spinner.setAttribute("max", "" + this.getRangedValue(this.max));
    this.spinner.value = "" + this.getRangedValue(this.value.getValue());
  }

  private int getRangedValue(double limit) {
    int count = 0;
    int counter = this.min;
    while (counter < limit) {
      count++;

      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }

    return count;
  }

  private int getReversedValue(double limit) {
    int count = 0;
    int counter = this.min;
    while (count < limit) {
      count++;

      if (counter < 100) {
        counter++;
      } else if (counter < 1000) {
        counter += 10;
      } else if (counter < 10000) {
        counter += 100;
      } else if (counter < 100000) {
        counter += 1000;
      } else if (counter < 1000000) {
        counter += 10000;
      } else if (counter < 10000000) {
        counter += 100000;
      } else if (counter < 100000000) {
        counter += 1000000;
      } else if (counter < 1000000000) {
        counter += 10000000;
      }
    }

    return counter;
  }

  /**
   * Sets the compact mode
   *
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setCompact() {
    this.querySelector(".signed-value-compact-button").style.display = "inline-block";

    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-range-minus"));
    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-form-control"));
    this.querySelector(".signed-value-compact-dropdown-menu li").appendChild(this.querySelector(".signed-value-range-plus"));

    this.querySelector(".signed-value-sign-button img").setAttribute("width", "20");
    
    return this;
  }

  /**
   * Enables this Z4SignedValueUI
   *
   * @param b true to enable this Z4SignedValueUI, false otherwise
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setEnabled(boolean b) {
    if (b) {
      this.querySelector(".signed-value-radio-spinner").removeAttribute("disabled");
      this.querySelector(".signed-value-radio-range").removeAttribute("disabled");
      this.querySelector(".signed-value-sign-button").removeAttribute("disabled");
      this.querySelector(".signed-value-compact-button").removeAttribute("disabled");
      this.querySelector(".signed-value-range-minus").removeAttribute("disabled");
      this.querySelector(".signed-value-range-input").removeAttribute("disabled");
      this.querySelector(".signed-value-range-plus").removeAttribute("disabled");
    } else {
      this.querySelector(".signed-value-radio-spinner").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-radio-range").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-sign-button").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-compact-button").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-minus").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-input").setAttribute("disabled", "disabled");
      this.querySelector(".signed-value-range-plus").setAttribute("disabled", "disabled");
    }

    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setSignVisible(boolean visible) {
    this.signVisible = visible;
    if (visible) {
      this.querySelector(".signed-value-input-group").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".signed-value-input-group").classList.add("sign-not-visible");
    }

    return this;
  }

  /**
   * Checks if the sign is visible
   *
   * @return true if the sign is visible, false otherwise
   */
  public boolean isSignVisible() {
    return this.signVisible;
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
    $HTMLElement label = this.querySelector(".signed-value-label");
    label.setAttribute("data-token-lang-inner_text", token);
    label.innerHTML = Z4MessageFactory.get(token);
    label.style.fontWeight = bold ? "700" : "400";
    label.style.fontStyle = italic ? "italic" : "normal";

    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4SignedValue value) {
    this.value = value;
    this.valueLabel.innerText = "" + this.value.getValue();

    if (this.value.getSign() == Z4Sign.POSITIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='positive']").getAttribute("src"));
    } else if (this.value.getSign() == Z4Sign.NEGATIVE) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='negative']").getAttribute("src"));
    } else if (this.value.getSign() == Z4Sign.RANDOM) {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='random']").getAttribute("src"));
    } else {
      this.querySelector(".signed-value-sign-button img").setAttribute("src", this.querySelector(".signed-value-sign-dropdown-menu img[data-icon='alternate']").getAttribute("src"));
    }

    return (T) this;
  }

  @Override
  public void dispose() {
  }
}
