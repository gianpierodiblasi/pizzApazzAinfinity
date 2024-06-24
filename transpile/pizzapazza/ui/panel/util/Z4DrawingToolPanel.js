/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPanel extends Z4AbstractValuePanel {

   cardPointIteratorSelectors = new Array("STAMPER", "TRACER", "AIRBRUSH", "SPIROGRAPH");

   cardPointIteratorPanels = new Array(null, null, null, null);

   cardPointIteratorEvalPanels = new Array("new Z4StamperPanel()", "new Z4TracerPanel()", "new Z4AirbrushPanel()", "new Z4SpirographPanel()");

   cardPainterSelectors = new Array("SHAPE_2D", "CENTERED_FIGURE");

   cardPainterPanels = new Array(null, null);

   cardPainterEvalPanels = new Array("new Z4Shape2DPainterPanel()", "new Z4CenteredFigurePainterPanel()");

   cardColorSelectors = new Array("COLOR", "GRADIENT_COLOR", "BIGRADIENT_COLOR");

   cardColorPanels = new Array(null, null, null);

   cardColorEvalPanels = new Array("new Z4ColorPanel()", "new Z4GradientColorPanel()", "new Z4BiGradientColorPanel()");

   selectedPointIteratorSelector = "STAMPER";

  // private JSPanel selectedPointIteratorPanel = this.cardPointIteratorPanels.$get(0);
   selectedPainterSelector = "SHAPE_2D";

  // private JSPanel selectedPainterPanel = this.cardPainterPanels.$get(0);
   selectedColorSelector = "COLOR";

  // private JSPanel selectedColorPanel = this.cardColorPanels.$get(0);
  constructor() {
    super();
    this.cssAddClass("z4drawingtoolpanel");
    let pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, null);
    pane.addTab(Z4Translations.SETTINGS, new JSPanel());
    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
  }

   setValue(value) {
  }
}
