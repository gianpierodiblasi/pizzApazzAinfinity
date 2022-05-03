package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The component to edit a numeric value
 *
 * @author gianpiero.di.blasi
 */
public class Z4StamperUI extends Z4AbstractComponentWithValueUI<Z4Stamper> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final Z4FancifulValueUI intensity = new Z4FancifulValueUI().setValueLabel("INTENSITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));
  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).setConstantRange(1, 999999999).appendToElement(this.querySelector(".stamper-container"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setComponentsVisible(true, true, false).setSignsVisible(false, true, true).appendToElement(this.querySelector(".stamper-container"));

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4StamperUI.html");
  private final static int WIDTH = 500;
  private final static int HEIGHT = 300;

  /**
   * Creates a Z4StamperUI
   */
  public Z4StamperUI() {
    super(Z4StamperUI.UI);
    this.initDevicePixelRatio(() -> this.drawCanvas());

    this.canvas.style.border = "1px dashed gray";
    this.canvas.style.width = Z4StamperUI.WIDTH + "px";
    this.canvas.style.height = Z4StamperUI.HEIGHT + "px";

    this.intensity.oninput = (v) -> {
      this.value.setIntensity(v);
      this.oninput.$apply(this.value);
    };
    this.intensity.onchange = (v) -> {
      this.value.setIntensity(v);
      this.onchange.$apply(this.value);
    };
    this.rotation.oninput = (v) -> {
      this.value.setRotation(v);
      this.oninput.$apply(this.value);
    };
    this.rotation.onchange = (v) -> {
      this.value.setRotation(v);
      this.onchange.$apply(this.value);
    };
    this.multiplicity.oninput = (v) -> {
      this.value.setMultiplicity(v);
      this.oninput.$apply(this.value);
    };
    this.multiplicity.onchange = (v) -> {
      this.value.setMultiplicity(v);
      this.onchange.$apply(this.value);
    };
    this.push.oninput = (v) -> {
      this.value.setPush(v);
      this.oninput.$apply(this.value);
    };
    this.push.onchange = (v) -> {
      this.value.setPush(v);
      this.onchange.$apply(this.value);
    };
    this.setValue(new Z4Stamper());
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Stamper value) {
    this.value = value;

    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());

    return (T) this;
  }

  private void drawCanvas() {

  }
}
