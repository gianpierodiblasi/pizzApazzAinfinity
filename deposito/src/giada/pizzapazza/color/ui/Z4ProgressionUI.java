package giada.pizzapazza.color.ui;

import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;

/**
 * The component to show a color progression
 *
 * @author gianpiero.diblasi
 */
public class Z4ProgressionUI extends Z4AbstractComponentWithValueUI<Z4Progression> {

  private final $HTMLElement stepLabel = this.querySelector(".progression-step-range-label");
  private final $HTMLElement stepRange = this.querySelector(".progression-step-range");
  private final $HTMLElement stepBadge = this.querySelector(".progression-step-badge");

  /**
   * Creates a Z4ProgressionUI
   */
  public Z4ProgressionUI() {
    super(Z4ProgressionUI.UI);

    NodeList imgs = this.querySelectorAll(".progression-type-dropdown-menu img[data-type='progression']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ProgressionUI.PATH + "z4progression_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList buttons = this.querySelectorAll(".progression-type-dropdown-menu button[data-type='progression']");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.querySelector(".progression-type-button img[data-type='progression']").setAttribute("src", button.querySelector("img").getAttribute("src"));

        switch (button.getAttribute("data-value")) {
          case "spatial":
            this.value = Z4Progression.spatial(this.value.getLighting());
            break;
          case "temporal":
            this.value = Z4Progression.temporal(this.value.getTemporalStepProgression(), this.value.getLighting());
            break;
          case "relativetopath":
            this.value = Z4Progression.relativeToPath(this.value.getLighting());
            break;
          case "random":
            this.value = Z4Progression.random(this.value.getLighting());
            break;
        }

        if (this.value.isTemporal()) {
          this.stepRange.removeAttribute("disabled");
        } else {
          this.stepRange.setAttribute("disabled", "disabled");
        }
        this.stepBadge.style.display = this.value.isTemporal() ? "inline-block" : "none";

        this.onchange.$apply(this.value);
        return null;
      };
    }

    this.stepRange.oninput = (event) -> {
      this.stepLabel.innerText = this.stepRange.value;
      this.stepBadge.innerText = this.stepRange.value;
      this.oninput.$apply(this.value.setTemporalStepProgression(this.stepRange.valueAsNumber));
      return null;
    };
    this.stepRange.onchange = (event) -> {
      this.stepLabel.innerText = this.stepRange.value;
      this.stepBadge.innerText = this.stepRange.value;
      this.onchange.$apply(this.value.setTemporalStepProgression(this.stepRange.valueAsNumber));
      return null;
    };

    imgs = this.querySelectorAll(".progression-lighting-dropdown-menu img[data-type='lighting']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ProgressionUI.PATH + "z4lighting_" + img.getAttribute("data-icon") + ".svg");
    }

    buttons = this.querySelectorAll(".progression-lighting-dropdown-menu button[data-type='lighting']");
    for (int i = 0; i < buttons.length; i++) {
      HTMLElement button = (HTMLElement) buttons.item(i);
      button.onclick = (event) -> {
        this.querySelector(".progression-lighting-button img[data-type='lighting']").setAttribute("src", button.querySelector("img").getAttribute("src"));

        switch (button.getAttribute("data-value")) {
          case "none":
            this.onchange.$apply(this.value.setLighting(Z4Lighting.NONE));
            break;
          case "lighted":
            this.onchange.$apply(this.value.setLighting(Z4Lighting.LIGHTED));
            break;
          case "darkened":
            this.onchange.$apply(this.value.setLighting(Z4Lighting.DARKENED));
            break;
        }
        return null;
      };
    }

    this.setValue(Z4Progression.spatial(Z4Lighting.NONE));
  }

  
  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Progression value) {
    this.value = value;

    if (this.value.isSpatial()) {
      this.querySelector(".progression-type-button img").setAttribute("src", this.querySelector(".progression-type-dropdown-menu img[data-icon='spatial']").getAttribute("src"));
    } else if (this.value.isTemporal()) {
      this.querySelector(".progression-type-button img").setAttribute("src", this.querySelector(".progression-type-dropdown-menu img[data-icon='temporal']").getAttribute("src"));
    } else if (this.value.isRelativeToPath()) {
      this.querySelector(".progression-type-button img").setAttribute("src", this.querySelector(".progression-type-dropdown-menu img[data-icon='relativetopath']").getAttribute("src"));
    } else if (this.value.isRandom()) {
      this.querySelector(".progression-type-button img").setAttribute("src", this.querySelector(".progression-type-dropdown-menu img[data-icon='random']").getAttribute("src"));
    }

    this.stepRange.valueAsNumber = this.value.getTemporalStepProgression();
    this.stepLabel.innerText = this.stepRange.value;

    if (this.value.isTemporal()) {
      this.stepRange.removeAttribute("disabled");
    } else {
      this.stepRange.setAttribute("disabled", "disabled");
    }
    this.stepBadge.style.display = this.value.isTemporal() ? "inline-block" : "none";
    this.stepBadge.innerText = "" + this.value.getTemporalStepProgression();

    if (this.value.getLighting() == Z4Lighting.NONE) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='none']").getAttribute("src"));
    } else if (this.value.getLighting() == Z4Lighting.LIGHTED) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='lighted']").getAttribute("src"));
    } else if (this.value.getLighting() == Z4Lighting.DARKENED) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='darkened']").getAttribute("src"));
    }

    return (T) this;
  }

  @Override
  public void dispose() {
  }
}
