/**
 * The component to show a color progression
 *
 * @author gianpiero.di.blasi
 */
class Z4ProgressionUI extends Z4AbstractComponentWithValueUI {

   stepLabel = this.querySelector(".progression-step-range-label");

   stepRange = this.querySelector(".progression-step-range");

   stepBadge = this.querySelector(".progression-step-badge");

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/color/ui/Z4ProgressionUI.html");

  /**
   * Creates a Z4ProgressionUI
   */
  constructor() {
    super(Z4ProgressionUI.UI);
    let imgs = this.querySelectorAll(".progression-type-dropdown-menu img[data-type='progression']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ProgressionUI.PATH + "z4progression_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".progression-type-dropdown-menu button[data-type='progression']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".progression-type-button img[data-type='progression']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
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
        this.onchange(this.value);
        return null;
      };
    }
    this.stepRange.oninput = (event) => {
      this.stepLabel.innerText = this.stepRange.value;
      this.stepBadge.innerText = this.stepRange.value;
      this.oninput(this.value.setTemporalStepProgression(this.stepRange.valueAsNumber));
      return null;
    };
    this.stepRange.onchange = (event) => {
      this.stepLabel.innerText = this.stepRange.value;
      this.stepBadge.innerText = this.stepRange.value;
      this.onchange(this.value.setTemporalStepProgression(this.stepRange.valueAsNumber));
      return null;
    };
    imgs = this.querySelectorAll(".progression-lighting-dropdown-menu img[data-type='lighting']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ProgressionUI.PATH + "z4lighting_" + img.getAttribute("data-icon") + ".svg");
    }
    buttons = this.querySelectorAll(".progression-lighting-dropdown-menu button[data-type='lighting']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".progression-lighting-button img[data-type='lighting']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
          case "none":
            this.onchange(this.value.setLighting(Z4Lighting.NONE));
            break;
          case "lighted":
            this.onchange(this.value.setLighting(Z4Lighting.LIGHTED));
            break;
          case "darkened":
            this.onchange(this.value.setLighting(Z4Lighting.DARKENED));
            break;
        }
        return null;
      };
    }
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
   setProgressionLabel(token, bold, italic) {
    let progressionLabel = this.querySelector(".progression-label");
    progressionLabel.setAttribute("data-token-lang-inner_text", token);
    progressionLabel.innerHTML = Z4MessageFactory.get(token);
    progressionLabel.style.fontWeight = bold ? "700" : "400";
    progressionLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
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
    if (this.value.getLighting() === Z4Lighting.NONE) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='none']").getAttribute("src"));
    } else if (this.value.getLighting() === Z4Lighting.LIGHTED) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='lighted']").getAttribute("src"));
    } else if (this.value.getLighting() === Z4Lighting.DARKENED) {
      this.querySelector(".progression-lighting-button img").setAttribute("src", this.querySelector(".progression-lighting-dropdown-menu img[data-icon='darkened']").getAttribute("src"));
    }
    return this;
  }

   dispose() {
  }
}
