/**
 * @author gianpiero.diblasi
 */
class TestColorProgressingPanel extends JSFrame {

   panels = new Array();

   type = Z4PointIteratorType.STAMPER;

   isColor = true;

   isGradientColor = false;

   isBiGradientColor = false;

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    let panel = new JSPanel();
    let buttonGroup = new ButtonGroup();
    this.addRadio(panel, buttonGroup, Z4PointIteratorType.STAMPER);
    this.addRadio(panel, buttonGroup, Z4PointIteratorType.TRACER);
    this.addRadio(panel, buttonGroup, Z4PointIteratorType.AIRBRUSH);
    this.addRadio(panel, buttonGroup, Z4PointIteratorType.SPIROGRAPH);
    this.addRadio(panel, buttonGroup, Z4PointIteratorType.SCATTERER);
    buttonGroup = new ButtonGroup();
    this.addRadio2(panel, buttonGroup, "COLOR", true, false, false);
    this.addRadio2(panel, buttonGroup, "GRADIENT", false, true, false);
    this.addRadio2(panel, buttonGroup, "BIGRADIENT", false, false, true);
    p.add(panel, new GBC(0, 0).w(2));
    let label = new JSLabel();
    label.setText("HORIZONTALLY COMPACT");
    p.add(label, new GBC(0, 1));
    label = new JSLabel();
    label.setText("VERTICALLY COMPACT");
    p.add(label, new GBC(1, 1));
    let progression = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    p.add(progression, new GBC(0, 2).wx(1).i(5, 5, 5, 5));
    this.panels.push(progression);
    progression = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    p.add(progression, new GBC(1, 2).wx(1).i(5, 5, 5, 5));
    this.panels.push(progression);
    let disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).wx(1).i(5, 5, 5, 5));
    this.panels.push(disabled);
    disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 3).wx(1).i(5, 5, 5, 5));
    this.panels.push(disabled);
    let lighted = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    lighted.setValue(Z4ColorProgression.fromJSON(new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED_IN_OUT).toJSON()));
    lighted.addChangeListener(event => {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, new GBC(0, 4).wx(1).i(5, 5, 5, 5));
    this.panels.push(lighted);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }

   addRadio(panel, buttonGroup, type) {
    let button = new JSRadioButton();
    button.setText("" + type);
    button.setSelected(type === Z4PointIteratorType.STAMPER);
    button.addActionListener(event => {
      this.type = type;
      this.updatePanels();
    });
    panel.add(button, null);
    buttonGroup.add(button);
  }

   addRadio2(panel, buttonGroup, text, isColor, isGradientColor, isBiGradientColor) {
    let button = new JSRadioButton();
    button.setText(text);
    button.setSelected(isColor);
    button.addActionListener(event => {
      this.isColor = isColor;
      this.isGradientColor = isGradientColor;
      this.isBiGradientColor = isBiGradientColor;
      this.updatePanels();
    });
    panel.add(button, null);
    buttonGroup.add(button);
  }

   updatePanels() {
    this.panels.forEach(panel => panel.setProgressionSettings(this.type, new Object(), this.isColor, this.isGradientColor, this.isBiGradientColor));
  }
}
