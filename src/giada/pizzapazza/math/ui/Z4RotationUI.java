package giada.pizzapazza.math.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import def.js.Date;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.parseInt;

/**
 * The component to edit a rotation
 *
 * @author gianpiero.di.blasi
 */
public class Z4RotationUI extends Z4ComponentUI<Z4Rotation, Z4RotationUI> {

  private final HTMLElement toggleType = this.querySelector(".toggle-type");
  private final HTMLElement toggleTypeImg = this.querySelector(".toggle-type img");
  private final Z4NumberUI startAngle = new Z4NumberUI().setRange(-180, 180).setValueLabel("START_ANGLE").setSignVisible(false).appendTo(this.querySelector(".start-angle-container"));
  private final $HTMLElement delayedCheck = this.querySelector(".delayed-check");

  private final Z4FancifulValueUI angle = new Z4FancifulValueUI().setValueLabel("ANGLE").setComponentsVisible(true, true, false).setConstantRange(-180, 180).setRandomRange(-180, 180).appendTo(this.querySelector(".angle"));

  private Z4Rotation rotation = Z4Rotation.fixed();

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  @SuppressWarnings("StringEquality")
  public Z4RotationUI() {
    super(Z4RotationUI.UI);

    this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + this.toggleType.getAttribute("data-value") + ".svg");

    NodeList imgs = this.querySelectorAll(".toggle-type-dropdown-menu img");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".toggle-type-dropdown-menu .dropdown-item");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.toggleType.setAttribute("data-value", button.getAttribute("data-value"));
        this.toggleTypeImg.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + button.getAttribute("data-value") + ".svg");

        Z4FancifulValue angleValue = this.angle.getValue();
        this.rotation = this.getNewRotation().
                setConstant(angleValue.getConstantSign(), angleValue.getConstantValue()).
                setRandom(angleValue.getRandomSign(), angleValue.getRandomValue()).
                setUniformSign(angleValue.isUniformSign()).
                setStartAngle(this.startAngle.getValue()).
                setDelayed(this.delayedCheck.checked);

        this.onchange.$apply(this.rotation);
        return null;
      };
    }

    this.delayedCheck.id = "uniform_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());
    this.querySelector(".delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) -> {
      this.onchange.$apply(this.rotation.setDelayed(this.delayedCheck.checked));
      return null;
    };

    this.startAngle.oninput = (value) -> this.oninput.$apply(this.rotation.setStartAngle(this.startAngle.getValue()));
    this.startAngle.onchange = (value) -> this.onchange.$apply(this.rotation.setStartAngle(this.startAngle.getValue()));

    this.angle.oninput = (value) -> this.oninput.$apply(this.rotation.
            setConstant(value.getConstantSign(), value.getConstantValue()).
            setRandom(value.getRandomSign(), value.getRandomValue()).
            setUniformSign(value.isUniformSign())
    );
    this.angle.onchange = (value) -> this.onchange.$apply(this.rotation.
            setConstant(value.getConstantSign(), value.getConstantValue()).
            setRandom(value.getRandomSign(), value.getRandomValue()).
            setUniformSign(value.isUniformSign())
    );

    this.setValue(this.rotation);
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
   * @return This Z4RotationUI
   */
  public Z4RotationUI setValueLabel(String token) {
    $HTMLElement valueLabel = this.querySelector(".rotation-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerText = Z4MessageFactory.get(token);
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

  /**
   * Sets the value
   *
   * @param value The value
   * @return This Z4RotationUI
   */
  public Z4RotationUI setValue(Z4Rotation value) {
    this.rotation = value;
//
//    this.delayedCheck.checked = this.fancifulValue.isUniformSign();
//
//    this.constantUI.setSign(this.fancifulValue.getConstantSign());
//    this.constantUI.setValue(this.fancifulValue.getConstantValue());
//    this.setUniformSign(this.fancifulValue.getConstantSign());
//
//    this.randomUI.setSign(this.fancifulValue.getRandomSign());
//    this.setRandom(this.fancifulValue.getRandomValue());
//
//    this.proportionalUI.setSign(this.fancifulValue.getProportionalSign());
//    this.proportionalUI.setValue(this.fancifulValue.getProportionalValue());
//
//    this.setUI();
    return this;
  }
//
//  private void setUI() {
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
//            "u-" + this.delayedCheck.checked
//    );
//
//    this.selector.forEach(sel -> {
//      this.querySelector(".fanciful-label").classList.add(sel);
//      this.querySelector(".form-check").classList.add(sel);
//      this.querySelector(".fanciful-container").classList.add(sel);
//    });
//  }
//
//  private void setUniformSign(Z4Sign sign) {
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
//    this.toggleUniformImg.setAttribute("src", Z4RotationUI.PATH + "z4sign_" + str + ".svg");
//  }
//
//  public Z4Rotation getUniformSign() {
//    switch (this.toggleUniform.getAttribute("data-value")) {
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
//  @SuppressWarnings("StringEquality")
//  private void setRandom(Z4RandomValue random) {
//    String str = null;
//    if (random.isClassic()) {
//      str = "classic";
//    } else if (random.isBezier()) {
//      str = "bezier";
//    } else if (random.isPolyline()) {
//      str = "polyline";
//    } else if (random.isStepped()) {
//      str = "stepped";
//    }
//
//    this.toggleRandom.setAttribute("data-value", str);
//    this.toggleRandomImg.setAttribute("src", Z4RotationUI.PATH + "z4randomvalue_" + str + ".svg");
//
//    this.randomUI.setValue(random.getValue());
//
//    this.querySelector(".divider-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
//    this.querySelector(".container-length").style.display = str == "classic" ? "none" : "block"; // JS equality for strings
//    this.valueLength.value = "" + random.getLength();
//  }
//

  private Z4Rotation getNewRotation() {
    switch (this.toggleType.getAttribute("data-value")) {
      case "fixed":
        return Z4Rotation.fixed();
      case "cumulative":
        return Z4Rotation.cumulative();
      case "relativetopath":
        return Z4Rotation.relativeToPath();
      default:
        return null;
    }
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public Z4Rotation getValue() {
    return this.rotation;
  }
}
