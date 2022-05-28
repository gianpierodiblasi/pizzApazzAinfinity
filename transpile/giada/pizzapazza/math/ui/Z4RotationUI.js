/**
 * The component to edit a rotation
 *
 * @author gianpiero.di.blasi
 */
class Z4RotationUI extends Z4AbstractComponentWithValueUI {

   startAngle = new Z4SignedValueUI().setCompact().setRange(0, 360).setValueLabel("START_ANGLE", true, false).setSignVisible(false).insertBeforeElement(this.querySelector(".rotation-type-button"));

   delayedCheck = this.querySelector(".rotation-delayed-check");

   angle = new Z4FancifulValueUI().setValueLabel("ANGLE", true, false).setConstantRange(0, 180).setRandomRange(0, 180).insertBeforeElement(this.querySelector(".rotation-type-button"));

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/math/ui/Z4RotationUI.html");

  /**
   * Creates a Z4RotationUI
   */
  constructor() {
    super(Z4RotationUI.UI);
    let imgs = this.querySelectorAll(".rotation-type-dropdown-menu img[data-type='rotation']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4RotationUI.PATH + "z4rotation_" + img.getAttribute("data-icon") + ".svg");
    }
    let buttons = this.querySelectorAll(".rotation-type-dropdown-menu button[data-type='rotation']");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons.item(i);
      button.onclick = (event) => {
        this.querySelector(".rotation-type-button img[data-type='rotation']").setAttribute("src", button.querySelector("img").getAttribute("src"));
        switch(button.getAttribute("data-value")) {
          case "fixed":
            this.value = Z4Rotation.fixed();
            break;
          case "cumulative":
            this.value = Z4Rotation.cumulative();
            break;
          case "relativetopath":
            this.value = Z4Rotation.relativeToPath();
            break;
        }
        this.onchange(this.value.setAngle(this.angle.getValue()).setStartAngle(this.startAngle.getValue().getValue()).setDelayed(this.delayedCheck.checked));
        return null;
      };
    }
    this.delayedCheck.id = this.getUniqueID();
    this.querySelector(".rotation-delayed-label").setAttribute("for", this.delayedCheck.id);
    this.delayedCheck.onchange = (event) => {
      this.querySelector(".rotation-delayed-badge").style.display = this.delayedCheck.checked ? "inline-block" : "none";
      this.onchange(this.value.setDelayed(this.delayedCheck.checked));
      return null;
    };
    this.startAngle.querySelector(".signed-value-value-label").style.display = "block";
    let button = this.startAngle.querySelector(".signed-value-compact-button");
    let span = document.createElement("span");
    for (let i = 0; i < 10; i++) {
      span.innerHTML += "&nbsp";
    }
    button.appendChild(span);
    this.startAngle.oninput = (start) => this.oninput(this.value.setStartAngle(start.getValue()));
    this.startAngle.onchange = (start) => this.onchange(this.value.setStartAngle(start.getValue()));
    this.angle.oninput = (a) => this.oninput(this.value.setAngle(a));
    this.angle.onchange = (a) => this.onchange(this.value.setAngle(a));
    this.setValue(Z4Rotation.fixed());
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   * @return This Z4RotationUI
   */
   setRandomLengthRange(min, max) {
    this.angle.setRandomLengthRange(min, max);
    return this;
  }

  /**
   * Sets the token of the value label
   *
   * @param token The token of the value label
   * @param bold true for bold font, false otherwise
   * @param italic true for italic font, false otherwise
   * @return This Z4RotationUI
   */
   setValueLabel(token, bold, italic) {
    let valueLabel = this.querySelector(".rotation-label");
    valueLabel.setAttribute("data-token-lang-inner_text", token);
    valueLabel.innerHTML = Z4MessageFactory.get(token);
    valueLabel.style.fontWeight = bold ? "700" : "400";
    valueLabel.style.fontStyle = italic ? "italic" : "normal";
    return this;
  }

   setValue(value) {
    this.value = value;
    if (this.value.isFixed()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='fixed']").getAttribute("src"));
    } else if (this.value.isCumulative()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='cumulative']").getAttribute("src"));
    } else if (this.value.isRelativeToPath()) {
      this.querySelector(".rotation-type-button img").setAttribute("src", this.querySelector(".rotation-type-dropdown-menu img[data-icon='relativetopath']").getAttribute("src"));
    }
    this.delayedCheck.checked = this.value.isDelayed();
    this.querySelector(".rotation-delayed-badge").style.display = this.value.isDelayed() ? "inline-block" : "none";
    this.startAngle.setValue(new Z4SignedValue().setValue(this.value.getStartAngle()));
    this.angle.setValue(this.value.getAngle());
    return this;
  }

   dispose() {
  }
}
