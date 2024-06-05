/**
 * @author gianpiero.diblasi
 */
class TestRotationPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL), new GBC(0, 0).wx(1).i(5, 5, 5, 5));
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL), new GBC(1, 0).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    labelled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(1, 1).wx(1).i(5, 5, 5, 5));
    // Z4RotationPanel disabled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    // disabled.setEnabled(false);
    // p.add(disabled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));
    // 
    // disabled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    // disabled.setEnabled(false);
    // p.add(disabled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));
    // 
    // Z4RotationPanel valued = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    // valued.setLabel("Valore");
    // valued.setConstantRange(20, 80);
    // valued.setRandomRange(30, 70);
    // valued.setRandomLengthRange(50, 100);
    // valued.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)),
    // false).toJSON()));
    // p.add(valued, new GBC(0, 3).wx(1).i(5, 5, 5, 5));
    // 
    // valued.addChangeListener(event -> {
    // if (!valued.getValueIsAdjusting()) {
    // console.log(valued.getValue().toJSON());
    // }
    // });
    // 
    // Z4RotationPanel valued2 = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    // valued2.setLabel("Valore");
    // valued2.setSignsVisible(false);
    // valued2.setConstantRange(20, 80);
    // valued2.setRandomRange(30, 70);
    // valued2.setRandomLengthRange(50, 100);
    // valued2.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(
    // new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10),
    // new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)),
    // false).toJSON()));
    // p.add(valued2, new GBC(1, 3).wx(1).i(5, 5, 5, 5));
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
