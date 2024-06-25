package pizzapazza.ui.panel.color;

import static def.dom.Globals.console;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSFrame;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.iterator.Z4PointIteratorType;
import simulation.js.$Object;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestColorProgressingPanel extends JSFrame {

  private final Array<Z4ColorProgressionPanel> panels = new Array<>();

  private Z4PointIteratorType type = Z4PointIteratorType.STAMPER;
  private boolean isColor = true;
  private boolean isGradientColor;
  private boolean isBiGradientColor;

  public TestColorProgressingPanel() {
    super();

    JSPanel p = new JSPanel();
    p.setLayout(new GridBagLayout());

    JSPanel panel = new JSPanel();
    ButtonGroup buttonGroup = new ButtonGroup();
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

    JSLabel label = new JSLabel();
    label.setText("HORIZONTALLY COMPACT");
    p.add(label, new GBC(0, 1));

    label = new JSLabel();
    label.setText("VERTICALLY COMPACT");
    p.add(label, new GBC(1, 1));

    Z4ColorProgressionPanel progression = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    p.add(progression, new GBC(0, 2).wx(1).i(5, 5, 5, 5));
    this.panels.push(progression);

    progression = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    p.add(progression, new GBC(1, 2).wx(1).i(5, 5, 5, 5));
    this.panels.push(progression);

    Z4ColorProgressionPanel disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).wx(1).i(5, 5, 5, 5));
    this.panels.push(disabled);

    disabled = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 3).wx(1).i(5, 5, 5, 5));
    this.panels.push(disabled);

    Z4ColorProgressionPanel lighted = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
    lighted.setValue(Z4ColorProgression.fromJSON(new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event -> {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, new GBC(0, 4).wx(1).i(5, 5, 5, 5));
    this.panels.push(lighted);

    this.getContentPane().add(p, BorderLayout.NORTH);
  }

  private void addRadio(JSPanel panel, ButtonGroup buttonGroup, Z4PointIteratorType type) {
    JSRadioButton button = new JSRadioButton();
    button.setText("" + type);
    button.setSelected(type == Z4PointIteratorType.STAMPER);
    button.addActionListener(event -> {
      this.type = type;
      this.updatePanels();
    });

    panel.add(button, null);
    buttonGroup.add(button);
  }

  private void addRadio2(JSPanel panel, ButtonGroup buttonGroup, String text, boolean isColor, boolean isGradientColor, boolean isBiGradientColor) {
    JSRadioButton button = new JSRadioButton();
    button.setText(text);
    button.setSelected(isColor);
    button.addActionListener(event -> {
      this.isColor = isColor;
      this.isGradientColor = isGradientColor;
      this.isBiGradientColor = isBiGradientColor;
      this.updatePanels();
    });

    panel.add(button, null);
    buttonGroup.add(button);
  }

  private void updatePanels() {
    this.panels.forEach(panel -> panel.setProgressionSettings(this.type, new $Object(), this.isColor, this.isGradientColor, this.isBiGradientColor));
  }
}
