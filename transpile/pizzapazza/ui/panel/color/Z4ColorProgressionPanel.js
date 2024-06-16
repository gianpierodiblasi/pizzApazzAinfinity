/**
 * The panel to manage the progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionPanel extends Z4AbstractValuePanel {

   lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);

   radios = new Array();

   temporalStepSlider = new JSSlider();

   temporalStepSpinner = new JSSpinner();

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4colorprogressionpanel");
    this.setLayout(new GridBagLayout());
    let panel = new JSPanel();
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
    } else if (orientation === Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
    }
    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event => this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event => this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.lightingPanel.addChangeListener(event => {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });
    this.setValue(new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.1, Z4Lighting.NONE));
  }

   onTemporalStepChange(spTosl, adjusting, spinner, slider) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    this.valueIsAdjusting = adjusting;
    this.onProgressionChange();
  }

   onProgressionChange() {
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "SPATIAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });
    this.onchange();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the painter and the color
   *
   * @param painter The painter
   * @param color The color
   */
   setPainterAndColor(painter, color) {
  }

   setValue(value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getColorProgressionBehavior()]).setSelected(true);
    (this.radios["" + value.getColorProgressionBehavior()]).setContentAreaFilled(true);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSpinner.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
    this.temporalStepSlider.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.lightingPanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
