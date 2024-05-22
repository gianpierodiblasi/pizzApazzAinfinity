package pizzapazza.ui.panel.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorPanel extends JSPanel {
  
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private final JSSlider rippleSlider = new JSSlider();
  
  private final Z4GradientColor gradientColor = new Z4GradientColor();
  private int selectedIndex;
  
  private static final int SELECTOR_RADIUS = 7;
  private static final int HEIGHT = 50;
  
  public Z4GradientColorPanel() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());
    
    this.preview.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.addComponent(this.preview, 0, 0, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);
    
    this.addLabel(Z4Translations.RIPPLE, 0, 1, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    
    this.rippleSlider.setMinimum(0);
    this.rippleSlider.setMaximum(100);
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.setPaintLabels(true);
    this.rippleSlider.setPaintTicks(true);
    this.rippleSlider.setPaintTrack(true);
    this.rippleSlider.setMajorTickSpacing(10);
    this.rippleSlider.addChangeListener(event -> this.onChange());
    this.addComponent(this.rippleSlider, 0, 5, 4, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    
    this.drawPreview(false);
  }
  
  private void addLabel(String text, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
  }
  
  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int weightx, int weighty, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }
  
  private void onMouse(MouseEvent event, String type) {
    
  }
  
  private void onChange() {
    this.gradientColor.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(this.rippleSlider.getValueIsAdjusting());
  }
  
  private void drawPreview(boolean adjusting) {
    int w = parseInt(this.preview.getProperty("width"));
    int h = parseInt(this.preview.getProperty("height"));
    
    ImageData imageData = this.ctx.createImageData(w, h);
    $Uint8Array data = ($Uint8Array) imageData.data;
    
    for (int x = 0; x < w; x++) {
      Color color = this.gradientColor.getColorAt(x / w, true);
      for (int y = 0; y < h; y++) {
        int index = (y * w + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    
    this.gradientColor.getColorPositions().forEach((position, index, array) -> this.drawCircle(w, h, position, index));
  }
  
  private void drawCircle(int w, int h, double position, int index) {
    Array<Double> dash = new Array<>();
    
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle(index == this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    
    dash.push(2.5, 2.5);
    
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }
  
  private String getStrokeStyle(String style) {
    return style;
  }
  
  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
