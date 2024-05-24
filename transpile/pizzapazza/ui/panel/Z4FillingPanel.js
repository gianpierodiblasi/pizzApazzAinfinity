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
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");
    let panelRadio = new JSPanel();
    this.addComponent(panelRadio, 0, 0, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    let panelFiller = new JSPanel();
    let cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    this.addComponent(panelFiller, 0, 1, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    let hline = this.addHLine(0, 2, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL);
    hline.getStyle().visibility = "hidden";
    let panelColor = new JSPanel();
    let cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.addComponent(panelColor, 0, 3, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
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
            (this.selectedFillerPanel).drawPreview(false);
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

   addComponent(component, gridx, gridy, gridwidth, gridheight, weightx, weighty, anchor, fill, insets) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if (insets) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

   addHLine(gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";
    this.addComponent(div, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, new Insets(2, 1, 2, 1));
    return div;
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
  }
}
