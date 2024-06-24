/**
 * The panel to manage a filling
 *
 * @author gianpiero.diblasi
 */
class Z4FillingPanel extends JSPanel {

   cardFillerSelectors = new Array("FLAT", "LINEAR", "VERTEX", "CONIC", "SPIRAL", "BEZIER", "SINUSOIDAL", "TEXTURE", "BIGRADIENT");

   cardFillerPanels = new Array(new JSPanel(), null, null, null, null, null, null, null, new JSPanel());

   cardFillerEvalPanels = new Array("", "new Z4LinearFillerPanel()", "new Z4VertexBasedFillerPanel()", "new Z4ConicFillerPanel()", "new Z4SpiralFillerPanel()", "new Z4BezierFillerPanel()", "new Z4SinusoidalFillerPanel()", "new Z4TextureFillerPanel()", "");

   cardColorSelectors = new Array("FLAT", "GRADIENT", "NONE", "BIGRADIENT");

   cardColorPanels = new Array(new JSPanel(), new Z4GradientColorPanel(), new JSPanel(), new Z4BiGradientColorPanel());

   colorPreview = new Z4ColorPanel();

   width = Z4Constants.DEFAULT_IMAGE_SIZE;

   height = Z4Constants.DEFAULT_IMAGE_SIZE;

   selectedFillerSelector = "FLAT";

   selectedFillerPanel = this.cardFillerPanels[0];

   selectedColor = new Color(255, 255, 255, 255);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    this.add(panelRadio, new GBC(0, 0).wy(1));
    Z4UI.addVLine(this, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    let panelColor = new JSPanel();
    let cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.add(panelColor, new GBC(2, 0).wxy(1, 1).a(GBC.NORTH).i(5, 0, 0, 0));
    Z4UI.addVLine(this, new GBC(3, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    let panelFiller = new JSPanel();
    let cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    panelFiller.getStyle().display = "none";
    this.add(panelFiller, new GBC(4, 0).wxy(1, 1).a(GBC.NORTH));
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
      radio.getStyle().marginBottom = "1px";
      radio.setToggle();
      radio.setSelected(index === 0);
      radio.setIcon(new Z4EmptyImageProducer(index));
      radio.addActionListener(event => {
        this.selectedFillerSelector = card;
        if (this.cardFillerPanels[index]) {
          this.selectedFillerPanel = this.cardFillerPanels[index];
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        } else if (card === "BEZIER") {
          Z4UI.pleaseWait(this, false, false, false, false, "", () => {
            this.selectedFillerPanel = eval(this.cardFillerEvalPanels[index]);
            this.afterEval(panelFiller, card, index, gradientColorPanel);
            this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
          });
        } else {
          this.selectedFillerPanel = eval(this.cardFillerEvalPanels[index]);
          this.afterEval(panelFiller, card, index, gradientColorPanel);
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        }
      });
      buttonGroup.add(radio);
      panelRadio.add(radio, null);
      switch(card) {
        case "FLAT":
          panelFiller.add(this.cardFillerPanels[index], card);
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
          panelFiller.add(this.cardFillerPanels[index], card);
          break;
      }
    });
    this.cardColorSelectors.forEach((card, index, array) => panelColor.add(this.cardColorPanels[index], card));
  }

   afterEval(panelFiller, card, index, gradientColorPanel) {
    (this.selectedFillerPanel).setSize(this.width, this.height);
    (this.selectedFillerPanel).setGradientColor(gradientColorPanel.getGradientColor());
    this.cardFillerPanels[index] = this.selectedFillerPanel;
    panelFiller.add(this.selectedFillerPanel, card);
  }

   afterSelection(panelFiller, cardFiller, card, panelColor, cardColor) {
    cardFiller.show(panelFiller, card);
    switch(card) {
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
        (this.selectedFillerPanel).drawPreview(false);
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
    if (width > 0 && height > 0) {
      this.width = width;
      this.height = height;
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
            if (this.cardFillerPanels[index]) {
              (this.cardFillerPanels[index]).setSize(width, height);
            }
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
}
