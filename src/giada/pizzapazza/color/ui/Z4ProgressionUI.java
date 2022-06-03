package giada.pizzapazza.color.ui;

import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color progression
 *
 * @author gianpiero.di.blasi
 */
public class Z4ProgressionUI extends Z4AbstractComponentWithValueUI<Z4Progression> {

//  private final $HTMLElement color = this.querySelector(".color-input");
//  private final $HTMLElement opacityLabel = this.querySelector(".color-opacity-range-label");
//  private final $HTMLElement opacityRange = this.querySelector(".color-opacity-range");
//  private final $HTMLElement opacityBadge = this.querySelector(".color-opacity-badge");

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ProgressionUI.html");

  /**
   * Creates a Z4ProgressionUI
   */
  public Z4ProgressionUI() {
    super(Z4ProgressionUI.UI);

//    this.querySelector(".color-gray").onclick = (event) -> {
//      this.setValue(this.value.gray());
//      this.onchange.$apply(this.value);
//      return null;
//    };
//
//    this.querySelector(".color-negative").onclick = (event) -> {
//      this.setValue(this.value.negative());
//      this.onchange.$apply(this.value);
//      return null;
//    };
//
//    this.color.oninput = (event) -> {
//      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
//      this.oninput.$apply(this.value);
//      return null;
//    };
//    this.color.onchange = (event) -> {
//      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
//      this.onchange.$apply(this.value);
//      return null;
//    };
//
//    this.opacityRange.oninput = (event) -> {
//      this.opacityLabel.innerText = this.opacityRange.value;
//      this.opacityBadge.innerText = this.opacityRange.value;
//      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
//      this.oninput.$apply(this.value);
//      return null;
//    };
//    this.opacityRange.onchange = (event) -> {
//      this.opacityLabel.innerText = this.opacityRange.value;
//      this.opacityBadge.innerText = this.opacityRange.value;
//      this.value = Z4Color.fromHEX(this.color.value, (int) this.opacityRange.valueAsNumber);
//      this.onchange.$apply(this.value);
//      return null;
//    };

    this.setValue(Z4Progression.spatial(Z4Lighting.NONE));
  }

  /**
   * Sets the token of the progression label
   *
   * @param token The token of the progression label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4ProgressionUI
   */
  public Z4ProgressionUI setProgressionLabel(String token, boolean bold, boolean italic) {
    $HTMLElement progressionLabel = this.querySelector(".progression-label");
    progressionLabel.setAttribute("data-token-lang-inner_text", token);
    progressionLabel.innerHTML = Z4MessageFactory.get(token);
    progressionLabel.style.fontWeight = bold ? "700" : "400";
    progressionLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

  /**
   * Sets the visibility of the opacity badge
   *
   * @param visible true to make the opacity badge visible, false otherwise
   * @return This Z4ProgressionUI
   */
//  public Z4ProgressionUI setOpacityBadgeVisible(boolean visible) {
//    this.opacityBadge.style.display = visible ? "inline-block" : "none";
//    return this;
//  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Progression value) {
    this.value = value;

//    this.color.value = this.value.getHEX().substring(0, 7);
//    this.opacityRange.valueAsNumber = this.value.getComponents().$get(0);
//    this.opacityLabel.innerText = this.opacityRange.value;
//    this.opacityBadge.innerText = this.opacityRange.value;

    return (T) this;
  }

  @Override
  public void dispose() {
  }
}
