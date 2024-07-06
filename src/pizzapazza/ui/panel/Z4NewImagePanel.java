package pizzapazza.ui.panel;

import def.js.Array;
import def.js.Number;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSpinner;
import javascript.swing.JSTabbedPane;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$typeof;

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

  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4NewImagePanel() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.getStyle().minWidth = "60rem";
    this.getStyle().minHeight = "45rem";

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.addTab(Z4Translations.DIMENSION, panel);

    Z4UI.addLabel(panel, Z4Translations.WIDTH + " (px)", new GBC(0, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    Z4UI.addLabel(panel, Z4Translations.HEIGHT + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(panel, this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    Z4UI.addLabel(panel, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    panel.add(this.dimensionMM, new GBC(0, 2).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    panel.add(this.dimensionIN, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));

    panel.add(new JSLabel(), new GBC(0, 4).wy(1));

    this.addTab(Z4Translations.FILLING, this.fillingPanel);

    this.setDimensions();
  }

  private void addSpinner(JSPanel panel, JSSpinner spinner, double value, double max, int gridx, int gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event -> this.setDimensions());
    panel.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

  private void setDimensions() {
    double w = this.width.getValue();
    double h = this.height.getValue();
    double res = this.resolution.getValue();

    double dimWIN = w / res;
    double dimHIN = h / res;

    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
    this.fillingPanel.setSize((int) w, (int) h);

    this.onchange();
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
    this.setDimensions();
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

  @Override
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  private void onchange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
