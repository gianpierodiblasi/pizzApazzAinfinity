/**
 * @author gianpiero.diblasi
 */
class TestGradientColorProgressingPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4GradientColorProgressionPanel(), null);
    // p.add(new Z4LightingPanel(Z4LightingPanelOrientation.VERTICAL), null);
    // 
    // Z4LightingPanel disabled = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    // disabled.setEnabled(false);
    // p.add(disabled, null);
    // 
    // Z4LightingPanel lighted = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    // lighted.setValue(Z4Lighting.LIGHTED);
    // lighted.addChangeListener(event -> console.log(lighted.getValue()));
    // p.add(lighted, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
