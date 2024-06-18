package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Tracer;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.$exists;

/**
 * The component to edit a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
public class Z4TracerUI extends Z4PointIteratorUI<Z4Tracer> {

  /**
   * Creates a Z4TracerUI
   */
  public Z4TracerUI() {
    super(Z4TracerUI.UI);

    this.endlessSustainCheck.onchange = (event) -> {
      this.sustain.setEnabled(!this.endlessSustainCheck.checked);
      this.release.setEnabled(!this.endlessSustainCheck.checked);

      this.value.setEnvelope(this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustainCheck.checked);
      this.drawCanvas();
      this.onchange.$apply(this.value);
      return null;
    };
    
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
