package pizzapazza.ui.panel.color;

import def.js.Object;
import javascript.awt.GBC;
import javascript.swing.ButtonGroup;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import pizzapazza.color.Z4GradientColorProgression;
import pizzapazza.color.Z4GradientColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;

/**
 * The panel to manage a gradient color progressing
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorProgressionPanel extends Z4AbstractGradientColorProgressionPanel<Z4GradientColorProgression, Z4GradientColorProgressionBehavior> {
  @Override
  protected void addRadioPanel(JSPanel panel, ButtonGroup buttonGroup, Z4GradientColorProgressionPanelOrientation orientation) {
    if (orientation == Z4GradientColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      this.add(panel, new GBC(1, 0).w(3));
      this.addRadio(Z4GradientColorProgressionBehavior.SPATIAL, panel, buttonGroup, "left");
      this.addRadio(Z4GradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerh");
      this.addRadio(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4GradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
    } else if (orientation == Z4GradientColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4GradientColorProgressionBehavior.SPATIAL, panel, buttonGroup, "top");
      this.addRadio(Z4GradientColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerv");
      this.addRadio(Z4GradientColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4GradientColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
    }
  }
}
