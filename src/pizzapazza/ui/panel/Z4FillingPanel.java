package pizzapazza.ui.panel;

import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.CardLayout;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.filler.Z4BezierFillerPanel;
import pizzapazza.ui.panel.filler.Z4ConicFillerPanel;
import pizzapazza.ui.panel.filler.Z4LinearFillerPanel;
import pizzapazza.ui.panel.filler.Z4SinusoidalFillerPanel;
import pizzapazza.ui.panel.filler.Z4SpiralFillerPanel;
import pizzapazza.ui.panel.filler.Z4TextureFillerPanel;
import pizzapazza.ui.panel.filler.Z4VertexBasedFillerPanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$exists;

/**
 * The panel to manage a filling
 *
 * @author gianpiero.diblasi
 */
public class Z4FillingPanel extends JSPanel {
  
  private final Array<String> cardFillerSelectors = new Array<>("FLAT", "LINEAR", "VERTEX", "CONIC", "SPIRAL", "BEZIER", "SINUSOIDAL", "TEXTURE", "BIGRADIENT");
  private final Array<JSPanel> cardFillerPanels = new Array<>(new JSPanel(), new Z4LinearFillerPanel(), new Z4VertexBasedFillerPanel(), new Z4ConicFillerPanel(), new Z4SpiralFillerPanel(), new Z4BezierFillerPanel(), new Z4SinusoidalFillerPanel(), new Z4TextureFillerPanel(), new JSPanel());
  private final Array<String> cardColorSelectors = new Array<>("FLAT", "GRADIENT", "NONE", "BIGRADIENT");
  private final Array<JSPanel> cardColorPanels = new Array<>(new JSPanel(), new Z4GradientColorPanel(), new JSPanel(), new Z4BiGradientColorPanel());
  private final Z4ColorPreview colorPreview = new Z4ColorPreview();
  
  private Color selectedColor = new Color(255, 255, 255, 255);

  /**
   * Creates the object
   */
  public Z4FillingPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");
    
    JSPanel panel = new JSPanel();
    this.addComponent(panel, 0, 0, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    
    JSPanel panelFiller = new JSPanel();
    CardLayout cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    this.addComponent(panelFiller, 0, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    
    JSComponent hline = this.addHLine(0, 2, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL);
    hline.getStyle().visibility = "hidden";
    
    JSPanel panelColor = new JSPanel();
    CardLayout cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.addComponent(panelColor, 0, 3, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    
    JSPanel flatPanel = this.cardColorPanels.$get(0);
    flatPanel.setLayout(new BorderLayout(5, 0));
    
    JSLabel label = new JSLabel();
    label.setText(Z4Translations.FILLING_COLOR);
    flatPanel.add(label, BorderLayout.NORTH);
    
    this.colorPreview.setColor(this.selectedColor);
    this.colorPreview.getStyle().alignSelf = "center";
    this.colorPreview.getStyle().minWidth = "15rem";
    flatPanel.add(this.colorPreview, BorderLayout.CENTER);
    
    JSButton button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event -> {
      JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.selectedColor, true, null, color -> {
        this.selectedColor = color;
        this.colorPreview.setColor(color);
      });
    });
    flatPanel.add(button, BorderLayout.EAST);
    
    ((Z4BiGradientColorPanel) this.cardColorPanels.$get(3)).setSpaceTimeLabelsVisible(false);
    
    ButtonGroup buttonGroup = new ButtonGroup();
    this.cardFillerSelectors.forEach((card, index, array) -> {
      JSRadioButton radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.setToggle();
      radio.setSelected(index == 0);
      radio.setIcon(new Z4EmptyImageProducer<>(index));
      radio.addActionListener(event -> {
        cardFiller.show(panelFiller, card);
        
        switch (card) {
          case "FLAT":
            cardColor.show(panelColor, "FLAT");
            hline.getStyle().visibility = "hidden";
            break;
          case "LINEAR":
          case "VERTEX":
          case "CONIC":
          case "SPIRAL":
          case "BEZIER":
          case "SINUSOIDAL":
            cardColor.show(panelColor, "GRADIENT");
            hline.getStyle().visibility = "visible";
            break;
          case "TEXTURE":
            cardColor.show(panelColor, "NONE");
            hline.getStyle().visibility = "hidden";
            break;
          case "BIGRADIENT":
            cardColor.show(panelColor, "BIGRADIENT");
            hline.getStyle().visibility = "hidden";
            break;
        }
      });
      
      buttonGroup.add(radio);
      panel.add(radio, null);
      
      panelFiller.add(this.cardFillerPanels.$get(index), card);
    });
    
    this.cardColorSelectors.forEach((card, index, array) -> panelColor.add(this.cardColorPanels.$get(index), card));
  }
  
  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int weightx, int weighty, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }
  
  private JSComponent addHLine(int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";
    this.addComponent(div, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, new Insets(2, 1, 2, 1));
    return div;
  }
}
