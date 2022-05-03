package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Stamper;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.window;

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

    this.intensity.oninput = (v) -> this.set(v, null, null, null, false);
    this.intensity.onchange = (v) -> this.set(v, null, null, null, true);
    this.rotation.oninput = (v) -> this.set(null, v, null, null, false);
    this.rotation.onchange = (v) -> this.set(null, v, null, null, true);
    this.multiplicity.oninput = (v) -> this.set(null, null, v, null, false);
    this.multiplicity.onchange = (v) -> this.set(null, null, v, null, true);
    this.push.oninput = (v) -> this.set(null, null, null, v, false);
    this.push.onchange = (v) -> this.set(null, null, null, v, true);

    this.setValue(new Z4Stamper());
  }

  private void set(Z4FancifulValue intensity, Z4Rotation rotation, Z4FancifulValue multiplicity, Z4FancifulValue push, boolean onchange) {
    if ($exists(intensity)) {
      this.value.setIntensity(intensity);
    }
    if ($exists(rotation)) {
      this.value.setRotation(rotation);
    }
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(push)) {
      this.value.setMultiplicity(push);
    }

    this.drawCanvas();

    if (onchange) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Stamper value) {
    this.value = value;

    this.intensity.setValue(this.value.getIntensity());
    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());

    this.drawCanvas();
    return (T) this;
  }

  private void drawCanvas() {
    this.canvas.width = Math.floor(Z4StamperUI.WIDTH * window.devicePixelRatio);
    this.canvas.height = Math.floor(Z4StamperUI.HEIGHT * window.devicePixelRatio);

    $OffscreenCanvas offscreen = new $OffscreenCanvas(Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    this.value.drawDemo(offscreenCtx, Z4StamperUI.WIDTH, Z4StamperUI.HEIGHT);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.drawImage(offscreen, 0, 0);
    this.ctx.restore();
  }
}
