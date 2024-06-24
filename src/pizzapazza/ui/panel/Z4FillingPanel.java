package pizzapazza.ui.panel;

import def.js.Array;
import static def.js.Globals.eval;
import javascript.awt.BoxLayout;
import javascript.awt.CardLayout;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import pizzapazza.ui.panel.color.Z4BiGradientColorPanel;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.ui.panel.color.Z4GradientColorPanel;
import pizzapazza.ui.panel.filler.Z4AbstractFillerPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;

/**
 * The panel to manage a filling
 *
 * @author gianpiero.diblasi
 */
public class Z4FillingPanel extends JSPanel {

  private final Array<String> cardFillerSelectors = new Array<>("FLAT", "LINEAR", "VERTEX", "CONIC", "SPIRAL", "BEZIER", "SINUSOIDAL", "TEXTURE", "BIGRADIENT");
  private final Array<JSPanel> cardFillerPanels = new Array<>(new JSPanel(), null, null, null, null, null, null, null, new JSPanel());
  private final Array<String> cardFillerEvalPanels = new Array<>("", "new Z4LinearFillerPanel()", "new Z4VertexBasedFillerPanel()", "new Z4ConicFillerPanel()", "new Z4SpiralFillerPanel()", "new Z4BezierFillerPanel()", "new Z4SinusoidalFillerPanel()", "new Z4TextureFillerPanel()", "");
  private final Array<String> cardColorSelectors = new Array<>("FLAT", "GRADIENT", "NONE", "BIGRADIENT");
  private final Array<JSPanel> cardColorPanels = new Array<>(new Z4ColorPanel(), new Z4GradientColorPanel(), new JSPanel(), new Z4BiGradientColorPanel());

  private int width = Z4Constants.DEFAULT_IMAGE_SIZE;
  private int height = Z4Constants.DEFAULT_IMAGE_SIZE;

  private String selectedFillerSelector = "FLAT";
  private JSPanel selectedFillerPanel = this.cardFillerPanels.$get(0);

  private Color selectedColor = new Color(255, 255, 255, 255);

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4FillingPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");

    JSPanel panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    this.add(panelRadio, new GBC(0, 0).wy(1));

    Z4UI.addVLine(this, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));

    JSPanel panelColor = new JSPanel();
    CardLayout cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.add(panelColor, new GBC(2, 0).wxy(1, 1).a(GBC.NORTH).i(5, 0, 0, 0));

    Z4UI.addVLine(this, new GBC(3, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));

    JSPanel panelFiller = new JSPanel();
    CardLayout cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    panelFiller.getStyle().display = "none";
    this.add(panelFiller, new GBC(4, 0).wxy(1, 1).a(GBC.NORTH));

    Z4ColorPanel colorPanel = (Z4ColorPanel) this.cardColorPanels.$get(0);
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    colorPanel.setValue(this.selectedColor);
    colorPanel.getStyle().minWidth = "15rem";
    colorPanel.addChangeListener(event -> this.selectedColor = colorPanel.value);

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
      radio.getStyle().marginBottom = "1px";
      radio.setToggle();
      radio.setSelected(index == 0);
      radio.setIcon(new Z4EmptyImageProducer<>(index));
      radio.addActionListener(event -> {
        this.selectedFillerSelector = card;

        if ($exists(this.cardFillerPanels.$get(index))) {
          this.selectedFillerPanel = this.cardFillerPanels.$get(index);
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        } else if (card == "BEZIER") {
          Z4UI.pleaseWait(this, false, false, false, false, "", () -> {
            this.selectedFillerPanel = eval(this.cardFillerEvalPanels.$get(index));
            this.afterEval(panelFiller, card, index, gradientColorPanel);
            this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
          });
        } else {
          this.selectedFillerPanel = eval(this.cardFillerEvalPanels.$get(index));
          this.afterEval(panelFiller, card, index, gradientColorPanel);
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        }
      });

      buttonGroup.add(radio);
      panelRadio.add(radio, null);

      switch (card) {
        case "FLAT":
          panelFiller.add(this.cardFillerPanels.$get(index), card);
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
        case "TEXTURE":
          break;
        case "BIGRADIENT":
          panelFiller.add(this.cardFillerPanels.$get(index), card);
          break;
      }
    });

    this.cardColorSelectors.forEach((card, index, array) -> panelColor.add(this.cardColorPanels.$get(index), card));
  }

  private void afterEval(JSPanel panelFiller, String card, int index, Z4GradientColorPanel gradientColorPanel) {
    ((Z4AbstractFillerPanel) this.selectedFillerPanel).setSize(this.width, this.height);
    ((Z4AbstractFillerPanel) this.selectedFillerPanel).setGradientColor(gradientColorPanel.getGradientColor());
    this.cardFillerPanels.$set(index, this.selectedFillerPanel);
    panelFiller.add(this.selectedFillerPanel, card);
  }

  private void afterSelection(JSPanel panelFiller, CardLayout cardFiller, String card, JSPanel panelColor, CardLayout cardColor) {
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
    if (width > 0 && height > 0) {
      this.width = width;
      this.height = height;

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
            if ($exists(this.cardFillerPanels.$get(index))) {
              ((Z4AbstractFillerPanel) this.cardFillerPanels.$get(index)).setSize(width, height);
            }
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
}
