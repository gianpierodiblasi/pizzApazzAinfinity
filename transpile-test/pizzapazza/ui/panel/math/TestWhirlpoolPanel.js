/**
 * @author gianpiero.diblasi
 */
class TestWhirlpoolPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.VERTICAL), new GBC(0, 0).w(2).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.VERTICAL);
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(2, 0).w(2).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(4, 0).w(2).wx(1).i(5, 5, 5, 5));
    p.add(new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL), new GBC(0, 1).w(3).wx(1).i(5, 5, 5, 5));
    labelled = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);
    p.add(labelled, new GBC(3, 1).w(3).wx(1).i(5, 5, 5, 5));
    disabled = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 2).w(3).wx(1).i(5, 5, 5, 5));
    let valued = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setValue(Z4Whirlpool.fromJSON(new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)).toJSON()));
    p.add(valued, new GBC(3, 2).w(3).wx(1).i(5, 5, 5, 5));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
