package pizzapazza.ui.panel.color;

import def.js.Array;
import def.js.Object;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.painter.Z4Painter;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to manage the progression of a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorProgressionPanel extends Z4AbstractValuePanel<Z4ColorProgression> {

  private final Z4LightingPanel lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
  private final Array<JSRadioButton> radios = new Array<>();
  private final JSSlider temporalStepSlider = new JSSlider();
  private final JSSpinner temporalStepSpinner = new JSSpinner();

  private boolean valueIsAdjusting;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation orientation) {
    super();
    this.cssAddClass("z4colorprogressionpanel");
    this.setLayout(new GridBagLayout());

    JSPanel panel = new JSPanel();
    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {

    } else if (orientation == Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT) {

    }

    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event -> this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event -> this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.lightingPanel.addChangeListener(event -> {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });

    this.setValue(new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.1, Z4Lighting.NONE));
  }

  private void onTemporalStepChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.valueIsAdjusting = adjusting;
    this.onProgressionChange();
  }

  private void onProgressionChange() {
    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
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
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the painter and the color
   *
   * @param painter The painter
   * @param color The color
   */
  public void setPainterAndColor(Z4Painter painter, Z4SpatioTemporalColor color) {
    
  }

  @Override
  public void setValue(Z4ColorProgression value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getColorProgressionBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getColorProgressionBehavior())).setContentAreaFilled(true);

    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSpinner.setEnabled(value.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
    this.temporalStepSlider.setEnabled(value.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL);
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.lightingPanel.setEnabled(b);

    Object.keys(this.radios).forEach(key -> {
      JSRadioButton radio = this.radios.$get(key);
      radio.setEnabled(b);

      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4ColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4ColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
