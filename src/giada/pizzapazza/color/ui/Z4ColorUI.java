package giada.pizzapazza.color.ui;

import giada.pizzapazza.color.Z4AbstractColor;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4ColorUI extends Z4ComponentUI<Z4Color> {

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
      this.setZ4Color(this.getZ4Color().gray());
      this.onchange.$apply(this.getZ4Color());
      return null;
    };

    this.querySelector(".negative").onclick = (event) -> {
      this.setZ4Color(this.getZ4Color().negative());
      this.onchange.$apply(this.getZ4Color());
      return null;
    };

    this.color.oninput = (event) -> {
      this.oninput.$apply(this.getZ4Color());
      return null;
    };
    this.color.onchange = (event) -> {
      this.onchange.$apply(this.getZ4Color());
      return null;
    };

    this.formRange.oninput = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.oninput.$apply(this.getZ4Color());
      return null;
    };
    this.formRange.onchange = (event) -> {
      this.formRangeLabel.innerText = this.formRange.value;
      this.onchange.$apply(this.getZ4Color());
      return null;
    };
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   * @return This Z4ColorUI
   */
  public Z4ColorUI setColorLabel(String token) {
    $HTMLElement colorLabel = this.querySelector(".color-label");
    colorLabel.setAttribute("data-token-lang", token);
    colorLabel.innerText = Z4MessageFactory.get(token);
    return this;
  }

  /**
   * Sets the Z4Color
   *
   * @param color The Z4Color
   * @return This Z4ColorUI
   */
  public Z4ColorUI setZ4Color(Z4AbstractColor<?> color) {
    this.color.value = color.getHEX().substring(0, 7);
    this.formRange.valueAsNumber = color.getComponents().$get(0);
    this.formRangeLabel.innerText = this.formRange.value;
    return this;
  }

  /**
   * Returns the Z4Color
   *
   * @return The Z4Color
   */
  public Z4Color getZ4Color() {
    return Z4Color.fromHEX(this.color.value, (int) this.formRange.valueAsNumber);
  }
}
