/**
 * @author gianpiero.diblasi
 */
class TestSignPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.VERTICAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.SQUARED), null);
    let disabled = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, null);
    let positive = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    positive.setValue(Z4Sign.fromJSON(new Z4Sign(Z4SignBehavior.POSITIVE).toJSON()));
    positive.addChangeListener(event => console.log(positive.getValue().toJSON()));
    p.add(positive, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
