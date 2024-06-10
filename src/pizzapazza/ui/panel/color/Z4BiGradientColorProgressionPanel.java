package pizzapazza.ui.panel.color;

import def.js.Array;
import def.js.Object;
import javascript.awt.BoxLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4BiGradientColorProgression;
import pizzapazza.color.Z4BiGradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to manage a bigradient color progressing
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColorProgressionPanel extends Z4AbstractValuePanel<Z4BiGradientColorProgression> {

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
  public Z4BiGradientColorProgressionPanel(Z4GradientColorProgressionPanelOrientation orientation) {
    super();
    this.cssAddClass("z4bigradientcolorprogressionpanel");
    this.setLayout(new GridBagLayout());

    JSPanel panel = new JSPanel();
    ButtonGroup buttonGroup = new ButtonGroup();

    if (orientation == Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).a(GBC.WEST));

      panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, buttonGroup, panel, "left");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, buttonGroup, panel, "centerh");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, buttonGroup, panel, "right");

      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(0, 1).a(GBC.WEST).wx(1));
      this.add(this.temporalStepSpinner, new GBC(1, 1).w(3).a(GBC.EAST).i(1, 0, 0, 0));
      this.add(this.temporalStepSlider, new GBC(0, 2).w(4));

      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(0, 3).a(GBC.EAST).w(2).wx(1).i(0, 0, 0, 1));
      this.add(this.lightingPanel, new GBC(2, 3).w(2).a(GBC.EAST));

    } else if (orientation == Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));

      panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4BiGradientColorProgressionBehavior.TEMPORAL, buttonGroup, panel, "top");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, buttonGroup, panel, "centerv");
      this.addRadio(Z4BiGradientColorProgressionBehavior.RANDOM, buttonGroup, panel, "bottom");

      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(1, 1).a(GBC.WEST).wx(1));
      this.add(this.temporalStepSpinner, new GBC(2, 1).w(2).a(GBC.EAST));
      this.add(this.temporalStepSlider, new GBC(1, 2).w(3));

      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(2, 3).a(GBC.EAST).i(0, 0, 0, 1));
      this.add(this.lightingPanel, new GBC(3, 3));
    }

    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event -> this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event -> this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));

    this.lightingPanel.addChangeListener(event -> this.onProgressionChange(false));

    this.setValue(new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, 0.1, Z4Lighting.NONE));
  }

  private void addRadio(Z4BiGradientColorProgressionBehavior behavior, ButtonGroup buttonGroup, JSPanel panel, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4bigradientcolorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> {
      Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.temporalStepSpinner.setEnabled(behavior == Z4BiGradientColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior == Z4BiGradientColorProgressionBehavior.TEMPORAL);

      this.onProgressionChange(false);
    });

    switch (border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }

    buttonGroup.add(radio);
    this.radios.$set("" + behavior, radio);
    panel.add(radio, null);
  }

  private void onProgressionChange(boolean b) {
    this.valueIsAdjusting = b;

    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "TEMPORAL":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4BiGradientColorProgression(Z4BiGradientColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.lightingPanel.getValue());
            break;
        }
      }
    });

    this.onchange();
  }

  private void onTemporalStepChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.onProgressionChange(adjusting);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  @Override
  public void setValue(Z4BiGradientColorProgression value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getBiGradientColorProgressionBehavior())).setContentAreaFilled(true);

    this.temporalStepSpinner.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSlider.setEnabled(value.getBiGradientColorProgressionBehavior() == Z4BiGradientColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
  }

  @Override
  @SuppressWarnings("StringEquality")
  public void setEnabled(boolean b) {
    this.lightingPanel.setEnabled(b);

    Object.keys(this.radios).forEach(key -> {
      JSRadioButton radio = this.radios.$get(key);
      radio.setEnabled(b);

      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) != ("" + Z4BiGradientColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
