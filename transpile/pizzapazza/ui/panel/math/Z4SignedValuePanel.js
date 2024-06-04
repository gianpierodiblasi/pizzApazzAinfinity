/**
 * The panel to manage a signed value
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValuePanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   signPanel = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);

   valueSpinner = new JSSpinner();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4signedvaluepanel");
    this.setLayout(new GridBagLayout());
    this.signPanel.addChangeListener(event => this.onSignedValueChange());
    this.valueSpinner.setModel(new SpinnerNumberModel(0, 0, 50, 1));
    this.valueSpinner.addChangeListener(event => this.onSignedValueChange());
    this.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0));
  }

   onSignedValueChange() {
    this.value = new Z4SignedValue(this.signPanel.getValue(), this.valueSpinner.getValue());
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRange(min, max) {
    this.valueSpinner.setModel(new SpinnerNumberModel(min, min, max, 1));
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueSpinner.getValueIsAdjusting();
  }

   setValue(value) {
    this.value = value;
    this.signPanel.setValue(value.getSign());
    this.valueSpinner.setValue(value.getValue());
  }

   setEnabled(b) {
    this.signPanel.setEnabled(b);
    this.valueSpinner.setEnabled(b);
  }
}
