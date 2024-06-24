package pizzapazza.ui.panel.util;

import def.js.Array;
import javascript.swing.JSPanel;
import javascript.swing.JSTabbedPane;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4Translations;

/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
public class Z4DrawingToolPanel extends Z4AbstractValuePanel<Z4DrawingTool> {

  private final Array<String> cardPointIteratorSelectors = new Array<>("STAMPER", "TRACER", "AIRBRUSH", "SPIROGRAPH");
  private final Array<JSPanel> cardPointIteratorPanels = new Array<>(null, null, null, null);
  private final Array<String> cardPointIteratorEvalPanels = new Array<>("new Z4StamperPanel()", "new Z4TracerPanel()", "new Z4AirbrushPanel()", "new Z4SpirographPanel()");
  private final Array<String> cardPainterSelectors = new Array<>("SHAPE_2D", "CENTERED_FIGURE");
  private final Array<JSPanel> cardPainterPanels = new Array<>(null, null);
  private final Array<String> cardPainterEvalPanels = new Array<>("new Z4Shape2DPainterPanel()", "new Z4CenteredFigurePainterPanel()");
  private final Array<String> cardColorSelectors = new Array<>("COLOR", "GRADIENT_COLOR", "BIGRADIENT_COLOR");
  private final Array<JSPanel> cardColorPanels = new Array<>(null, null, null);
  private final Array<String> cardColorEvalPanels = new Array<>("new Z4ColorPanel()", "new Z4GradientColorPanel()", "new Z4BiGradientColorPanel()");

  private String selectedPointIteratorSelector = "STAMPER";
//  private JSPanel selectedPointIteratorPanel = this.cardPointIteratorPanels.$get(0);
  private String selectedPainterSelector = "SHAPE_2D";
//  private JSPanel selectedPainterPanel = this.cardPainterPanels.$get(0);
  private String selectedColorSelector = "COLOR";
//  private JSPanel selectedColorPanel = this.cardColorPanels.$get(0);

  public Z4DrawingToolPanel() {
    super();
    this.cssAddClass("z4drawingtoolpanel");

    JSTabbedPane pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, null);

    pane.addTab(Z4Translations.SETTINGS, new JSPanel());
    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
  }

  @Override
  public void setValue(Z4DrawingTool value) {
  }
}
