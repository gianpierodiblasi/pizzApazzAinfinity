package pizzapazza.ui.panel.math;

import javascript.awt.GridBagLayout;
import javascript.swing.JSLabel;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to manage a signed value
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValuePanel extends Z4AbstractValuePanel<Z4SignedValue> {
  
  private final JSLabel label = new JSLabel();
  private final Z4SignPanel signPanel = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
  private final JSSpinner valueSpinner = new JSSpinner();

  /**
   * Creates the object
   */
  public Z4SignedValuePanel() {
    super();
    this.cssAddClass("z4signedvaluepanel");
    this.setLayout(new GridBagLayout());
    
    this.signPanel.addChangeListener(event -> this.onSignedValueChange());
    
    this.valueSpinner.setModel(new SpinnerNumberModel(0, 0, 50, 1));
    this.valueSpinner.addChangeListener(event -> this.onSignedValueChange());
    
    this.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0));
  }
  
  private void onSignedValueChange() {
    this.value = new Z4SignedValue(this.signPanel.getValue(), this.valueSpinner.getValue());
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
  public void setLabel(String label) {
    this.label.setText(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
  public void setRange(int min, int max) {
    this.valueSpinner.setModel(new SpinnerNumberModel(min, min, max, 1));
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueSpinner.getValueIsAdjusting();
  }
  
  @Override
  public void setValue(Z4SignedValue value) {
    this.value = value;
    
    this.signPanel.setValue(value.getSign());
    this.valueSpinner.setValue(value.getValue());
  }
  
  @Override
  public void setEnabled(boolean b) {
    this.signPanel.setEnabled(b);
    this.valueSpinner.setEnabled(b);
  }
}
