package pizzapazza.ui.panel.math.geometricshape;

import static def.dom.Globals.document;
import def.js.Array;
import def.js.Object;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4Point;
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.math.geometricshape.Z4GeometricShapeSpinnerConfiguration;
import pizzapazza.math.geometricshape.Z4Polyline;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;

/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapePreview extends JSDropDown {

  private final JSPanel summary = new JSPanel();
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private final JSPanel editor = new JSPanel();
  private final JSSlider xSlider = new JSSlider();
  private final JSSpinner xSpinner = new JSSpinner();
  private final JSSlider ySlider = new JSSlider();
  private final JSSpinner ySpinner = new JSSpinner();
  private final JSPanel radioPanel = new JSPanel();
  private final JSPanel spinnerPanel = new JSPanel();

  private Z4ShapesAndPathsPanel shapesAndPathsPanel;
  private Z4Canvas canvas;
  private Z4GeometricShape shape;
  private double zoom = 1;
  private int selectedControlPoint = 0;
  private boolean changed;
  private boolean spinnerPanelDone;

  /**
   * The text content for the selected button
   */
  public final static String SELECTED_GEOMETRIC_SHAPE_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  public final static String UNSELECTED_GEOMETRIC_SHAPE_CONTENT = "-";

  private final static int PREVIEW_SIZE = 75;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4GeometricShapePreview() {
    super(".z4geometricshapepreview-editor");
    this.cssAddClass("z4geometricshapepreview");

    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.changed = false;
      } else if (this.changed) {
        this.canvas.setSaved(false);
      }
    });

    this.preview.setAttribute("width", "" + Z4GeometricShapePreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4GeometricShapePreview.PREVIEW_SIZE);

    this.summary.setLayout(new GridBagLayout());

    this.summary.add(this.preview, new GBC(0, 0));

    JSButton selector = new JSButton();
    selector.setText(Z4GeometricShapePreview.SELECTED_GEOMETRIC_SHAPE_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4geometricshapepreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event -> {
      document.querySelectorAll(".z4geometricshapepreview .z4geometricshapepreview-selector").forEach(element -> element.textContent = Z4GeometricShapePreview.UNSELECTED_GEOMETRIC_SHAPE_CONTENT);
      selector.setText(Z4GeometricShapePreview.SELECTED_GEOMETRIC_SHAPE_CONTENT);
      this.canvas.setSelectedGeometricShape(this.shape, this.selectedControlPoint);
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));

    this.appendChildInTree("summary", this.summary);

    this.editor.cssAddClass("z4geometricshapepreview-editor");
    this.editor.setLayout(new GridBagLayout());

    Z4UI.addLabel(this.editor, "x", new GBC(0, 0).a(GBC.WEST));

    this.xSpinner.cssAddClass("jsspinner_w_4rem");
    this.xSpinner.addChangeListener(event -> this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider));
    this.editor.add(this.xSpinner, new GBC(1, 0).a(GBC.EAST));

    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event -> this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider));
    this.editor.add(this.xSlider, new GBC(0, 1).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));

    Z4UI.addVLine(this.editor, new GBC(2, 0).h(6).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this.editor, "y", new GBC(3, 3).h(3).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");

    this.editor.add(this.radioPanel, new GBC(0, 2).wh(2, 2).f(GBC.BOTH));
    this.spinnerPanel.setLayout(new GridBagLayout());
    this.editor.add(this.spinnerPanel, new GBC(0, 4).w(2).f(GBC.BOTH));

    this.ySpinner.cssAddClass("jsspinner-vertical");
    this.ySpinner.cssAddClass("jsspinner_h_4rem");
    this.ySpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.ySpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.ySpinner.addChangeListener(event -> this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider));
    this.editor.add(this.ySpinner, new GBC(3, 0).h(3).a(GBC.NORTH));

    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.getStyle().minWidth = "1.5rem";
    this.ySlider.addChangeListener(event -> this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider));
    this.editor.add(this.ySlider, new GBC(4, 0).h(6).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));

    JSButton button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event -> {
      this.changed = true;
      this.canvas.addGeometricShape(Z4GeometricShape.fromJSON(this.shape.toJSON()));
      this.removeAttribute("open");
      setTimeout(() -> document.querySelector(".z4geometricshapepreview:nth-last-child(1)").setAttribute("open", "open"), 0);
    });
    this.editor.add(button, new GBC(0, 5).a(GBC.SOUTHWEST));

    button = new JSButton();
    button.setText(Z4Translations.DELETE);
    button.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_SHAPES_AND_PATHS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.changed = true;
        int index = this.canvas.deleteGeometricShape(this.shape);
        document.querySelector(".z4geometricshapepreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    this.editor.add(button, new GBC(1, 5).a(GBC.SOUTHEAST));
//    
//    this.addButton(panelTransform, "", 3, 1, event -> this.setGeometriShape(this.canvas, this.shape)).cssAddClass("z4geometricshapepreview-setgeometricshape");

    this.appendChild(this.editor);
  }

  private void onChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    this.changed = true;

    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    if (adjusting) {
      this.editor.setAttribute("transparent", "true");
    } else {
      this.editor.removeAttribute("transparent");
    }

    Z4GeometricShape newShape = this.shape.fromDataChanged(this.shape.getControlPoints(), this.xSlider.getValue(), this.ySlider.getValue(), this.selectedControlPoint, 0, -1, this.canvas.getSize().width, this.canvas.getSize().height);
    this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
    this.setGeometriShape(this.canvas, newShape);
  }

  /**
   * Sets the shapes and paths panel
   *
   * @param shapesAndPathsPanel The shapes and paths panel
   */
  public void setShapesAndPathsPanel(Z4ShapesAndPathsPanel shapesAndPathsPanel) {
    this.shapesAndPathsPanel = shapesAndPathsPanel;
  }

  /**
   * Sets the geometric shape
   *
   * @param canvas The canvas
   * @param shape The geometric shape
   */
  @SuppressWarnings({"StringEquality", "unchecked"})
  public void setGeometriShape(Z4Canvas canvas, Z4GeometricShape shape) {
    this.canvas = canvas;
    this.shape = shape;
//    this.layer.setLayerPreview(this);
//
    Dimension d = canvas.getSize();
    double ratio = d.width / d.height;
    double w = ratio > 1 ? Z4GeometricShapePreview.PREVIEW_SIZE : Z4GeometricShapePreview.PREVIEW_SIZE * ratio;
    double h = ratio > 1 ? Z4GeometricShapePreview.PREVIEW_SIZE / ratio : Z4GeometricShapePreview.PREVIEW_SIZE;
    this.zoom = Math.min(w / d.width, h / d.height);

    this.preview.setAttribute("width", "" + w);
    this.preview.setAttribute("height", "" + h);
    this.preview.getStyle().marginTop = (Z4GeometricShapePreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginBottom = (Z4GeometricShapePreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginLeft = (Z4GeometricShapePreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.preview.getStyle().marginRight = (Z4GeometricShapePreview.PREVIEW_SIZE - w - 1) / 2 + "px";

    this.radioPanel.setContent("");
    ButtonGroup buttonGroup = new ButtonGroup();
    this.shape.getControlPoints().forEach((controlPoint, index, array) -> {
      JSRadioButton radio = new JSRadioButton();
      radio.setSelected(index == this.selectedControlPoint);
      radio.setText("" + (index + 1));
      radio.addActionListener(event -> {
        this.selectedControlPoint = index;
        Z4Point p = this.shape.getControlPoints().$get(this.selectedControlPoint);
        this.xSlider.setValue(parseInt(p.x));
        this.xSpinner.setValue(parseInt(p.x));
        this.ySlider.setValue(parseInt(p.y));
        this.ySpinner.setValue(parseInt(p.y));

        this.canvas.replaceGeometricShape(this.shape, this.shape, this.selectedControlPoint);
      });

      this.radioPanel.add(radio, null);
      buttonGroup.add(radio);
    });

    if (!this.spinnerPanelDone) {
      Array<Array<Z4GeometricShapeSpinnerConfiguration>> map = new Array<>();
      Array<Z4GeometricShapeSpinnerConfiguration> spinnerConfigurations = this.shape.getSpinnerConfigurations();
      spinnerConfigurations.forEach(spinnerConfiguration -> {
        if (!$exists(map.$get(spinnerConfiguration.grouping))) {
          map.$set(spinnerConfiguration.grouping, new Array<>());
        }
        ((Array<Z4GeometricShapeSpinnerConfiguration>) map.$get(spinnerConfiguration.grouping)).push(spinnerConfiguration);
      });
      int max = $exists(Object.keys(map).length) ? Object.keys(map).map(key -> ((Array<Z4GeometricShapeSpinnerConfiguration>) map.$get(key)).length).reduce((accumulator, current, index, array) -> Math.max(accumulator, current)) : 0;

      Object.keys(map).forEach((key, index, array) -> {
        if ($exists(key)) {
          JSLabel grouping = new JSLabel();
          grouping.setText("" + key);
          this.spinnerPanel.add(grouping, new GBC(0, index * 3).w(max).a(GBC.WEST));
        }

        ((Array<Z4GeometricShapeSpinnerConfiguration>) map.$get(key)).forEach((spinnerConfiguration, index2, array2) -> {
          JSLabel label = new JSLabel();
          label.setText(spinnerConfiguration.label);
          this.spinnerPanel.add(label, new GBC(index2, index * 3 + 1).a(GBC.WEST));

          JSSpinner spinner = new JSSpinner();
          spinner.cssAddClass("jsspinner_w_4rem");
          spinner.setModel(new SpinnerNumberModel(spinnerConfiguration.value, spinnerConfiguration.minimum, spinnerConfiguration.maximum, 1));
          spinner.addChangeListener(event -> {
            Z4GeometricShape newShape = this.shape.fromDataChanged(this.shape.getControlPoints(), 0, 0, -1, spinner.getValue(), spinnerConfigurations.indexOf(spinnerConfiguration), this.canvas.getSize().width, this.canvas.getSize().height);
            this.canvas.replaceGeometricShape(this.shape, newShape, this.selectedControlPoint);
            this.setGeometriShape(this.canvas, newShape);
          });
          this.spinnerPanel.add(spinner, new GBC(index2, index * 3 + 2).f(GBC.HORIZONTAL).i(0, 0, 0, 5));
        });
      });
      this.spinnerPanelDone = true;
    }

    Z4Point p = this.shape.getControlPoints().$get(this.selectedControlPoint);
    Dimension dC = this.canvas.getSize();
    this.xSlider.setMinimum(0);
    this.xSlider.setMaximum(dC.width);
    this.xSlider.setValue(parseInt(p.x));
    this.xSpinner.setModel(new SpinnerNumberModel(parseInt(p.x), 0, dC.width, 1));
    this.ySlider.setMinimum(0);
    this.ySlider.setMaximum(dC.height);
    this.ySlider.setValue(parseInt(p.y));
    this.ySpinner.setModel(new SpinnerNumberModel(parseInt(p.y), 0, dC.height, 1));

    this.drawShape();
  }

  /**
   * Draws the geometric shape
   */
  public void drawShape() {
    if ($exists(this.shape)) {
      Z4Polyline polyline = this.shape.getPolyline();

      this.ctx.save();

      this.ctx.lineWidth = 3 / this.zoom;
      this.ctx.scale(this.zoom, this.zoom);

      Array<Double> dash = new Array<>();

      this.ctx.beginPath();
      polyline.getControlPoints().forEach((point, index, array) -> {
        if ($exists(index)) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          this.ctx.moveTo(point.x, point.y);
        }
      });
      this.ctx.strokeStyle = Z4Constants.$getStyle("green");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();

      dash.push(2.5, 2.5);

      this.ctx.beginPath();
      polyline.getControlPoints().forEach((point, index, array) -> {
        if ($exists(index)) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          this.ctx.moveTo(point.x, point.y);
        }
      });
      this.ctx.strokeStyle = Z4Constants.$getStyle("white");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}
