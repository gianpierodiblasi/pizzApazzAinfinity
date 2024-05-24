package pizzapazza.ui.panel;

import def.js.Number;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;

/**
 * The panel to create a new image
 *
 * @author gianpiero.diblasi
 */
public class Z4NewImagePanel extends JSPanel {

  private final JSSpinner width = new JSSpinner();
  private final JSSpinner height = new JSSpinner();
  private final JSSpinner resolution = new JSSpinner();
  private final JSLabel dimensionMM = new JSLabel();
  private final JSLabel dimensionIN = new JSLabel();

  public Z4NewImagePanel() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.setLayout(new GridBagLayout());

    this.addLabel(Z4Translations.WIDTH + " (px)", 0, 0, 1, 0);
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    this.addLabel(Z4Translations.HEIGHT + " (px)", 1, 0, 1, 0);
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    this.addLabel(Z4Translations.RESOLUTION + " (dpi)", 2, 0, 1, 0);
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.addDimension(this.dimensionMM, 3);
    this.addDimension(this.dimensionIN, 4);
    this.addLabel(Z4Translations.FILLING_COLOR, 0, 5, 3, 10);

    this.setDimensions();
  }

  private void addLabel(String text, int gridx, int gridy, int gridwidth, int top) {
    JSLabel label = new JSLabel();
    label.setText(text);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(top, 5, 0, 5);
    this.add(label, constraints);
  }

  private void addSpinner(JSSpinner spinner, double value, double max, int gridx, int gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event -> this.setDimensions());

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(0, 5, 0, 5);
    this.add(spinner, constraints);
  }

  private void addDimension(JSLabel label, int gridy) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridy = gridy;
    constraints.gridwidth = 3;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(2, 5, 0, 0);
    this.add(label, constraints);
  }

  private void setDimensions() {
    double w = this.width.getValue();
    double h = this.height.getValue();
    double res = this.resolution.getValue();

    double dimWIN = w / res;
    double dimHIN = h / res;

    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " \u2716 " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " \u2716 " + new Number(dimHIN).toFixed(2) + " inch");
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
  public Dimension getSelectedSize() {
    return new Dimension((int) this.width.getValue(), (int) this.height.getValue());
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
  public Object getSelectedFilling() {
    return null;
  }
}
