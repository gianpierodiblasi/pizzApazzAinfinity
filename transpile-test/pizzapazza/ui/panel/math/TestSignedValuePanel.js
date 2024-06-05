/**
 * @author gianpiero.diblasi
 */
class TestSignedValuePanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL), null);
    let labelled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, null);
    let disabled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, null);
    let valued = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setRange(20, 80);
    valued.setValue(Z4SignedValue.fromJSON(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 30).toJSON()));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    p.add(valued, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
