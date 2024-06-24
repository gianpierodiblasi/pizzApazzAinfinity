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

  // private String selectedPointIteratorSelector = "STAMPER";
   selectedPointIteratorPanel = null;

  // private String selectedPainterSelector = "SHAPE_2D";
   selectedPainterPanel = null;

  // private String selectedColorSelector = "COLOR";
   selectedColorPanel = null;

  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");
    let pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, new GBC(0, 1));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.SETTINGS, panel);
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panel.add(panelRadio, new GBC(0, 0).i(0, 5, 0, 0));
    Z4UI.addVLine(panel, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    let panelCard = new JSPanel();
    let cardLayout = new CardLayout(0, 0);
    panelCard.setLayout(cardLayout);
    panel.add(panelCard, new GBC(2, 0).a(GBC.NORTH));
    let buttonGroup = new ButtonGroup();
    this.selectedPointIteratorPanel = this.addRadioButtons(this.cardPointIteratorSelectors, this.cardPointIteratorPanels, this.cardPointIteratorEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);
    this.selectedPainterPanel = this.addRadioButtons(this.cardPainterSelectors, this.cardPainterPanels, this.cardPainterEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);
    this.selectedColorPanel = this.addRadioButtons(this.cardColorSelectors, this.cardColorPanels, this.cardColorEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);
    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
  }

   addRadioButtons(cardSelector, cardPanels, cardEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup) {
    cardSelector.forEach((card, index, array) => {
      let radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.getStyle().marginBottom = index === cardSelector.length - 1 ? "10px" : "1px";
      radio.setToggle();
      radio.cssAddClass("z4drawingtoolpanel-selector");
      radio.setSelected(cardSelector === this.cardPointIteratorSelectors && index === 0);
      radio.setIcon(new Z4EmptyImageProducer(index));
      radio.addActionListener(event => {
        if (!cardPanels[index]) {
          let panelEval = eval(cardEvalPanels[index]);
          cardPanels[index] = panelEval;
          panelCard.add(panelEval, card);
        }
        cardLayout.show(panelCard, card);
      });
      buttonGroup.add(radio);
      panelRadio.add(radio, null);
    });
    let panelEval = eval(cardEvalPanels[0]);
    if (cardSelector === this.cardColorSelectors) {
      panelEval.getStyle().minWidth = "15rem";
    }
    cardPanels[0] = panelEval;
    panelCard.add(panelEval, cardSelector[0]);
    return panelEval;
  }

   setValue(value) {
  }
}
