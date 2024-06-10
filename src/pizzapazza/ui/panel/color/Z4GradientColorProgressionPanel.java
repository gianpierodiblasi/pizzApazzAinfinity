package pizzapazza.ui.panel.color;

import def.js.Object;
import javascript.awt.GBC;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import pizzapazza.color.Z4GradientColorProgression;
import pizzapazza.color.Z4GradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;

/**
 * The panel to manage a gradient color progressing
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorProgressionPanel extends Z4AbstractGradientColorProgressionPanel<Z4GradientColorProgression, Z4GradientColorProgressionBehavior> {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4GradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation orientation) {
    super(orientation);
    this.cssAddClass("z4gradientcolorprogressionpanel");
    this.setValue(new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, 0.1, Z4Lighting.NONE));
  }

  @Override
  protected void addRadioPanel(JSPanel panel, ButtonGroup buttonGroup, Z4GradientColorProgressionPanelOrientation orientation) {
    if (orientation == Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4GradientColorProgressionBehavior.SPATIAL, panel, buttonGroup, "left");
      this.addRadio(Z4GradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerh");
      this.addRadio(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4GradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
    } else if (orientation == Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4GradientColorProgressionBehavior.SPATIAL, panel, buttonGroup, "top");
      this.addRadio(Z4GradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerv");
      this.addRadio(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4GradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
    }
  }

  @Override
  protected void onRadioChanged(Z4GradientColorProgressionBehavior behavior) {
    this.lightingPanel.setEnabled(behavior != Z4GradientColorProgressionBehavior.SPATIAL);
    this.temporalStepSpinner.setEnabled(behavior == Z4GradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setEnabled(behavior == Z4GradientColorProgressionBehavior.TEMPORAL);
  }

  @Override
  protected void onProgressionChange() {
    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "SPATIAL":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });
  }

  @Override
  public void setValue(Z4GradientColorProgression value) {
    super.setValue(value);

    this.lightingPanel.setEnabled(value.getGradientColorProgressionBehavior() != Z4GradientColorProgressionBehavior.SPATIAL);

    ((JSRadioButton) this.radios.$get("" + value.getGradientColorProgressionBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getGradientColorProgressionBehavior())).setContentAreaFilled(true);

    this.temporalStepSpinner.setEnabled(value.getGradientColorProgressionBehavior() == Z4GradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setEnabled(value.getGradientColorProgressionBehavior() == Z4GradientColorProgressionBehavior.TEMPORAL);
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    
    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        this.lightingPanel.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.SPATIAL));
        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4GradientColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
