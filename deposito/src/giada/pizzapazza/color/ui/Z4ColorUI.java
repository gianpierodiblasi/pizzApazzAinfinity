package giada.pizzapazza.color.ui;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorUI extends Z4AbstractComponentWithValueUI<Z4Color> {

  private final $HTMLElement color = this.querySelector(".color-input");
  private final $HTMLElement opacityLabel = this.querySelector(".color-opacity-range-label");
  private final $HTMLElement opacityRange = this.querySelector(".color-opacity-range");
  private final $HTMLElement opacityBadge = this.querySelector(".color-opacity-badge");

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ColorUI.html");

  /**
   * Creates a Z4ColorUI
   */
  public Z4ColorUI() {
    super(Z4ColorUI.UI);

    this.querySelector(".color-gray").onclick = (event) -> {
      this.setValue(this.value.gray());
      this.onchange.$apply(this.value);
      return null;
    };

    this.querySelector(".color-negative").onclick = (event) -> {
      this.setValue(this.value.negative());
      this.onchange.$apply(this.value);
      return null;
    };

    this.color.oninput = (event) -> {
      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
      this.oninput.$apply(this.value);
      return null;
    };
    this.color.onchange = (event) -> {
      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
      this.onchange.$apply(this.value);
      return null;
    };

    this.opacityRange.oninput = (event) -> {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.opacityBadge.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
      this.oninput.$apply(this.value);
      return null;
    };
    this.opacityRange.onchange = (event) -> {
      this.opacityLabel.innerText = this.opacityRange.value;
      this.opacityBadge.innerText = this.opacityRange.value;
      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
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
    colorLabel.innerHTML = Z4MessageFactory.get(token);
    colorLabel.style.fontWeight = bold ? "700" : "400";
    colorLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the visibility of the opacity badge
   *
   * @param visible true to make the opacity badge visible, false otherwise
   * @return This Z4ColorUI
   */
  public Z4ColorUI setOpacityBadgeVisible(boolean visible) {
    this.opacityBadge.style.display = visible ? "inline-block" : "none";
    return this;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Color value) {
    this.value = value;

    this.color.value = this.value.getHEX().substring(0, 7);
    this.opacityRange.valueAsNumber = this.value.getComponents().$get(0);
    this.opacityLabel.innerText = this.opacityRange.value;
    this.opacityBadge.innerText = this.opacityRange.value;

    return (T) this;
  }

  @Override
  public void dispose() {
  }
}
