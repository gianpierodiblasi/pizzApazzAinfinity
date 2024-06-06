/**
 * @author gianpiero.diblasi
 */
class TestLightingPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL), null);
    p.add(new Z4LightingPanel(Z4LightingPanelOrientation.VERTICAL), null);
    let disabled = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, null);
    let lighted = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);
    lighted.setValue(Z4Lighting.LIGHTED);
    lighted.addChangeListener(event => console.log(lighted.getValue()));
    p.add(lighted, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
