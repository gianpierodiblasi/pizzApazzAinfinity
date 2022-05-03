/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
class Z4StamperUI extends Z4AbstractComponentWithValueUI {

   canvas = this.querySelector(".canvas");

   ctx = this.canvas.getContext("2d");

   intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

   rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));

   multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));

   push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");

  static  WIDTH = 500;

  static  HEIGHT = 300;

  /**
   * Creates a Z4StamperUI
   */
  constructor() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() => this.drawCanvas());
    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4StamperUI.WIDTH + "px";
    this.canvas.style.height = Z4StamperUI.HEIGHT + "px";
    this.intensity.oninput = (v) => {
      this.value.setIntensity(v);
      this.oninput(this.value);
    };
    this.intensity.onchange = (v) => {
      this.value.setIntensity(v);
      this.onchange(this.value);
    };
    this.rotation.oninput = (v) => {
      this.value.setRotation(v);
      this.oninput(this.value);
    };
    this.rotation.onchange = (v) => {
      this.value.setRotation(v);
      this.onchange(this.value);
    };
    this.multiplicity.oninput = (v) => {
      this.value.setMultiplicity(v);
      this.oninput(this.value);
    };
    this.multiplicity.onchange = (v) => {
      this.value.setMultiplicity(v);
      this.onchange(this.value);
    };
    this.push.oninput = (v) => {
      this.value.setPush(v);
      this.oninput(this.value);
    };
    this.push.onchange = (v) => {
      this.value.setPush(v);
      this.onchange(this.value);
    };
    this.setValue(new Z4Stamper());
  }

   setValue(value) {
    this.value = value;
    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    return this;
  }

   drawCanvas() {
  }
}
