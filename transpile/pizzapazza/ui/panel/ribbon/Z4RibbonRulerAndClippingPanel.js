/**
 * The ribbon panel containing the ruler and clipping menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonRulerAndClippingPanel extends Z4AbstractRibbonPanel {

   rulers = new JSComponent(document.createElement("img"));

   topSlider = new JSSlider();

   topSpinner = new JSSpinner();

   bottomSlider = new JSSlider();

   bottomSpinner = new JSSpinner();

   leftSlider = new JSSlider();

   leftSpinner = new JSSpinner();

   rightSlider = new JSSlider();

   rightSpinner = new JSSpinner();

   clippingsPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

   showTopRuler = false;

   showBottomRuler = false;

   showLeftRuler = false;

   showRightRuler = false;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonrulerandclippingpanel");
    this.addRulers();
    Z4UI.addVLine(this, new GBC(1, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.clippingsPreview.setLayout(new BoxLayout(this.clippingsPreview, BoxLayout.X_AXIS));
    this.clippingsPreview.getStyle().overflowX = "scroll";
    this.add(this.clippingsPreview, new GBC(2, 0).h(2).wx(1).f(GBC.BOTH));
  }

   addRulers() {
    let dropDown = new Z4DropDown(".z4ribbonrulerandclippingpanel-rulers");
    dropDown.cssAddClass("z4ribbonrulerandclippingpaneldropdown");
    this.add(dropDown, new GBC(0, 1).a(GBC.NORTHWEST).i(5, 5, 5, 5));
    let label = new JSLabel();
    label.setText(Z4Translations.RULER);
    dropDown.appendChildInTree("summary", label);
    let panel = new JSPanel();
    panel.cssAddClass("z4ribbonrulerandclippingpanel-rulers");
    panel.setLayout(new GridBagLayout());
    dropDown.appendChild(panel);
    this.rulers.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.rulers.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.rulers.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    panel.add(this.rulers, new GBC(1, 1).wh(2, 2));
    Z4UI.setVerticalSpinner(this.topSpinner);
    this.topSpinner.addChangeListener(event => this.onchange(true, this.topSpinner, this.topSlider, this.topSpinner.getValueIsAdjusting()));
    panel.add(this.topSpinner, new GBC(1, 0).a(GBC.NORTH));
    this.topSlider.setOrientation(JSSlider.VERTICAL);
    this.topSlider.setInverted(true);
    this.topSlider.getStyle().minWidth = "1.5rem";
    this.topSlider.getStyle().minHeight = "20rem";
    this.topSlider.addChangeListener(event => this.onchange(false, this.topSpinner, this.topSlider, this.topSlider.getValueIsAdjusting()));
    panel.add(this.topSlider, new GBC(2, 0).a(GBC.WEST).wx(1));
    Z4UI.setVerticalSpinner(this.bottomSpinner);
    this.bottomSpinner.addChangeListener(event => this.onchange(true, this.bottomSpinner, this.bottomSlider, this.bottomSpinner.getValueIsAdjusting()));
    panel.add(this.bottomSpinner, new GBC(1, 3).a(GBC.SOUTH));
    this.bottomSlider.setOrientation(JSSlider.VERTICAL);
    this.bottomSlider.getStyle().minWidth = "1.5rem";
    this.bottomSlider.getStyle().minHeight = "20rem";
    this.bottomSlider.addChangeListener(event => this.onchange(false, this.bottomSpinner, this.bottomSlider, this.bottomSlider.getValueIsAdjusting()));
    panel.add(this.bottomSlider, new GBC(2, 3).a(GBC.WEST).wx(1));
    this.leftSpinner.cssAddClass("jsspinner_w_4rem");
    this.leftSpinner.addChangeListener(event => this.onchange(true, this.leftSpinner, this.leftSlider, this.leftSpinner.getValueIsAdjusting()));
    panel.add(this.leftSpinner, new GBC(0, 1).a(GBC.WEST));
    this.leftSlider.getStyle().minWidth = "20rem";
    this.leftSlider.addChangeListener(event => this.onchange(false, this.leftSpinner, this.leftSlider, this.leftSlider.getValueIsAdjusting()));
    panel.add(this.leftSlider, new GBC(0, 2).a(GBC.NORTH).wy(1));
    this.rightSpinner.cssAddClass("jsspinner_w_4rem");
    this.rightSpinner.addChangeListener(event => this.onchange(true, this.rightSpinner, this.rightSlider, this.rightSpinner.getValueIsAdjusting()));
    panel.add(this.rightSpinner, new GBC(3, 1).a(GBC.EAST));
    this.rightSlider.getStyle().minWidth = "20rem";
    this.rightSlider.setInverted(true);
    this.rightSlider.addChangeListener(event => this.onchange(false, this.rightSpinner, this.rightSlider, this.rightSlider.getValueIsAdjusting()));
    panel.add(this.rightSlider, new GBC(3, 2).a(GBC.NORTH).wy(1));
    this.setRulers(false, false, false, false);
  }

   onMouse(event, type) {
    let insideTop = (16 < event.offsetX && event.offsetX < 48) && (0 < event.offsetY && event.offsetY < 12);
    let insideBottom = (16 < event.offsetX && event.offsetX < 48) && (52 < event.offsetY && event.offsetY < 64);
    let insideLeft = (0 < event.offsetX && event.offsetX < 12) && (16 < event.offsetY && event.offsetY < 48);
    let insideRight = (52 < event.offsetX && event.offsetX < 64) && (16 < event.offsetY && event.offsetY < 48);
    switch(type) {
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

   setRulers(insideTop, insideBottom, insideLeft, insideRight) {
    let color = Color.fromRGB_HEX(window.getComputedStyle(document.body).getPropertyValue("--main-action-bgcolor")).getRGB_String();
    this.rulers.getStyle().backgroundImage = "url( \"data:image/svg+xml," + "<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'>" + "<rect x='16' y='0' width='32' height='12' fill='" + (this.showTopRuler ? color : "transparent") + "' stroke='" + (insideTop ? "black" : "transparent") + "'/>" + "<rect x='16' y='52' width='32' height='12' fill='" + (this.showBottomRuler ? color : "transparent") + "' stroke='" + (insideBottom ? "black" : "transparent") + "'/>" + "<rect x='0' y='16' width='12' height='32' fill='" + (this.showLeftRuler ? color : "transparent") + "' stroke='" + (insideLeft ? "black" : "transparent") + "'/>" + "" + "<rect x='52' y='16' width='12' height='32' fill='" + (this.showRightRuler ? color : "transparent") + "' stroke='" + (insideRight ? "black" : "transparent") + "'/>" + "</svg>" + "\")";
    this.topSlider.setEnabled(this.showTopRuler);
    this.topSpinner.setEnabled(this.showTopRuler);
    this.bottomSlider.setEnabled(this.showBottomRuler);
    this.bottomSpinner.setEnabled(this.showBottomRuler);
    this.leftSlider.setEnabled(this.showLeftRuler);
    this.leftSpinner.setEnabled(this.showLeftRuler);
    this.rightSlider.setEnabled(this.showRightRuler);
    this.rightSpinner.setEnabled(this.showRightRuler);
  }

   onchange(spTosl, spinner, slider, adjusting) {
    if (adjusting) {
      document.querySelector(".z4ribbonrulerandclippingpaneldropdown").setAttribute("transparent", "true");
    } else {
      document.querySelector(".z4ribbonrulerandclippingpaneldropdown").removeAttribute("transparent");
    }
    if (spinner && spTosl) {
      slider.setValue(spinner.getValue());
    } else if (spinner) {
      spinner.setValue(slider.getValue());
    }
    this.setRulers(false, false, false, false);
    this.canvas.setRulers(this.showTopRuler, this.showBottomRuler, this.showLeftRuler, this.showRightRuler, this.topSlider.getValue(), this.bottomSlider.getValue(), this.leftSlider.getValue(), this.rightSlider.getValue());
  }

  /**
   * Refreshes the canvas size
   *
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   refreshCanvasSize(resetOnlySize) {
    let size = this.canvas.getSize();
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
   setCanvas(canvas) {
    this.canvas = canvas;
    this.refreshCanvasSize(false);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Resets the drawing tools preview
   */
   reset() {
    this.clippingsPreview.setProperty("innerHTML", "");
  }
}
