package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.Color;
import javascript.swing.JSComponent;

/**
 * The component to preview a color
 *
 * @author gianpiero.diblasi
 */
public class Z4ColorPreview extends JSComponent {

  private final JSComponent component = new JSComponent(document.createElement("div"));
  private final JSComponent componentOpacity = new JSComponent(document.createElement("div"));

  /**
   * Creates the object
   */
  public Z4ColorPreview() {
    super(document.createElement("div"));

    this.cssAddClass("z4colorpreview");

    this.component.cssAddClass("z4colorpreview-opaque");
    this.appendChild(this.component);

    this.componentOpacity.cssAddClass("z4colorpreview-transparent");
    this.appendChild(this.componentOpacity);

    this.setColor(new Color(0, 0, 0, 255));
  }

  /**
   * Sets the color to preview
   *
   * @param color The color
   */
  public void setColor(Color color) {

    this.component.getStyle().backgroundColor = color.getRGB_String();
    this.componentOpacity.getStyle().backgroundColor = color.getRGBA_String();

    Array<Integer> rgb = new Array<>();
    Array<Double> hsl = new Array<>();
    rgb.$set(0, color.red);
    rgb.$set(1, color.green);
    rgb.$set(2, color.blue);
    Color.RGBtoHSL(rgb, hsl);
    this.getStyle().border = "1px solid " + (hsl.$get(2) > 0.5 ? color.darkened(0.1).getRGB_HEX() : color.lighted(0.1).getRGB_HEX());
  }
}
