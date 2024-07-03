package pizzapazza.ui.panel;

import static def.js.Globals.parseFloat;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComboBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.MnR.DefaultKeyValueComboBoxModelAndRenderer;
import javascript.util.KeyValue;
import pizzapazza.math.Z4DrawingDirection;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Number;

/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
public class Z4StatusPanel extends JSPanel {

  private Z4Canvas canvas;

  private final JSLabel projectName = new JSLabel();
  private final JSComboBox<KeyValue<String, String>> zoom = new JSComboBox<>();
  private final JSLabel projectSize = new JSLabel();
  private final JSLabel mousePosition = new JSLabel();
  private final JSButton drawingDirection = new JSButton();
  private final Z4CanvasGridPanel canvasGridPanel = new Z4CanvasGridPanel();

  /**
   * Creates the object
   */
  public Z4StatusPanel() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());

    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.add(this.projectName, new GBC(0, 0).i(0, 5, 0, 5));

    this.addPipe(1);

    DefaultKeyValueComboBoxModelAndRenderer<String, String> zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer<>();
    Z4Constants.ZOOM_LEVEL.forEach(level -> zoomModelAndRenderer.addElement(new KeyValue<>("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue<>("FIT", Z4Translations.FIT));
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.getStyle().minWidth = "5rem";
    this.zoom.getChilStyleByQuery("ul").minWidth = "5rem";
    this.zoom.setSelectedItem(new KeyValue<>("1", ""));
    this.zoom.addActionListener(event -> this.onZoom());
    this.add(this.zoom, new GBC(2, 0).i(0, 5, 0, 5));

    this.addPipe(3);

    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " x " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.add(this.projectSize, new GBC(4, 0).i(0, 5, 0, 5));

    this.addPipe(5);

    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.add(this.mousePosition, new GBC(6, 0).i(0, 5, 0, 5));

    this.addPipe(7);

    this.drawingDirection.setContentAreaFilled(false);
    this.drawingDirection.setTooltip(Z4Translations.DRAWING_DIRECTION);
    this.drawingDirection.setIcon(new Z4EmptyImageProducer<>(""));
    this.drawingDirection.cssAddClass("z4drawingdirection");
    this.drawingDirection.cssAddClass("z4drawingdirection-free");
    this.drawingDirection.addActionListener(event -> this.setDrawingDirection(null));
    this.add(this.drawingDirection, new GBC(8, 0).i(0, 5, 0, 5));

    this.add(this.canvasGridPanel, new GBC(9, 0).i(0, 5, 0, 5));

    this.add(new JSLabel(), new GBC(10, 0).wx(1));
  }

  private void addPipe(int gridx) {
    JSLabel pipe = new JSLabel();
    pipe.setText("|");
    pipe.getStyle().minWidth = "0.5rem";
    pipe.getStyle().textAlign = "center";
    this.add(pipe, new GBC(gridx, 0).i(0, 5, 0, 5));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the project name
   *
   * @param projectName The project name
   */
  public void setProjectName(String projectName) {
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": " + projectName);
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
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
  public void setZoom(double zoom) {
    this.zoom.setSelectedItem(new KeyValue<>("" + zoom, ""));
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
  public void setDrawingDirection(Z4DrawingDirection drawingDirection) {
    this.drawingDirection.cssRemoveClass("z4drawingdirection-free");
    this.drawingDirection.cssRemoveClass("z4drawingdirection-horizontal");
    this.drawingDirection.cssRemoveClass("z4drawingdirection-vertical");

    if (drawingDirection == Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4drawingdirection-free");
    } else if (drawingDirection == Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-horizontal");
    } else if (drawingDirection == Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-vertical");
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4drawingdirection-horizontal");
      this.canvas.setDrawingDirection(Z4DrawingDirection.HORIZONTAL);
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-vertical");
      this.canvas.setDrawingDirection(Z4DrawingDirection.VERTICAL);
    } else if (this.canvas.getDrawingDirection() == Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4drawingdirection-free");
      this.canvas.setDrawingDirection(Z4DrawingDirection.FREE);
    }
  }

  /**
   * Resets the canvas grid panel
   */
  public void resetCanvasGridPanel() {
    this.canvasGridPanel.reset();
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
