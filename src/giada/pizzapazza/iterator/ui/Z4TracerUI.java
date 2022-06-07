package giada.pizzapazza.iterator.ui;

import def.js.Array;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.iterator.Z4Tracer;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.window;
import simulation.js.$MutationObserver;
import simulation.js.$Object;
import simulation.js.$ResizeObserver;

/**
 * The component to edit a Z4Tracer
 *
 * @author gianpiero.di.blasi
 */
public class Z4TracerUI extends Z4AbstractComponentWithValueUI<Z4Tracer> {

  private final $Canvas canvas = ($Canvas) this.querySelector(".tracer-canvas");
  private final $CanvasRenderingContext2D ctx = this.canvas.getContext("2d");

  private final Z4RotationUI rotation = new Z4RotationUI().setValueLabel("ROTATION", true, true).appendToElement(this.querySelector(".tracer-container"));
  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));
  private final Z4ProgressionUI progression = new Z4ProgressionUI().setProgressionLabel("FILLING", true, true).appendToElement(this.querySelector(".tracer-container"));

  private final Z4FancifulValueUI attack = new Z4FancifulValueUI().setValueLabel("ATTACK", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));
  private final Z4FancifulValueUI sustain = new Z4FancifulValueUI().setValueLabel("SUSTAIN", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));
  private final Z4FancifulValueUI release = new Z4FancifulValueUI().setValueLabel("RELEASE", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

  private final $HTMLElement endlessSustainCheck = this.querySelector(".tracer-endless-sustain-check");

  private final Z4FancifulValueUI step = new Z4FancifulValueUI().setValueLabel("STEP", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-third-row"));

  private final $ResizeObserver resizeObserver = new $ResizeObserver(() -> this.drawCanvas());
  private final $MutationObserver mutationObserver = new $MutationObserver(() -> this.drawCanvas());

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4TracerUI.html");

  /**
   * Creates a Z4TracerUI
   */
  public Z4TracerUI() {
    super(Z4TracerUI.UI);

    this.initDevicePixelRatio(() -> this.drawCanvas());
    this.resizeObserver.observe(this.canvas);

    $Object config = new $Object();
    config.$set("attributeFilter", new Array<>("class"));
    this.mutationObserver.observe(document.body, config);

    this.rotation.oninput = (v) -> this.set(v, null, null, null, null, false);
    this.rotation.onchange = (v) -> this.set(v, null, null, null, null, true);
    this.multiplicity.oninput = (v) -> this.set(null, v, null, null, null, false);
    this.multiplicity.onchange = (v) -> this.set(null, v, null, null, null, true);
    this.push.oninput = (v) -> this.set(null, null, v, null, null, false);
    this.push.onchange = (v) -> this.set(null, null, v, null, null, true);
    this.step.oninput = (v) -> this.set(null, null, null, v, null, false);
    this.step.onchange = (v) -> this.set(null, null, null, v, null, true);
    this.progression.oninput = (v) -> this.set(null, null, null, null, v, false);
    this.progression.onchange = (v) -> this.set(null, null, null, null, v, true);

    this.attack.oninput = (v) -> this.setEnvelope(false);
    this.attack.onchange = (v) -> this.setEnvelope(true);
    this.sustain.oninput = (v) -> this.setEnvelope(false);
    this.sustain.onchange = (v) -> this.setEnvelope(true);
    this.release.oninput = (v) -> this.setEnvelope(false);
    this.release.onchange = (v) -> this.setEnvelope(true);

    this.endlessSustainCheck.id = this.getUniqueID();
    this.querySelector(".tracer-endless-sustain-label").setAttribute("for", this.endlessSustainCheck.id);
    this.endlessSustainCheck.onchange = (event) -> {
      this.sustain.setEnabled(!this.endlessSustainCheck.checked);
      this.release.setEnabled(!this.endlessSustainCheck.checked);

      this.value.setEnvelope(this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustainCheck.checked);
      this.drawCanvas();
      this.onchange.$apply(this.value);
      return null;
    };
    this.sustain.querySelector(".fanciful-value-label").parentElement.insertBefore(this.querySelector(".tracer-endless-sustain-switch"), this.sustain.querySelector(".fanciful-value-container"));

    this.setValue(new Z4Tracer());
  }

  private void set(Z4Rotation rotation, Z4FancifulValue multiplicity, Z4FancifulValue push, Z4FancifulValue step, Z4Progression progression, boolean onchange) {
    if ($exists(rotation)) {
      this.value.setRotation(rotation);
    }
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(push)) {
      this.value.setPush(push);
    }
    if ($exists(step)) {
      this.value.setStep(step);
    }
    if ($exists(progression)) {
      this.value.setProgression(progression);
    }

    this.drawCanvas();

    if (onchange) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }
  }

  private void setEnvelope(boolean onchange) {
    this.value.setEnvelope(this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustainCheck.checked);

    this.drawCanvas();

    if (onchange) {
      this.onchange.$apply(this.value);
    } else {
      this.oninput.$apply(this.value);
    }
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4AbstractComponentWithValueUI<?>> T setValue(Z4Tracer value) {
    this.value = value;

    this.rotation.setValue(this.value.getRotation());
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.push.setValue(this.value.getPush());
    this.step.setValue(this.value.getStep());
    this.progression.setValue(this.value.getProgression());

    this.attack.setValue(this.value.getAttack());
    this.sustain.setValue(this.value.getSustain());
    this.release.setValue(this.value.getRelease());
    this.endlessSustainCheck.checked = this.value.isEndlessSustain();

    this.sustain.setEnabled(!this.endlessSustainCheck.checked);
    this.release.setEnabled(!this.endlessSustainCheck.checked);

    this.drawCanvas();

    return (T) this;
  }

  private void drawCanvas() {
    if ($exists(this.canvas.clientWidth)) {
      this.canvas.width = Math.floor(this.canvas.clientWidth * window.devicePixelRatio);
      this.canvas.height = Math.floor(this.canvas.clientHeight * window.devicePixelRatio);

      $OffscreenCanvas offscreen = new $OffscreenCanvas(this.canvas.clientWidth, this.canvas.clientHeight);
      $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
      this.value.drawDemo(offscreenCtx, null, null, this.canvas.clientWidth, this.canvas.clientHeight);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.ctx.drawImage(offscreen, 0, 0);
      this.ctx.restore();
    }
  }

  @Override
  public void dispose() {
    this.disposeDevicePixelRatio();
    this.resizeObserver.unobserve(this.canvas);
    this.mutationObserver.unobserve(document.body);
  }
}
