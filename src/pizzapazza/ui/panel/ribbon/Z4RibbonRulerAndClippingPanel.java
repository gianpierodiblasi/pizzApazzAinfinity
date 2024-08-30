package pizzapazza.ui.panel.ribbon;

import static def.dom.Globals.document;
import def.dom.MouseEvent;
import javascript.awt.BoxLayout;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4DropDown;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.window;

/**
 * The ribbon panel containing the ruler and clipping menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonRulerAndClippingPanel extends Z4AbstractRibbonPanel {

  private final JSComponent rulers = new JSComponent(document.createElement("img"));

  private final JSSlider topSlider = new JSSlider();
  private final JSSpinner topSpinner = new JSSpinner();
  private final JSSlider bottomSlider = new JSSlider();
  private final JSSpinner bottomSpinner = new JSSpinner();
  private final JSSlider leftSlider = new JSSlider();
  private final JSSpinner leftSpinner = new JSSpinner();
  private final JSSlider rightSlider = new JSSlider();
  private final JSSpinner rightSpinner = new JSSpinner();

  private final JSPanel clippingsPreview = new JSPanel();

  private Z4StatusPanel statusPanel;

  private Z4Canvas canvas;

  private boolean showTopRuler;
  private boolean showBottomRuler;
  private boolean showLeftRuler;
  private boolean showRightRuler;

  /**
   * Creates the object
   */
  public Z4RibbonRulerAndClippingPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonrulerandclippingpanel");

    this.addRulers();
    Z4UI.addVLine(this, new GBC(1, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.clippingsPreview.setLayout(new BoxLayout(this.clippingsPreview, BoxLayout.X_AXIS));
    this.clippingsPreview.getStyle().overflowX = "scroll";
    this.add(this.clippingsPreview, new GBC(2, 0).h(2).wx(1).f(GBC.BOTH));
  }

  private void addRulers() {
    Z4DropDown dropDown = new Z4DropDown(".z4ribbonrulerandclippingpanel-rulers");
    dropDown.cssAddClass("z4ribbonrulerandclippingpaneldropdown");
    this.add(dropDown, new GBC(0, 1).a(GBC.NORTHWEST).i(5, 5, 5, 5));

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.RULER);
    dropDown.appendChildInTree("summary", label);

    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4ribbonrulerandclippingpanel-rulers");
    panel.setLayout(new GridBagLayout());
    dropDown.appendChild(panel);

    this.rulers.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.rulers.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.rulers.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    panel.add(this.rulers, new GBC(1, 1).wh(2, 2));

    Z4UI.setVerticalSpinner(this.topSpinner);
    this.topSpinner.addChangeListener(event -> this.onchange(true, this.topSpinner, this.topSlider, this.bottomSpinner, this.bottomSlider, this.canvas.getSize().height, this.topSpinner.getValueIsAdjusting()));
    panel.add(this.topSpinner, new GBC(1, 0).a(GBC.NORTH));

    this.topSlider.setOrientation(JSSlider.VERTICAL);
    this.topSlider.setInverted(true);
    this.topSlider.getStyle().minWidth = "1.5rem";
    this.topSlider.getStyle().minHeight = "20rem";
    this.topSlider.addChangeListener(event -> this.onchange(false, this.topSpinner, this.topSlider, this.bottomSpinner, this.bottomSlider, this.canvas.getSize().height, this.topSlider.getValueIsAdjusting()));
    panel.add(this.topSlider, new GBC(2, 0).a(GBC.WEST).wx(1));

    Z4UI.setVerticalSpinner(this.bottomSpinner);
    this.bottomSpinner.addChangeListener(event -> this.onchange(true, this.bottomSpinner, this.bottomSlider, this.topSpinner, this.topSlider, this.canvas.getSize().height, this.bottomSpinner.getValueIsAdjusting()));
    panel.add(this.bottomSpinner, new GBC(1, 3).a(GBC.SOUTH));

    this.bottomSlider.setOrientation(JSSlider.VERTICAL);
    this.bottomSlider.getStyle().minWidth = "1.5rem";
    this.bottomSlider.getStyle().minHeight = "20rem";
    this.bottomSlider.addChangeListener(event -> this.onchange(false, this.bottomSpinner, this.bottomSlider, this.topSpinner, this.topSlider, this.canvas.getSize().height, this.bottomSlider.getValueIsAdjusting()));
    panel.add(this.bottomSlider, new GBC(2, 3).a(GBC.WEST).wx(1));

    this.leftSpinner.cssAddClass("jsspinner_w_4rem");
    this.leftSpinner.addChangeListener(event -> this.onchange(true, this.leftSpinner, this.leftSlider, this.rightSpinner, this.rightSlider, this.canvas.getSize().width, this.leftSpinner.getValueIsAdjusting()));
    panel.add(this.leftSpinner, new GBC(0, 1).a(GBC.WEST));

    this.leftSlider.getStyle().minWidth = "20rem";
    this.leftSlider.addChangeListener(event -> this.onchange(false, this.leftSpinner, this.leftSlider, this.rightSpinner, this.rightSlider, this.canvas.getSize().width, this.leftSlider.getValueIsAdjusting()));
    panel.add(this.leftSlider, new GBC(0, 2).a(GBC.NORTH).wy(1));

    this.rightSpinner.cssAddClass("jsspinner_w_4rem");
    this.rightSpinner.addChangeListener(event -> this.onchange(true, this.rightSpinner, this.rightSlider, this.leftSpinner, this.leftSlider, this.canvas.getSize().width, this.rightSpinner.getValueIsAdjusting()));
    panel.add(this.rightSpinner, new GBC(3, 1).a(GBC.EAST));

    this.rightSlider.getStyle().minWidth = "20rem";
    this.rightSlider.setInverted(true);
    this.rightSlider.addChangeListener(event -> this.onchange(false, this.rightSpinner, this.rightSlider, this.leftSpinner, this.leftSlider, this.canvas.getSize().width, this.rightSlider.getValueIsAdjusting()));
    panel.add(this.rightSlider, new GBC(3, 2).a(GBC.NORTH).wy(1));

    this.setRulers(false, false, false, false);
  }

  private void onMouse(MouseEvent event, String type) {
    boolean insideTop = (16 < event.offsetX && event.offsetX < 48) && (0 < event.offsetY && event.offsetY < 12);
    boolean insideBottom = (16 < event.offsetX && event.offsetX < 48) && (52 < event.offsetY && event.offsetY < 64);
    boolean insideLeft = (0 < event.offsetX && event.offsetX < 12) && (16 < event.offsetY && event.offsetY < 48);
    boolean insideRight = (52 < event.offsetX && event.offsetX < 64) && (16 < event.offsetY && event.offsetY < 48);

    switch (type) {
      case "down":
        this.showTopRuler = insideTop ? !this.showTopRuler : this.showTopRuler;
        this.showBottomRuler = insideBottom ? !this.showBottomRuler : this.showBottomRuler;
        this.showLeftRuler = insideLeft ? !this.showLeftRuler : this.showLeftRuler;
        this.showRightRuler = insideRight ? !this.showRightRuler : this.showRightRuler;
        this.canvas.setRulers(this.showTopRuler, this.showBottomRuler, this.showLeftRuler, this.showRightRuler, this.topSlider.getValue(), this.bottomSlider.getValue(), this.leftSlider.getValue(), this.rightSlider.getValue());
        break;
      case "move":
      case "leave":
        this.rulers.getStyle().cursor = insideTop || insideBottom || insideLeft || insideRight ? "pointer" : "default";
        break;
    }

    this.setRulers(insideTop, insideBottom, insideLeft, insideRight);
  }

  private void setRulers(boolean insideTop, boolean insideBottom, boolean insideLeft, boolean insideRight) {
    String color = Color.fromRGB_HEX(window.getComputedStyle(document.body).getPropertyValue("--main-action-bgcolor")).getRGB_String();

    this.rulers.getStyle().backgroundImage
            = "url( \"data:image/svg+xml,"
            + "<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'>"
            + "<rect x='16' y='0' width='32' height='12' fill='" + (this.showTopRuler ? color : "transparent") + "' stroke='" + (insideTop ? "black" : "transparent") + "'/>"
            + "<rect x='16' y='52' width='32' height='12' fill='" + (this.showBottomRuler ? color : "transparent") + "' stroke='" + (insideBottom ? "black" : "transparent") + "'/>"
            + "<rect x='0' y='16' width='12' height='32' fill='" + (this.showLeftRuler ? color : "transparent") + "' stroke='" + (insideLeft ? "black" : "transparent") + "'/>" + ""
            + "<rect x='52' y='16' width='12' height='32' fill='" + (this.showRightRuler ? color : "transparent") + "' stroke='" + (insideRight ? "black" : "transparent") + "'/>"
            + "</svg>"
            + "\")";

    this.topSlider.setEnabled(this.showTopRuler);
    this.topSpinner.setEnabled(this.showTopRuler);
    this.bottomSlider.setEnabled(this.showBottomRuler);
    this.bottomSpinner.setEnabled(this.showBottomRuler);
    this.leftSlider.setEnabled(this.showLeftRuler);
    this.leftSpinner.setEnabled(this.showLeftRuler);
    this.rightSlider.setEnabled(this.showRightRuler);
    this.rightSpinner.setEnabled(this.showRightRuler);
  }

  private void onchange(boolean spTosl, JSSpinner spinner, JSSlider slider, JSSpinner otherSpinner, JSSlider otherSlider, int max, boolean adjusting) {
    if (adjusting) {
      document.querySelector(".z4ribbonrulerandclippingpaneldropdown").setAttribute("transparent", "true");
    } else {
      document.querySelector(".z4ribbonrulerandclippingpaneldropdown").removeAttribute("transparent");
    }

    if ($exists(spinner) && spTosl) {
      slider.setValue((int) spinner.getValue());
    } else if ($exists(spinner)) {
      spinner.setValue(slider.getValue());
    }

    if (slider.getValue() + otherSlider.getValue() + 2 * Z4Canvas.RULER_SIZE >= max) {
      otherSlider.setValue(max - slider.getValue() - 2 * Z4Canvas.RULER_SIZE);
      otherSpinner.setValue(max - slider.getValue() - 2 * Z4Canvas.RULER_SIZE);
    }

    this.setRulers(false, false, false, false);
    this.canvas.setRulers(this.showTopRuler, this.showBottomRuler, this.showLeftRuler, this.showRightRuler, this.topSlider.getValue(), this.bottomSlider.getValue(), this.leftSlider.getValue(), this.rightSlider.getValue());
  }

  /**
   * Refreshes the canvas size
   *
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
  public void refreshCanvasSize(boolean resetOnlySize) {
    Dimension size = this.canvas.getSize();

    if (!resetOnlySize) {
      this.showTopRuler = false;
      this.showBottomRuler = false;
      this.showLeftRuler = false;
      this.showRightRuler = false;
    }

    this.topSpinner.setModel(new SpinnerNumberModel(0, 0, size.height - 2 * Z4Canvas.RULER_SIZE, 1));
    this.topSlider.setMaximum(size.height - 2 * Z4Canvas.RULER_SIZE);
    this.topSlider.setValue(0);

    this.bottomSpinner.setModel(new SpinnerNumberModel(0, 0, size.height - 2 * Z4Canvas.RULER_SIZE, 1));
    this.bottomSlider.setMaximum(size.height - 2 * Z4Canvas.RULER_SIZE);
    this.bottomSlider.setValue(0);

    this.leftSpinner.setModel(new SpinnerNumberModel(0, 0, size.width - 2 * Z4Canvas.RULER_SIZE, 1));
    this.leftSlider.setMaximum(size.width - 2 * Z4Canvas.RULER_SIZE);
    this.leftSlider.setValue(0);

    this.rightSpinner.setModel(new SpinnerNumberModel(0, 0, size.width - 2 * Z4Canvas.RULER_SIZE, 1));
    this.rightSlider.setMaximum(size.width - 2 * Z4Canvas.RULER_SIZE);
    this.rightSlider.setValue(0);

    this.setRulers(false, false, false, false);
    this.canvas.setRulers(this.showTopRuler, this.showBottomRuler, this.showLeftRuler, this.showRightRuler, this.topSlider.getValue(), this.bottomSlider.getValue(), this.leftSlider.getValue(), this.rightSlider.getValue());
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
    this.refreshCanvasSize(false);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Resets the drawing tools preview
   */
  public void reset() {
    this.clippingsPreview.setProperty("innerHTML", "");
  }
}
