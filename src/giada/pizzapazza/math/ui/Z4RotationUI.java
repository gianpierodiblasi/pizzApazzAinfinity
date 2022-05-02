package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.parseInt;

/**
 * The component to edit a rotation
 *
 * @author gianpiero.di.blasi
 */
public class Z4RotationUI extends Z4AbstractComponentWithValueUI<Z4Rotation> {

  private final HTMLElement toggleType = this.querySelector(".toggle-type-rotation");
  private final HTMLElement toggleTypeImg = this.querySelector(".toggle-type-rotation img");
  private final Z4SignedValueUI startAngle = new Z4SignedValueUI().setRange(0, 360).setValueLabel("START_ANGLE", true, false).setSignVisible(false).appendToElement(this.querySelector(".start-angle-container"));
  private final $HTMLElement delayedCheck = this.querySelector(".delayed-check");
  private final Z4FancifulValueUI angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setComponentsVisible(true, true, false).setConstantRange(0, 180).setRandomRange(0, 180).appendToComponent(this);

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  public Z4RotationUI() {
    super(Z4RotationUI.UI);

    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + this.toggleType.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".toggle-type-rotation-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".toggle-type-rotation-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        String str = button.getAttribute("data-value");
        this.toggleType.setAttribute("data-value", str);
        this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + str + ".svg");

        switch (str) {
          case "fixed":
            this.value = Z4Rotation.fixed();
            break;
          case "cumulative":
            this.value = Z4Rotation.cumulative();
            break;
          case "relativetopath":
            this.value = Z4Rotation.relativeToPath();
            break;
        }

        this.onchange.$apply(this.value.setAngle(this.angle.getValue()).setStartAngle(this.startAngle.getValue().getValue()).setDelayed(this.delayedCheck.checked));
        return null;
      };
    }

    this.delayedCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) -> {
      this.onchange.$apply(this.value.setDelayed(this.delayedCheck.checked));
      return null;
    };

    this.startAngle.oninput = (start) -> this.oninput.$apply(this.value.setStartAngle(start.getValue()));
    this.startAngle.onchange = (start) -> this.onchange.$apply(this.value.setStartAngle(start.getValue()));
    this.angle.oninput = (a) -> this.oninput.$apply(this.value.setAngle(a));
    this.angle.onchange = (a) -> this.onchange.$apply(this.value.setAngle(a));

    this.setValue(Z4Rotation.fixed());
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4RotationUI
   */
  public Z4RotationUI setRandomLengthRange(int min, int max) {
    this.angle.setRandomLengthRange(min, max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4RotationUI
   */
  public Z4RotationUI setValueLabel(String token, boolean bold, boolean italic) {
    $HTMLElement valueLabel = this.querySelector(".rotation-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the horizontal orientation
   *
   * @return This Z4RotationUI
   */
  public Z4RotationUI setHorizontal() {
    this.angle.setHorizontal();
    return this;
  }

  /**
   * Sets the vertical orientation
   *
   * @return This Z4RotationUI
   */
  public Z4RotationUI setVertical() {
    this.angle.setVertical();
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Rotation value) {
    this.value = value;

    String str = null;
    if (this.value.isFixed()) {
      str = "fixed";
    } else if (this.value.isCumulative()) {
      str = "cumulative";
    } else if (this.value.isRelativeToPath()) {
      str = "relativetopath";
    }
    this.toggleType.setAttribute("data-value", str);
    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + str + ".svg");

    this.delayedCheck.checked = this.value.isDelayed();
    this.startAngle.setValue(new Z4SignedValue().setValue(this.value.getStartAngle()));
    this.angle.setValue(this.value.getAngle());
    return (T) this;
  }
}
