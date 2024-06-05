/**
 * @author gianpiero.diblasi
 */
class TestFancifulValuePanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL), new GBC(0, 0).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(1, 0).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(2, 0).wx(1).i(5, 5, 5, 5));
    p.add(new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL), new GBC(0, 1).w(3).i(5, 5, 5, 5));
    labelled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 2).w(3).i(5, 5, 5, 5));
    disabled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).w(3).i(5, 5, 5, 5));
    let valued = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    valued.setLabel("Valore");
    valued.setConstantRange(20, 80);
    valued.setRandomRange(30, 70);
    valued.setRandomLengthRange(50, 100);
    valued.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)), false).toJSON()));
    p.add(valued, new GBC(0, 4).w(3).i(5, 5, 5, 5));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    let valued2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    valued2.setLabel("Valore");
    valued2.setSignsVisible(false);
    valued2.setConstantRange(20, 80);
    valued2.setRandomRange(30, 70);
    valued2.setRandomLengthRange(50, 100);
    valued2.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)), false).toJSON()));
    p.add(valued2, new GBC(0, 5).w(3).i(5, 5, 5, 5));
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
