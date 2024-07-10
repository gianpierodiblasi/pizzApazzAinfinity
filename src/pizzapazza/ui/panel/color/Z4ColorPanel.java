package pizzapazza.ui.panel.color;

import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.colorchooser.JSColorPreview;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.document;

/**
 * The panale to manage a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorPanel extends Z4AbstractValuePanel<Color> {

  private final JSLabel label = new JSLabel();
  private final JSColorPreview colorPreview = new JSColorPreview();
  private final JSButton edit = new JSButton();

  private boolean opacityVisible = true;

  /**
   * Creates the object
   */
  public Z4ColorPanel() {
    super();
    this.cssAddClass("z4colorpanel");
    this.setLayout(new GridBagLayout());

    this.add(this.label, new GBC(0, 0).w(2).a(GBC.WEST));
    this.add(this.colorPreview, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL));

    this.edit.setText(Z4Translations.EDIT);
    this.edit.addActionListener(event -> {
      JSColorChooser.showDialog(Z4Translations.COLOR, this.value, this.opacityVisible, null, c -> {
        this.setValue(c);
        this.onchange();
      });
    });
    this.add(this.edit, new GBC(1, 1).i(0, 5, 0, 0));

    this.setValue(new Color(0, 0, 0, 255));
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
  public void setLabel(String label) {
    this.label.setText(label);
  }

  @Override
  public void setValue(Color value) {
    this.value = value;
    this.colorPreview.setColor(value);

    Array<Integer> rgb = new Array<>();
    Array<Double> hsl = new Array<>();
    rgb.$set(0, value.red);
    rgb.$set(1, value.green);
    rgb.$set(2, value.blue);
    Color.RGBtoHSL(rgb, hsl);
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.edit.setEnabled(b);
  }

  /**
   * Sets the visibility of the edit button
   *
   * @param b true to show the edit button, false otherwise
   */
  public void setEditButtonVisible(boolean b) {
    this.edit.getStyle().display = b ? "flex" : "none";
  }

  /**
   * Sets the visibility of the opacity selector
   *
   * @param b true to show the opacity selector, false otherwise
   */
  public void setOpacityVisible(boolean b) {
    this.opacityVisible = b;
  }
}
