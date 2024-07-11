package pizzapazza.ui.panel;

import static def.js.Globals.eval;
import static def.js.Globals.parseFloat;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSToggleButton;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.swing.colorchooser.JSColorPreview;
import javascript.util.KeyValue;
import pizzapazza.math.Z4DrawingDirection;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4CanvasOverlayMode;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
import simulation.js.$Number;
import simulation.js.$String;

/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
public class Z4StatusPanel extends JSPanel {

  private Z4Canvas canvas;

  private final JSLabel projectName = new JSLabel();
  private final JSLabel projectSize = new JSLabel();
  private final JSComboBox<KeyValue<String, String>> zoom = new JSComboBox<>();
  private final JSLabel mousePosition = new JSLabel();
  private final JSLabel projectColor = new JSLabel();
  private final JSLabel layerColor = new JSLabel();
  private final JSColorPreview projectColorPreview = new JSColorPreview();
  private final JSColorPreview layerColorPreview = new JSColorPreview();
  private final JSToggleButton pickProjectColor = new JSToggleButton();
  private final JSToggleButton pickLayerColor = new JSToggleButton();
  private final JSButton drawingDirection = new JSButton();
  private final Z4CanvasGridPanel canvasGridPanel = new Z4CanvasGridPanel();

  /**
   * Creates the object
   */
  public Z4StatusPanel() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());

    this.projectName.cssAddClass("z4statuspanel-projectname");
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.add(this.projectName, new GBC(0, 0).w(2).a(GBC.WEST).i(0, 5, 0, 0));

    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " x " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.add(this.projectSize, new GBC(0, 1).a(GBC.WEST).i(0, 5, 0, 0));

    DefaultKeyValueComboBoxModelAndRenderer<String, String> zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    Z4Constants.ZOOM_LEVEL.forEach(level -> zoomModelAndRenderer.addElement(new KeyValue<>("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue<>("FIT", Z4Translations.FIT));
    this.zoom.cssAddClass("z4statuspanel-zoom");
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.setSelectedItem(new KeyValue<>("1", ""));
    this.zoom.addActionListener(event -> this.onZoom());
    this.add(this.zoom, new GBC(1, 1).a(GBC.EAST));

    Z4UI.addVLine(this, new GBC(2, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.add(this.mousePosition, new GBC(3, 0).h(2).i(0, 0, 0, 5));

    this.projectColor.getStyle().fontFamily = "monospace";
    this.add(this.projectColor, new GBC(4, 0));

    this.layerColor.getStyle().fontFamily = "monospace";
    this.add(this.layerColor, new GBC(4, 1));

    this.projectColorPreview.getStyle().visibility = "hidden";
    this.add(this.projectColorPreview, new GBC(5, 0));
    this.layerColorPreview.getStyle().visibility = "hidden";
    this.add(this.layerColorPreview, new GBC(5, 1));

    this.pickProjectColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickProjectColor.setIcon(new Z4EmptyImageProducer<>(""));
    this.pickProjectColor.addActionListener(event -> this.pickColor(this.pickProjectColor));
    this.add(this.pickProjectColor, new GBC(6, 0));

    this.pickLayerColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickLayerColor.setIcon(new Z4EmptyImageProducer<>(""));
    this.pickLayerColor.addActionListener(event -> this.pickColor(this.pickLayerColor));
    this.add(this.pickLayerColor, new GBC(6, 1));

    Z4UI.addVLine(this, new GBC(7, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.drawingDirection.setContentAreaFilled(false);
    this.drawingDirection.setTooltip(Z4Translations.DRAWING_DIRECTION);
    this.drawingDirection.setIcon(new Z4EmptyImageProducer<>(""));
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection");
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.addActionListener(event -> this.setDrawingDirection(null));
    this.add(this.drawingDirection, new GBC(8, 0).h(2));

    this.add(this.canvasGridPanel, new GBC(9, 0).h(2).f(GBC.VERTICAL).i(0, 5, 0, 0));

    this.add(new JSLabel(), new GBC(10, 0).wx(1));
  }

  private void pickColor(JSToggleButton pickColor) {
    boolean selected = pickColor.isSelected();

    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setSelected(false);
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setSelected(false);

    pickColor.setContentAreaFilled(selected);
    pickColor.setSelected(selected);

    if (selected) {
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR);
    } else {
      this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR);
    }
  }

  /**
   * A color has been picked
   *
   * @param projectColor The color picked from the project, it can be null
   * @param layerColor The color picked from the layer, it can be null
   */
  public void colorPicked(Color projectColor, Color layerColor) {
    if (this.pickProjectColor.isSelected() && $exists(projectColor)) {
      Color.pushHistory(projectColor);
      // MESSAGGIO DI COLOR PICKED
    } else if (this.pickLayerColor.isSelected() && $exists(layerColor)) {
      Color.pushHistory(layerColor);
      // MESSAGGIO DI COLOR PICKED
    }

    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setSelected(false);
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setSelected(false);

    setTimeout(() -> this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR), 0);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
    this.canvasGridPanel.setCanvas(canvas);
  }

  /**
   * Sets the project name
   *
   * @param projectName The project name
   */
  public void setProjectName(String projectName) {
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": " + projectName);
    this.projectName.setAttribute("title", projectName);
  }

  /**
   * Sets the project size
   *
   * @param width The width
   * @param height The height
   */
  public void setProjectSize(int width, int height) {
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + width + " x " + height);
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
  public void setMousePosition(int x, int y) {
    this.mousePosition.setText(new $Number(x).toFixed(0).padStart(4, "\u00A0") + " x " + new $Number(y).toFixed(0).padEnd(4, "\u00A0"));
    this.canvasGridPanel.setMousePosition(x, y);

    int diff = 0;
    eval("diff = Z4Translations.PROJECT.length - Z4Translations.LAYER.length;");

    Color color = $exists(this.canvas) ? this.canvas.getColorAt(x, y) : null;
    this.setColor(this.projectColor, this.projectColorPreview, color, Z4Translations.PROJECT, diff < 0 ? -diff : 0);
    color = $exists(this.canvas) ? this.canvas.getSelectedLayerColorAt(x, y) : null;
    this.setColor(this.layerColor, this.layerColorPreview, color, Z4Translations.LAYER, diff > 0 ? diff : 0);
  }

  private void setColor(JSLabel label, JSColorPreview preview, Color color, String string, int pad) {
    label.setText(
            string + ": " + new $String("").padStart(pad, "\u00A0")
            + "("
            + ($exists(color) ? new $Number(color.red).toFixed(0).padStart(3, "\u00A0") : "---") + ", "
            + ($exists(color) ? new $Number(color.green).toFixed(0).padStart(3, "\u00A0") : "---") + ", "
            + ($exists(color) ? new $Number(color.blue).toFixed(0).padStart(3, "\u00A0") : "---") + ", "
            + ($exists(color) ? new $Number(color.alpha).toFixed(0).padStart(3, "\u00A0") : "---")
            + ")"
    );

    preview.getStyle().visibility = $exists(color) ? "visible" : "hidden";
    if ($exists(color)) {
      preview.setColor(color);
    }
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    if (Z4Constants.ZOOM_LEVEL.indexOf(zoom) != -1) {
      this.zoom.setSelectedItem(new KeyValue<>("" + zoom, ""));
    } else {
      this.zoom.setSelectedItem(new KeyValue<>("FIT", ""));
    }
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
  public void setDrawingDirection(Z4DrawingDirection drawingDirection) {
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-horizontal");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-vertical");

    if (drawingDirection == Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    } else if (drawingDirection == Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
    } else if (drawingDirection == Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
      this.canvas.setDrawingDirection(Z4DrawingDirection.HORIZONTAL);
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
      this.canvas.setDrawingDirection(Z4DrawingDirection.VERTICAL);
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
      this.canvas.setDrawingDirection(Z4DrawingDirection.FREE);
    }
  }

  /**
   * Resets the canvas grid panel
   *
   * @param width The canvas width
   * @param height The canvas height
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
  public void resetCanvasGridPanel(int width, int height, boolean resetOnlySize) {
    this.canvasGridPanel.reset(width, height, resetOnlySize);
  }

  @SuppressWarnings({"unchecked", "StringEquality"})
  private void onZoom() {
    String key = ((KeyValue<String, String>) this.zoom.getSelectedItem()).key;
    if (key == "FIT") {
      this.canvas.fitZoom();
    } else {
      this.canvas.setZoom(parseFloat(key));
    }
  }
}
