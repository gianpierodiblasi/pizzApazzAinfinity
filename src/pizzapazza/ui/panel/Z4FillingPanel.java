package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.BoxLayout;
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
import pizzapazza.color.Z4GradientColor;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.filler.Z4AbstractFillerPanel;
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
import static simulation.js.$Globals.document;

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

  private String selectedFillerSelector = "FLAT";
  private JSPanel selectedFillerPanel = this.cardFillerPanels.$get(0);

  private Color selectedColor = new Color(255, 255, 255, 255);

  /**
   * Creates the object
   */
  public Z4FillingPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");

    JSPanel panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    this.addComponent(panelRadio, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, 0, null);

    this.addVLine(1);

    JSPanel panelColor = new JSPanel();
    CardLayout cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.addComponent(panelColor, 2, GridBagConstraints.NORTH, GridBagConstraints.NONE, 1, new Insets(5, 0, 0, 0));

    this.addVLine(3);

    JSPanel panelFiller = new JSPanel();
    CardLayout cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    panelFiller.getStyle().display = "none";
    this.addComponent(panelFiller, 4, GridBagConstraints.NORTH, GridBagConstraints.NONE, 1, null);

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

    Z4GradientColorPanel gradientColorPanel = (Z4GradientColorPanel) this.cardColorPanels.$get(1);
    gradientColorPanel.addChangeListener(event -> {
      switch (this.selectedFillerSelector) {
        case "FLAT":
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
          ((Z4AbstractFillerPanel) this.selectedFillerPanel).drawPreview(gradientColorPanel.getValueIsAdjusting());
          break;
        case "TEXTURE":
          break;
        case "BIGRADIENT":
      }
    });

    ((Z4BiGradientColorPanel) this.cardColorPanels.$get(3)).setSpaceTimeLabelsVisible(false);

    ButtonGroup buttonGroup = new ButtonGroup();
    this.cardFillerSelectors.forEach((card, index, array) -> {
      JSRadioButton radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.setToggle();
      radio.setSelected(index == 0);
      radio.setIcon(new Z4EmptyImageProducer<>(index));
      radio.addActionListener(event -> {
        this.selectedFillerSelector = card;
        this.selectedFillerPanel = this.cardFillerPanels.$get(index);
        cardFiller.show(panelFiller, card);

        switch (card) {
          case "FLAT":
            cardColor.show(panelColor, "FLAT");

            panelFiller.getStyle().display = "none";
            panelColor.getStyle().display = "block";
            break;
          case "LINEAR":
          case "VERTEX":
          case "CONIC":
          case "SPIRAL":
          case "BEZIER":
          case "SINUSOIDAL":
            cardColor.show(panelColor, "GRADIENT");

            panelFiller.getStyle().display = "block";
            panelColor.getStyle().display = "block";

            ((Z4AbstractFillerPanel) this.selectedFillerPanel).drawPreview(false);
            break;
          case "TEXTURE":
            cardColor.show(panelColor, "NONE");

            panelFiller.getStyle().display = "block";
            panelColor.getStyle().display = "none";
            break;
          case "BIGRADIENT":
            cardColor.show(panelColor, "BIGRADIENT");

            panelFiller.getStyle().display = "none";
            panelColor.getStyle().display = "block";
            break;
        }
      });

      buttonGroup.add(radio);
      panelRadio.add(radio, null);

      panelFiller.add(this.cardFillerPanels.$get(index), card);
    });

    this.cardColorSelectors.forEach((card, index, array) -> {
      JSPanel panel = this.cardColorPanels.$get(index);
      panelColor.add(panel, card);

      switch (card) {
        case "FLAT":
          break;
        case "GRADIENT":
          Z4GradientColor gradientColor = ((Z4GradientColorPanel) panel).getGradientColor();
          this.cardFillerSelectors.forEach((card2, index2, array2) -> {
            switch (card2) {
              case "FLAT":
                break;
              case "LINEAR":
              case "VERTEX":
              case "CONIC":
              case "SPIRAL":
              case "BEZIER":
              case "SINUSOIDAL":
                ((Z4AbstractFillerPanel) this.cardFillerPanels.$get(index2)).setGradientColor(gradientColor);
                break;
              case "TEXTURE":
                break;
              case "BIGRADIENT":
            }
          });
          break;
        case "NONE":
          break;
        case "BIGRADIENT":
          break;
      }
    });
  }

  private void addVLine(int gridx) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    this.addComponent(div, gridx, GridBagConstraints.NORTH, GridBagConstraints.VERTICAL, 0, new Insets(1, 5, 1, 5));
  }

  private void addComponent(JSComponent component, int gridx, int anchor, int fill, double weightx, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridwidth = 1;
    constraints.gridheight = 1;
    constraints.anchor = anchor;
    constraints.fill = fill;
    constraints.weightx = weightx;
    constraints.weighty = 1;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
  public Object getSelectedFilling() {
    switch (this.selectedFillerSelector) {
      case "FLAT":
        return this.selectedColor;
      case "LINEAR":
      case "VERTEX":
      case "CONIC":
      case "SPIRAL":
      case "BEZIER":
      case "SINUSOIDAL":
      case "TEXTURE":
        return ((Z4AbstractFillerPanel) this.selectedFillerPanel).getSelectedFiller();
      case "BIGRADIENT":
        return ((Z4BiGradientColorPanel) this.cardColorPanels.$get(3)).getSelectedBiGradientColor();
      default:
        return null;
    }
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
  public void setSize(int width, int height) {
    this.cardFillerSelectors.forEach((card, index, array) -> {
      switch (card) {
        case "FLAT":
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
        case "TEXTURE":
          ((Z4AbstractFillerPanel) this.cardFillerPanels.$get(index)).setSize(width, height);
          break;
        case "BIGRADIENT":
          break;
      }
    });

    this.cardColorSelectors.forEach((card, index, array) -> {
      switch (card) {
        case "FLAT":
          break;
        case "GRADIENT":
          break;
        case "NONE":
          break;
        case "BIGRADIENT":
          ((Z4BiGradientColorPanel) this.cardColorPanels.$get(index)).setSize(width, height);
          break;
      }
    });
  }
}
