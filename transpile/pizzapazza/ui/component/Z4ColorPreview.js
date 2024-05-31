/**
 * The component to preview a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorPreview extends JSComponent {

   component = new JSComponent(document.createElement("div"));

   componentOpacity = new JSComponent(document.createElement("div"));

  /**
   * Creates the object
   */
  constructor() {
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
   setColor(color) {
    this.component.getStyle().backgroundColor = color.getRGB_String();
    this.componentOpacity.getStyle().backgroundColor = color.getRGBA_String();
    let rgb = new Array();
    let hsl = new Array();
    rgb[0] = color.red;
    rgb[1] = color.green;
    rgb[2] = color.blue;
    Color.RGBtoHSL(rgb, hsl);
    this.getStyle().border = "1px solid " + (hsl[2] > 0.5 ? color.darkened(0.1).getRGB_HEX() : color.lighted(0.1).getRGB_HEX());
  }
}
