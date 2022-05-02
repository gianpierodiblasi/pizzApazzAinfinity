package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Rotation;
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

//  private final HTMLElement toggleType = this.querySelector(".toggle-type");
//  private final HTMLElement toggleTypeImg = this.querySelector(".toggle-type img");
//  private final Z4NumberUI startAngle = new Z4NumberUI().setRange(-180, 180).setValueLabel("START_ANGLE").setSignVisible(false).appendTo(this.querySelector(".start-angle-container"));
  private final $HTMLElement delayedCheck = this.querySelector(".delayed-check");
  private final Z4FancifulValueUI angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setComponentsVisible(true, true, false).setConstantRange(0, 180).setRandomRange(0, 180).appendTo(this.root);

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  public Z4RotationUI() {
    super(Z4RotationUI.UI);

//    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + this.toggleType.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".toggle-type-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".toggle-type-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
//        this.toggleType.setAttribute("data-value", button.getAttribute("data-value"));
//        this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + button.getAttribute("data-value") + ".svg");
//
//        Z4FancifulValue angleValue = this.angle.getValue();
//        this.rotation = this.getRotation().
//                setConstant(angleValue.getConstantSign(), angleValue.getConstantValue()).
//                setRandom(angleValue.getRandomSign(), angleValue.getRandomValue()).
//                setUniformSign(angleValue.isUniformSign()).
//                setStartAngle(this.startAngle.getValue()).
//                setDelayed(this.delayedCheck.checked);
//
//        this.onchange.$apply(this.rotation);
        return null;
      };
    }

    this.delayedCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) -> {
//      this.onchange.$apply(this.rotation.setDelayed(this.delayedCheck.checked));
      return null;
    };
//
//    this.startAngle.oninput = (value) -> this.oninput.$apply(this.rotation.setStartAngle(this.startAngle.getValue()));
//    this.startAngle.onchange = (value) -> this.onchange.$apply(this.rotation.setStartAngle(this.startAngle.getValue()));
//
//    this.angle.oninput = (value) -> this.oninput.$apply(this.rotation.
//            setConstant(value.getConstantSign(), value.getConstantValue()).
//            setRandom(value.getRandomSign(), value.getRandomValue()).
//            setUniformSign(value.isUniformSign())
//    );
//    this.angle.onchange = (value) -> this.onchange.$apply(this.rotation.
//            setConstant(value.getConstantSign(), value.getConstantValue()).
//            setRandom(value.getRandomSign(), value.getRandomValue()).
//            setUniformSign(value.isUniformSign())
//    );
//
    this.setValue(Z4Rotation.fixed());
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4RotationUI
   */
//  public Z4RotationUI setRandomLengthRange(int min, int max) {
//    this.angle.setRandomLengthRange(min, max);
//    return this;
//  }
//  
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
    valueLabel.innerText = Z4MessageFactory.get(token);
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
    super.setValue(value);
//
//    this.setRotation(this.rotation);
//    this.delayedCheck.checked = this.rotation.isDelayed();
//    this.startAngle.setValue(this.rotation.getStartAngle());
//    this.angle.setValue(this.rotation.asFancifulValue());
    return (T) this;
  }
//
//  @SuppressWarnings("StringEquality")
//  private void setRotation(Z4Rotation rotation) {
//    String str = null;
//    if (rotation.isFixed()) {
//      str = "fixed";
//    } else if (rotation.isCumulative()) {
//      str = "cumulative";
//    } else if (rotation.isRelativeToPath()) {
//      str = "relativetopath";
//    }
//
//    this.toggleType.setAttribute("data-value", str);
//    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + str + ".svg");
//  }
//
//  private Z4Rotation getRotation() {
//    switch (this.toggleType.getAttribute("data-value")) {
//      case "fixed":
//        return Z4Rotation.fixed();
//      case "cumulative":
//        return Z4Rotation.cumulative();
//      case "relativetopath":
//        return Z4Rotation.relativeToPath();
//      default:
//        return null;
//    }
//  }
}
