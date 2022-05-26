package giada.pizzapazza.math.ui;

import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to edit a fanciful value
 *
 * @author gianpiero.di.blasi
 */
public class Z4FancifulValueUI extends Z4AbstractComponentWithValueUI<Z4FancifulValue> {

  private final $HTMLElement uniformCheck = this.querySelector(".fanciful-value-uniform-check");
  private final Z4SignedValueUI constantUI = new Z4SignedValueUI().setCompact().setValueLabel("CONSTANT", false, true).appendToElement(this.querySelector(".fanciful-value-container"));
  private final Z4SignedRandomValueUI randomUI = new Z4SignedRandomValueUI().setCompact().setValueLabel("RANDOM", false, true).appendToElement(this.querySelector(".fanciful-value-container"));

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4FancifulValueUI.html");

  /**
   * Creates a Z4FancifulValueUI
   */
  public Z4FancifulValueUI() {
    super(Z4FancifulValueUI.UI);

    this.uniformCheck.id = this.getUniqueID();
    this.querySelector(".fanciful-value-uniform-label").setAttribute("for", this.uniformCheck.id);
    this.uniformCheck.onchange = (event) -> {
      this.setSignsVisible(this.constantUI.isSignVisible());
      this.onchange.$apply(this.value.setUniformSign(this.uniformCheck.checked));
      return null;
    };

    this.constantUI.oninput = (event) -> this.onInput();
    this.randomUI.oninput = (event) -> this.onInput();
    this.constantUI.onchange = (event) -> this.onChange();
    this.randomUI.onchange = (event) -> this.onChange();

    this.setValue(new Z4FancifulValue());
  }

  private Object onInput() {
    this.oninput.$apply(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()));
    return null;
  }

  private Object onChange() {
    this.onchange.$apply(this.value.setConstant(this.constantUI.getValue()).setRandom(this.randomUI.getValue()));
    return null;
  }

  /**
   * Sets the visibility of the signs
   *
   * @param visible true to make the signs visible, false otherwise
   * @return This Z4FancifulValueUI
   */
  public Z4FancifulValueUI setSignsVisible(boolean visible) {
    this.constantUI.setSignVisible(visible);
    this.randomUI.setSignVisible(!this.uniformCheck.checked && visible);

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
    this.constantUI.setRange(min, max);
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
    this.randomUI.setRange(min, max);
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
    this.randomUI.setLengthRange(min, max);
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
    $HTMLElement valueLabel = this.querySelector(".fanciful-value-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4FancifulValue value) {
    this.value = value;

    this.uniformCheck.checked = this.value.isUniformSign();
    this.setSignsVisible(this.constantUI.isSignVisible());

    this.constantUI.setValue(this.value.getConstant());
    this.randomUI.setValue(this.value.getRandom());

    return (T) this;
  }

  @Override
  public void dispose() {
  }
}
