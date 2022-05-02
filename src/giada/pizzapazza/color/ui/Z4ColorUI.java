package giada.pizzapazza.color.ui;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4ColorUI extends Z4AbstractComponentWithValueUI<Z4Color> {

  private final $HTMLElement color = this.querySelector(".form-control-color");
  private final $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
  private final $HTMLElement formRange = this.querySelector(".form-range");

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  public Z4ColorUI() {
    super(Z4ColorUI.UI);

    this.querySelector(".gray").onclick = (event) -> {
      this.setValue(this.value.gray());
      this.onchange.$apply(this.value);
      return null;
    };

    this.querySelector(".negative").onclick = (event) -> {
      this.setValue(this.value.negative());
      this.onchange.$apply(this.value);
      return null;
    };

    this.color.oninput = (event) -> {
      this.value = Z4Color.fromHEX(this.color.value, (int) this.formRange.valueAsNumber);
      this.oninput.$apply(this.value);
      return null;
    };
    this.color.onchange = (event) -> {
      this.value = Z4Color.fromHEX(this.color.value, (int) this.formRange.valueAsNumber);
      this.onchange.$apply(this.value);
      return null;
    };

    this.formRange.oninput = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, (int) this.formRange.valueAsNumber);
      this.oninput.$apply(this.value);
      return null;
    };
    this.formRange.onchange = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.value = Z4Color.fromHEX(this.color.value, (int) this.formRange.valueAsNumber);
      this.onchange.$apply(this.value);
      return null;
    };

    this.setValue(new Z4Color(255, 0, 0, 0));
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4ColorUI
   */
  public Z4ColorUI setColorLabel(String token, boolean bold, boolean italic) {
    $HTMLElement colorLabel = this.querySelector(".color-label");
    colorLabel.setAttribute("data-token-lang-inner_text", token);
    colorLabel.innerText = Z4MessageFactory.get(token);
    colorLabel.style.fontWeight = bold ? "700" : "400";
    colorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Color value) {
    this.value = value;

    this.color.value = this.value.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = this.value.getComponents().$get(0);
    this.formRangeLabel.innerText = this.formRange.value;

    return (T) this;
  }
}
