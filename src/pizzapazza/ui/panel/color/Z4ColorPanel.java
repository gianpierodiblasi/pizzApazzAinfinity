package pizzapazza.ui.panel.color;

import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
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
  
  private final JSComponent container = new JSComponent(document.createElement("div"));
  private final JSComponent component = new JSComponent(document.createElement("div"));
  private final JSComponent componentOpacity = new JSComponent(document.createElement("div"));
  
  private final JSButton edit = new JSButton();

  /**
   * Creates the object
   */
  public Z4ColorPanel() {
    super();
    this.cssAddClass("z4colorpanel");
    this.setLayout(new GridBagLayout());
    
    this.add(this.label, new GBC(0, 0).w(2).a(GBC.WEST));
    
    this.container.cssAddClass("z4colorpanel-container");
    this.add(this.container, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL));
    
    this.component.cssAddClass("z4colorpanel-opaque");
    this.container.appendChild(this.component);
    
    this.componentOpacity.cssAddClass("z4colorpanel-transparent");
    this.container.appendChild(this.componentOpacity);
    
    this.edit.setText(Z4Translations.EDIT);
    this.edit.addActionListener(event -> {
      JSColorChooser.showDialog(Z4Translations.COLOR, this.value, true, null, c -> {
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
    this.component.getStyle().backgroundColor = value.getRGB_String();
    this.componentOpacity.getStyle().backgroundColor = value.getRGBA_String();
    
    Array<Integer> rgb = new Array<>();
    Array<Double> hsl = new Array<>();
    rgb.$set(0, value.red);
    rgb.$set(1, value.green);
    rgb.$set(2, value.blue);
    Color.RGBtoHSL(rgb, hsl);
    this.container.getStyle().border = "1px solid " + (hsl.$get(2) > 0.5 ? value.darkened(0.1).getRGB_HEX() : value.lighted(0.1).getRGB_HEX());
  }
  
  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.edit.setEnabled(b);
  }
}
