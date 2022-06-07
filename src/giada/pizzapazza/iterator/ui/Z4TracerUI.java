package giada.pizzapazza.iterator.ui;

import def.js.Array;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.color.ui.Z4ProgressionUI;
import giada.pizzapazza.iterator.Z4Tracer;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.math.ui.Z4RotationUI;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
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
public class Z4TracerUI extends Z4PointIteratorUI<Z4Tracer> {

  private final Z4FancifulValueUI multiplicity = new Z4FancifulValueUI().setValueLabel("MULTIPLICITY", true, true).setConstantRange(1, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));
  private final Z4FancifulValueUI push = new Z4FancifulValueUI().setValueLabel("PUSH", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));
  private final Z4FancifulValueUI step = new Z4FancifulValueUI().setValueLabel("STEP", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-first-row"));

  private final Z4FancifulValueUI attack = new Z4FancifulValueUI().setValueLabel("ATTACK", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));
  private final Z4FancifulValueUI sustain = new Z4FancifulValueUI().setValueLabel("SUSTAIN", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));
  private final Z4FancifulValueUI release = new Z4FancifulValueUI().setValueLabel("RELEASE", true, true).setConstantRange(0, 50, false).setRandomRange(0, 50, false).setRandomLengthRange(1, 100, false).setSignsVisible(false).appendToElement(this.querySelector(".tracer-container-second-row"));

  private final $HTMLElement endlessSustainCheck = this.querySelector(".tracer-endless-sustain-check");

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4TracerUI.html");

  /**
   * Creates a Z4TracerUI
   */
  public Z4TracerUI() {
    super(Z4TracerUI.UI);

    this.multiplicity.oninput = (v) -> this.setMPS(v, null, null, false);
    this.multiplicity.onchange = (v) -> this.setMPS(v, null, null, true);
    this.push.oninput = (v) -> this.setMPS(null, v, null, false);
    this.push.onchange = (v) -> this.setMPS(null, v, null, true);
    this.step.oninput = (v) -> this.setMPS(null, null, v, false);
    this.step.onchange = (v) -> this.setMPS(null, null, v, true);

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

  private void setMPS(Z4FancifulValue multiplicity, Z4FancifulValue push, Z4FancifulValue step, boolean onchange) {
    if ($exists(multiplicity)) {
      this.value.setMultiplicity(multiplicity);
    }
    if ($exists(push)) {
      this.value.setPush(push);
    }
    if ($exists(step)) {
      this.value.setStep(step);
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
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
    this.step.setValue(value.getStep());
    
    this.attack.setValue(value.getAttack());
    this.sustain.setValue(value.getSustain());
    this.release.setValue(value.getRelease());
    this.endlessSustainCheck.checked = value.isEndlessSustain();

    this.sustain.setEnabled(!this.endlessSustainCheck.checked);
    this.release.setEnabled(!this.endlessSustainCheck.checked);

    return super.setValue(value);
  }
}
