package pizzapazza.ui.panel.util;

import def.js.Array;
import static def.js.Globals.eval;
import javascript.awt.BoxLayout;
import javascript.awt.CardLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSTabbedPane;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4DrawingTool;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;

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

//  private String selectedPointIteratorSelector = "STAMPER";
  private JSPanel selectedPointIteratorPanel;
//  private String selectedPainterSelector = "SHAPE_2D";
  private JSPanel selectedPainterPanel;
//  private String selectedColorSelector = "COLOR";
  private JSPanel selectedColorPanel;

  public Z4DrawingToolPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");

    JSTabbedPane pane = new JSTabbedPane();
    pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(pane, new GBC(0, 1));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    pane.addTab(Z4Translations.SETTINGS, panel);

    JSPanel panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panel.add(panelRadio, new GBC(0, 0).i(0, 5, 0, 0));

    Z4UI.addVLine(panel, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));

    JSPanel panelCard = new JSPanel();
    CardLayout cardLayout = new CardLayout(0, 0);
    panelCard.setLayout(cardLayout);
    panel.add(panelCard, new GBC(2, 0).a(GBC.NORTH));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.selectedPointIteratorPanel = this.addRadioButtons(this.cardPointIteratorSelectors, this.cardPointIteratorPanels, this.cardPointIteratorEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);
    this.selectedPainterPanel = this.addRadioButtons(this.cardPainterSelectors, this.cardPainterPanels, this.cardPainterEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);
    this.selectedColorPanel = this.addRadioButtons(this.cardColorSelectors, this.cardColorPanels, this.cardColorEvalPanels, panelRadio, panelCard, cardLayout, buttonGroup);

    pane.addTab(Z4Translations.TRY_ME, new JSPanel());
  }

  @SuppressWarnings("StringEquality")
  private JSPanel addRadioButtons(Array<String> cardSelector, Array<JSPanel> cardPanels, Array<String> cardEvalPanels, JSPanel panelRadio, JSPanel panelCard, CardLayout cardLayout, ButtonGroup buttonGroup) {
    cardSelector.forEach((card, index, array) -> {
      JSRadioButton radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.getStyle().marginBottom = index == cardSelector.length - 1 ? "10px" : "1px";
      radio.setToggle();
      radio.cssAddClass("z4drawingtoolpanel-selector");
      radio.setSelected(cardSelector == this.cardPointIteratorSelectors && index == 0);
      radio.setIcon(new Z4EmptyImageProducer<>(index));

      radio.addActionListener(event -> {
        if (!$exists(cardPanels.$get(index))) {
          JSPanel panelEval = eval(cardEvalPanels.$get(index));
          cardPanels.$set(index, panelEval);
          panelCard.add(panelEval, card);
        }

        cardLayout.show(panelCard, card);
      });

      buttonGroup.add(radio);
      panelRadio.add(radio, null);
    });

    JSPanel panelEval = eval(cardEvalPanels.$get(0));
    if (cardSelector == this.cardColorSelectors) {
      panelEval.getStyle().minWidth = "15rem";
    }
    cardPanels.$set(0, panelEval);
    panelCard.add(panelEval, cardSelector.$get(0));
    return panelEval;
  }

  @Override
  public void setValue(Z4DrawingTool value) {
  }
}
