package pizzapazza.ui.panel;

import def.js.Number;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSpinner;
import javascript.swing.JSTabbedPane;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;

/**
 * The panel to create a new image
 *
 * @author gianpiero.diblasi
 */
public class Z4NewImagePanel extends JSTabbedPane {

  private final JSSpinner width = new JSSpinner();
  private final JSSpinner height = new JSSpinner();
  private final JSSpinner resolution = new JSSpinner();
  private final JSLabel dimensionMM = new JSLabel();
  private final JSLabel dimensionIN = new JSLabel();
  private final Z4FillingPanel fillingPanel = new Z4FillingPanel();

  /**
   * Creates the object
   */
  public Z4NewImagePanel() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.getStyle().minWidth = "60rem";
    this.getStyle().minHeight = "44rem";

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.addTab(Z4Translations.DIMENSION, panel);

    this.addLabel(panel, Z4Translations.WIDTH + " (px)", 0, 0, 1, 5);
    this.addSpinner(panel, this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    this.addLabel(panel, Z4Translations.HEIGHT + " (px)", 1, 0, 1, 5);
    this.addSpinner(panel, this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    this.addLabel(panel, Z4Translations.RESOLUTION + " (dpi)", 2, 0, 1, 5);
    this.addSpinner(panel, this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.addDimension(panel, this.dimensionMM, 3);
    this.addDimension(panel, this.dimensionIN, 4);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 5;
    constraints.weighty = 1;
    panel.add(new JSLabel(), constraints);

    this.addTab(Z4Translations.FILLING, this.fillingPanel);

    this.setDimensions();
  }

  private void addLabel(JSPanel panel, String text, int gridx, int gridy, int gridwidth, int top) {
    JSLabel label = new JSLabel();
    label.setText(text);

    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(top, 5, 0, 5);
    panel.add(label, constraints);
  }

  private void addSpinner(JSPanel panel, JSSpinner spinner, double value, double max, int gridx, int gridy) {
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
    panel.add(spinner, constraints);
  }

  private void addDimension(JSPanel panel, JSLabel label, int gridy) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridy = gridy;
    constraints.gridwidth = 3;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    constraints.insets = new Insets(2, 5, 0, 0);
    panel.add(label, constraints);
  }

  private void setDimensions() {
    double w = this.width.getValue();
    double h = this.height.getValue();
    double res = this.resolution.getValue();

    double dimWIN = w / res;
    double dimHIN = h / res;

    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " \u2716 " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " \u2716 " + new Number(dimHIN).toFixed(2) + " inch");
    this.fillingPanel.setSize((int) w, (int) h);
  }

  /**
   * Sets the selected size
   *
   * @param width The selected width
   * @param height The selected height
   */
  public void setSelectedSize(int width, int height) {
    this.width.setValue(width);
    this.height.setValue(height);
    this.fillingPanel.setSize(width, height);
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
    return this.fillingPanel.getSelectedFilling();
  }
}
