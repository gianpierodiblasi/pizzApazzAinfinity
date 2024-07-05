package pizzapazza.ui.panel;

import def.js.Array;
import def.js.Number;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$typeof;

/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
public class Z4ResizeImagePanel extends JSPanel {

  private final JSSpinner width = new JSSpinner();
  private final JSSpinner height = new JSSpinner();
  private final JSSpinner resolution = new JSSpinner();
  private final JSLabel dimensionMM = new JSLabel();
  private final JSLabel dimensionIN = new JSLabel();
  
  private final JSSlider offsetXSlider = new JSSlider();
  private final JSSpinner offsetXSpinner = new JSSpinner();
  private final JSSlider offsetYSlider = new JSSlider();
  private final JSSpinner offsetYSpinner = new JSSpinner();
  
  private final JSRadioButton resizeByKeepingRatio = new JSRadioButton();
  private final JSRadioButton adaptByKeepingRatio = new JSRadioButton();
  private final JSRadioButton keepSize = new JSRadioButton();

  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4ResizeImagePanel() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());

    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 1);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 2, 1);
    this.add(this.dimensionMM, new GBC(0, 2).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    this.add(this.dimensionIN, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(this.resizeByKeepingRatio, buttonGroup, Z4Translations.RESIZE_BY_KEEPING_RATIO, true, 4);
    this.addRadio(this.adaptByKeepingRatio, buttonGroup, Z4Translations.ADAPT_BY_KEEPING_RATIO, false, 5);
    this.addRadio(this.keepSize, buttonGroup, Z4Translations.KEEP_SIZE, false, 6);
    
    this.setDimensions();
  }

  private void addSpinner(JSSpinner spinner, double value, double max, int gridx, int gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event -> this.setDimensions());
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 5, 0, 5));
  }

  private void addRadio(JSRadioButton radio, ButtonGroup buttonGroup, String text, boolean selected, int gridy) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event -> this.setDimensions());
    buttonGroup.add(radio);
    this.add(radio, new GBC(0, gridy).a(GBC.WEST).w(3));
  }

  private void setDimensions() {
    double w = this.width.getValue();
    double h = this.height.getValue();
    double res = this.resolution.getValue();

    double dimWIN = w / res;
    double dimHIN = h / res;

    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");

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
