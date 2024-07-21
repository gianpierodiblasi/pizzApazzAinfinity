package pizzapazza.ui.frame;

import javascript.awt.BorderLayout;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.ui.panel.math.geometricshape.Z4ShapesAndPathsPanel;
import pizzapazza.ui.tab.Z4Ribbon;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.window;

/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Frame extends JSFrame {

  private final Z4Ribbon ribbon = new Z4Ribbon();
  private final Z4Canvas canvas = new Z4Canvas();
  private final Z4ShapesAndPathsPanel shapesAndPathsPanel = new Z4ShapesAndPathsPanel();
  private final Z4StatusPanel statusPanel = new Z4StatusPanel();

  /**
   * Creates the object
   */
  public Z4Frame() {
    super();
    this.cssAddClass("z4frame");

    this.ribbon.setCanvas(this.canvas);
    this.ribbon.setShapesAndPathsPanel(this.shapesAndPathsPanel);
    this.ribbon.setStatusPanel(this.statusPanel);
    this.canvas.setStatusPanel(this.statusPanel);
    this.canvas.setShapesAndPathsPanel(this.shapesAndPathsPanel);
    this.shapesAndPathsPanel.setStatusPanel(this.statusPanel);

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    panel.add(this.shapesAndPathsPanel, new GBC(0, 0).f(GBC.BOTH).wxy(1, 1));
    this.shapesAndPathsPanel.getStyle().display = "none";

    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
    this.getContentPane().add(panel, BorderLayout.EAST);
    this.getContentPane().add(this.statusPanel, BorderLayout.SOUTH);

    this.canvas.create(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));

    window.onbeforeunload = event -> {
      if (!this.canvas.isSaved()) {
        event.preventDefault();
        event.returnValue = Z4Translations.PROJECT_NOT_SAVED_MESSAGE;
        return event.returnValue;
      } else {
        return null;
      }
    };
  }
}
