/**
 * @author gianpiero.diblasi
 */
class TestGradientColorProgressingPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4GradientColorProgressionPanel(), null);
    let disabled = new Z4GradientColorProgressionPanel();
    disabled.setEnabled(false);
    p.add(disabled, null);
    let lighted = new Z4GradientColorProgressionPanel();
    lighted.setValue(Z4GradientColorProgression.fromJSON(new Z4GradientColorProgression(Z4GradientColorProgressionBehavior.TEMPORAL, 0.34, Z4Lighting.LIGHTED).toJSON()));
    lighted.addChangeListener(event => {
      if (!lighted.getValueIsAdjusting()) {
        console.log(lighted.getValue());
      }
    });
    p.add(lighted, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
