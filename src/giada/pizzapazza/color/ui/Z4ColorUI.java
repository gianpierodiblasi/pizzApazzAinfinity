package giada.pizzapazza.color.ui;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4ComponentUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color
 *
 * @author gianpiero.di.blasi
 */
public class Z4ColorUI extends Z4ComponentUI {

  private final $HTMLElement colorLabel = this.querySelector(".color-label");
  private final $HTMLElement color = this.querySelector(".form-control");
  private final $HTMLElement formRange = this.querySelector(".form-range");

  private final static String UI = Z4ComponentUI.loadHTML("giada/pizzapazza/color/ui/Z4ColorUI.html");

  public Z4ColorUI() {
    super(Z4ColorUI.UI);

    this.colorLabel.innerText = Z4MessageFactory.get("COLOR");
    this.querySelector(".opacity-color-label").innerText = Z4MessageFactory.get("OPACITY");

    $HTMLElement formRangeLabel = this.querySelector(".form-range-label");
    this.formRange.oninput = (event) -> {
      formRangeLabel.innerText = this.formRange.value;
      return null;
    };
  }

  /**
   * Sets the token of the color label
   *
   * @param token The token of the color label
   */
  public void setColorLabel(String token) {
    this.colorLabel.setAttribute("data-token-lang", token);
    this.colorLabel.innerText = Z4MessageFactory.get(token);
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
