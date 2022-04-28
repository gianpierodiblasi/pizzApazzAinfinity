package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import static def.js.Globals.parseFloat;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4NumberUI extends Z4ComponentUI<Object> {
  
  private final HTMLElement toggle = this.querySelector(".dropdown-toggle");
  private final HTMLElement toggleImg = this.querySelector(".dropdown-toggle img");
  private final $HTMLElement value = this.querySelector(".form-control");
  private final $HTMLElement spinner = this.querySelector(".form-range");
  
  private final $Apply_0_Void applySpin = () -> this.spin();
  private boolean isApplySpin = false;
  
  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4NumberUI.html");

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
    this.value.onfocus = (event) -> {
      this.value.select();
      return null;
    };
    
    if (Z4Loader.touch) {
      this.spinner.ontouchstart = (event) -> this.startSpin();
      this.spinner.ontouchend = (event) -> this.stopSpin();
    } else {
      this.spinner.onmousedown = (event) -> this.startSpin();
      this.spinner.onmouseup = (event) -> this.stopSpin();
    }
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
    double min = parseFloat(this.value.getAttribute("min"));
    double max = parseFloat(this.value.getAttribute("max"));
    
    double v = this.spinner.valueAsNumber;
    double abs = 1;
    
    if ($exists(v)) {
      abs = Math.abs(v);
      
      v = Math.max(min, this.value.valueAsNumber + (v > 0 ? 1 : -1));
      v = Math.min(v, max);
      
      this.value.value = "" + v;
      this.oninput.$apply(null);
    }
    
    if (this.isApplySpin) {
      setTimeout(this.applySpin, 500 / abs);
    } else {
      this.onchange.$apply(null);
    }
  }

  /**
   * Sets the range of this Z4NumberUI
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4NumberUI
   */
  public Z4NumberUI setRange(int min, int max) {
    this.value.setAttribute("min", "" + min);
    this.value.setAttribute("max", "" + max);
    return this;
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4NumberUI
   */
  public Z4NumberUI setSignVisible(boolean visible) {
    this.querySelector(".sign-label").style.display = visible ? "inline-block" : "none";
    this.toggle.style.display = visible ? "inline-block" : "none";
    
    if (visible) {
      this.querySelector(".number-group").classList.add("input-group");
    } else {
      this.querySelector(".number-group").classList.remove("input-group");
    }
    
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @return This Z4NumberUI
   */
  public Z4NumberUI setValueLabel(String token) {
    $HTMLElement valueLabel = this.querySelector(".value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
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
  public Z4NumberUI setValue(double value) {
    this.value.value = "" + value;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public double getValue() {
    return this.value.valueAsNumber;
  }
}
