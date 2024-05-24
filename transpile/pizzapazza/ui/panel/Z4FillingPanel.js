/**
 * The panel to manage a filling
 *
 * @author gianpiero.diblasi
 */
class Z4FillingPanel extends JSPanel {

   cardFillerSelectors = new Array("FLAT", "LINEAR", "VERTEX", "CONIC", "SPIRAL", "BEZIER", "SINUSOIDAL", "TEXTURE", "BIGRADIENT");

   cardFillerPanels = new Array(new JSPanel(), new Z4LinearFillerPanel(), new Z4VertexBasedFillerPanel(), new Z4ConicFillerPanel(), new Z4SpiralFillerPanel(), new Z4BezierFillerPanel(), new Z4SinusoidalFillerPanel(), new Z4TextureFillerPanel(), new JSPanel());

   cardColorSelectors = new Array("FLAT", "GRADIENT", "NONE", "BIGRADIENT");

   cardColorPanels = new Array(new JSPanel(), new Z4GradientColorPanel(), new JSPanel(), new Z4BiGradientColorPanel());

   colorPreview = new Z4ColorPreview();

   selectedFillerSelector = "FLAT";

   selectedFillerPanel = this.cardFillerPanels[0];

   selectedColor = new Color(255, 255, 255, 255);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new BorderLayout(0, 0));
    this.cssAddClass("z4fillingpanel");
    let panelRadio = new JSPanel();
    this.add(panelRadio, BorderLayout.NORTH);
    let panelCenter = new JSPanel();
    this.add(panelCenter, BorderLayout.CENTER);
    let panelFiller = new JSPanel();
    let cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    panelFiller.getStyle().display = "none";
    panelCenter.add(panelFiller, null);
    let vline = this.addVLine(panelCenter);
    vline.getStyle().display = "none";
    let panelColor = new JSPanel();
    let cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    panelCenter.add(panelColor, null);
    let flatPanel = this.cardColorPanels[0];
    flatPanel.setLayout(new BorderLayout(5, 0));
    let label = new JSLabel();
    label.setText(Z4Translations.FILLING_COLOR);
    flatPanel.add(label, BorderLayout.NORTH);
    this.colorPreview.setColor(this.selectedColor);
    this.colorPreview.getStyle().alignSelf = "center";
    this.colorPreview.getStyle().minWidth = "15rem";
    flatPanel.add(this.colorPreview, BorderLayout.CENTER);
    let button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => {
      JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.selectedColor, true, null, color => {
        this.selectedColor = color;
        this.colorPreview.setColor(color);
      });
    });
    flatPanel.add(button, BorderLayout.EAST);
    let gradientColorPanel = this.cardColorPanels[1];
    gradientColorPanel.addChangeListener(event => {
      switch(this.selectedFillerSelector) {
        case "FLAT":
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
          (this.selectedFillerPanel).drawPreview(gradientColorPanel.getValueIsAdjusting());
          break;
        case "TEXTURE":
          break;
        case "BIGRADIENT":
      }
    });
    (this.cardColorPanels[3]).setSpaceTimeLabelsVisible(false);
    let buttonGroup = new ButtonGroup();
    this.cardFillerSelectors.forEach((card, index, array) => {
      let radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.setToggle();
      radio.setSelected(index === 0);
      radio.setIcon(new Z4EmptyImageProducer(index));
      radio.addActionListener(event => {
        this.selectedFillerSelector = card;
        this.selectedFillerPanel = this.cardFillerPanels[index];
        cardFiller.show(panelFiller, card);
        switch(card) {
          case "FLAT":
            cardColor.show(panelColor, "FLAT");
            panelFiller.getStyle().display = "none";
            vline.getStyle().display = "none";
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
            vline.getStyle().display = "block";
            panelColor.getStyle().display = "block";
            (this.selectedFillerPanel).drawPreview(false);
            break;
          case "TEXTURE":
            cardColor.show(panelColor, "NONE");
            panelFiller.getStyle().display = "block";
            vline.getStyle().display = "none";
            panelColor.getStyle().display = "none";
            break;
          case "BIGRADIENT":
            cardColor.show(panelColor, "BIGRADIENT");
            panelFiller.getStyle().display = "none";
            vline.getStyle().display = "none";
            panelColor.getStyle().display = "block";
            break;
        }
      });
      buttonGroup.add(radio);
      panelRadio.add(radio, null);
      panelFiller.add(this.cardFillerPanels[index], card);
    });
    this.cardColorSelectors.forEach((card, index, array) => {
      let panel = this.cardColorPanels[index];
      panelColor.add(panel, card);
      switch(card) {
        case "FLAT":
          break;
        case "GRADIENT":
          let gradientColor = (panel).getGradientColor();
          this.cardFillerSelectors.forEach((card2, index2, array2) => {
            switch(card2) {
              case "FLAT":
                break;
              case "LINEAR":
              case "VERTEX":
              case "CONIC":
              case "SPIRAL":
              case "BEZIER":
              case "SINUSOIDAL":
                (this.cardFillerPanels[index2]).setGradientColor(gradientColor);
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

   addVLine(panel) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().height = "100%";
    div.getStyle().background = "var(--main-action-bgcolor)";
    panel.add(div, null);
    return div;
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   getSelectedFilling() {
    switch(this.selectedFillerSelector) {
      case "FLAT":
        return this.selectedColor;
      case "LINEAR":
      case "VERTEX":
      case "CONIC":
      case "SPIRAL":
      case "BEZIER":
      case "SINUSOIDAL":
      case "TEXTURE":
        return (this.selectedFillerPanel).getSelectedFiller();
      case "BIGRADIENT":
        return (this.cardColorPanels[3]).getSelectedBiGradientColor();
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
   setSize(width, height) {
    this.cardFillerSelectors.forEach((card, index, array) => {
      switch(card) {
        case "FLAT":
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
        case "TEXTURE":
          (this.cardFillerPanels[index]).setSize(width, height);
          break;
        case "BIGRADIENT":
          break;
      }
    });
    this.cardColorSelectors.forEach((card, index, array) => {
      switch(card) {
        case "FLAT":
          break;
        case "GRADIENT":
          break;
        case "NONE":
          break;
        case "BIGRADIENT":
          (this.cardColorPanels[index]).setSize(width, height);
          break;
      }
    });
  }
}
