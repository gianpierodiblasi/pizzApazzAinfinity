package pizzapazza.ui.panel.math;

import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSLabel;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.Z4AbstractValuePanel;

/**
 * The panel to manage a signed value
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValuePanel extends Z4AbstractValuePanel<Z4SignedValue> {

  private final JSLabel label = new JSLabel();
  private final Z4SignPanel signPanel;
  private final JSSpinner valueSpinner = new JSSpinner();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4SignedValuePanel(Z4SignedValuePanelOrientation orientation) {
    super();
    this.cssAddClass("z4signedvaluepanel");
    this.setLayout(new GridBagLayout());

    if (orientation == Z4SignedValuePanelOrientation.HORIZONTAL) {
      this.add(this.label, new GBC(1, 0).a(GBC.WEST));

      this.signPanel = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.signPanel, new GBC(0, 0).h(2).a(GBC.SOUTH));

      this.add(this.valueSpinner, new GBC(1, 1).a(GBC.SOUTH).i(0, 1, 0, 0));
    } else if (orientation == Z4SignedValuePanelOrientation.VERTICAL) {
      this.add(this.label, new GBC(0, 0).a(GBC.WEST));

      this.signPanel = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
      this.add(this.signPanel, new GBC(0, 1));

      this.add(this.valueSpinner, new GBC(0, 2).f(GBC.HORIZONTAL).i(1, 0, 0, 0));
    } else {
      this.signPanel = null;
    }

    this.signPanel.addChangeListener(event -> this.onSignedValueChange());

    this.valueSpinner.cssAddClass("jsspinner_w_4rem");
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

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   */
  public void setSignVisible(boolean visible) {
    this.signPanel.getStyle().display = visible ? "grid" : "none";
  }
}
