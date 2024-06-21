package pizzapazza.ui.panel.painter;

import def.js.Array;
import def.js.Object;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTabbedPane;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.math.Z4Whirlpool;
import pizzapazza.math.Z4WhirlpoolBehavior;
import pizzapazza.painter.Z4CenteredFigurePainter;
import pizzapazza.painter.Z4CenteredFigurePainterType;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.ui.panel.math.Z4WhirlpoolPanel;
import pizzapazza.ui.panel.math.Z4WhirlpoolPanelOrientation;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;

/**
 * The panel to edit a Z4CenteredFigurePainter
 *
 * @author gianpiero.diblasi
 */
public class Z4CenteredFigurePainterPanel extends Z4PainterPanel<Z4CenteredFigurePainter> {

  private final Array<JSRadioButton> radios = new Array<>();
  private final Z4FancifulValuePanel size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel angle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel angle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel tension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  private final Z4FancifulValuePanel hole = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4WhirlpoolPanel whirlpool = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.HORIZONTAL);
  private final JSSpinner coverSpinner = new JSSpinner();
  private final JSSlider coverSlider = new JSSlider();

  private final Z4FancifulValuePanel shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final JSButton editShadowColor = new JSButton();
  private final Z4ColorPreview shadowColorPreview = new Z4ColorPreview();

  private final Z4FancifulValuePanel borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final JSButton editBorderColor = new JSButton();
  private final Z4ColorPreview borderColorPreview = new Z4ColorPreview();

  /**
   * Creates the object
   */
  public Z4CenteredFigurePainterPanel() {
    super();
    this.cssAddClass("z4centeredfigurepainterpanel");

    JSTabbedPane tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.SHAPE, panel);

    JSPanel panelType = new JSPanel();
    panel.add(panelType, new GBC(0, 0).w(3).f(GBC.HORIZONTAL));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(Z4CenteredFigurePainterType.TYPE_0, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_1, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_2, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_3, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_4, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_5, panelType, buttonGroup);

    this.size.setSignsVisible(false);
    this.size.setConstantRange(1, 50);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.addChangeListener(event -> this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.size, new GBC(0, 1).i(1, 0, 0, 1));

    this.angle1.setSignsVisible(false);
    this.angle1.setConstantRange(0, 90);
    this.angle1.setRandomRange(0, 90);
    this.angle1.setLabel(Z4Translations.ANGLE + " 1");
    this.angle1.cssAddClass("z4abstractvaluepanel-titled");
    this.angle1.addChangeListener(event -> this.onfigurechange(this.angle1.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle1, new GBC(0, 2).i(1, 0, 0, 1));

    this.angle2.setSignsVisible(false);
    this.angle2.setConstantRange(0, 90);
    this.angle2.setRandomRange(0, 90);
    this.angle2.setLabel(Z4Translations.ANGLE + " 2");
    this.angle2.cssAddClass("z4abstractvaluepanel-titled");
    this.angle2.addChangeListener(event -> this.onfigurechange(this.angle2.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle2, new GBC(1, 2).w(2).i(1, 0, 0, 0));

    this.tension.setSignsVisible(false);
    this.tension.setConstantRange(1, 100);
    this.tension.setLabel(Z4Translations.TENSION);
    this.tension.cssAddClass("z4abstractvaluepanel-titled");
    this.tension.addChangeListener(event -> this.onfigurechange(this.tension.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.tension, new GBC(1, 1).w(2).i(1, 0, 0, 0));

    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(3, 10);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event -> this.onfigurechange(this.multiplicity.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.multiplicity, new GBC(0, 3).i(1, 0, 0, 1));

    this.hole.setSignsVisible(false);
    this.hole.setLabel(Z4Translations.HOLE);
    this.hole.cssAddClass("z4abstractvaluepanel-titled");
    this.hole.addChangeListener(event -> this.onfigurechange(this.hole.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.hole, new GBC(1, 3).w(2).i(1, 0, 0, 0));

    this.whirlpool.cssAddClass("z4abstractvaluepanel-titled");
    this.whirlpool.addChangeListener(event -> this.onfigurechange(this.whirlpool.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.whirlpool, new GBC(0, 4).h(2).i(1, 0, 0, 1));

    Z4UI.addLabel(panel, Z4Translations.COVER, new GBC(1, 4).a(GBC.SOUTHWEST).wy(1));

    this.coverSpinner.cssAddClass("jsspinner_w_4rem");
    this.coverSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.coverSpinner.addChangeListener(event -> this.onfigurechange(this.coverSpinner.getValueIsAdjusting(), null, null, (int) this.coverSpinner.getValue()));
    panel.add(this.coverSpinner, new GBC(2, 4).a(GBC.SOUTHEAST).wy(1));

    this.coverSlider.addChangeListener(event -> this.onfigurechange(this.coverSlider.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.coverSlider, new GBC(1, 5).w(2).f(GBC.HORIZONTAL));

    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event -> this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));

    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event -> this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));

    this.editShadowColor.setText(Z4Translations.EDIT);
    this.editShadowColor.addActionListener(event -> JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getShadowColor(), true, null, color -> this.onfigurechange(false, color, null, this.coverSlider.getValue())));

    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPreview, this.editShadowColor);

    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event -> this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));

    this.editBorderColor.setText(Z4Translations.EDIT);
    this.editBorderColor.addActionListener(event -> JSColorChooser.showDialog(Z4Translations.FILLING_COLOR, this.value.getBorderColor(), true, null, color -> this.onfigurechange(false, null, color, this.coverSlider.getValue())));

    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPreview, this.editBorderColor);

    this.setValue(new Z4CenteredFigurePainter(
            Z4CenteredFigurePainterType.TYPE_0,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4Whirlpool(
                    Z4WhirlpoolBehavior.NONE,
                    new Z4FancifulValue(
                            new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                            new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                            false)),
            100,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Color(0, 0, 0, 255),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Color(0, 0, 0, 255)
    ));
  }

  private void addRadio(Z4CenteredFigurePainterType centeredFigurePainterType, JSPanel panel, ButtonGroup buttonGroup) {
    JSRadioButton radio = new JSRadioButton();
    radio.cssAddClass("z4centeredfigurepainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(centeredFigurePainterType));
    radio.addActionListener(event -> this.onfigurechange(false, null, null, this.coverSlider.getValue()));

    buttonGroup.add(radio);
    this.radios.$set("" + centeredFigurePainterType, radio);
    panel.add(radio, null);
  }

  private void createPanel(JSTabbedPane tabbedPane, String text, Z4FancifulValuePanel p1, Z4FancifulValuePanel p2, Z4ColorPreview preview, JSButton button) {
    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);

    panel.add(p1, new GBC(0, 1).w(2).i(1, 0, 1, 0));
    if ($exists(p2)) {
      panel.add(p2, new GBC(0, 2).w(2));
    }

    Z4UI.addLabel(panel, Z4Translations.FILLING_COLOR, new GBC(0, 3).w(2).a(GBC.WEST));

    panel.add(preview, new GBC(0, 4).wx(1).f(GBC.HORIZONTAL).i(0, 0, 0, 5));
    panel.add(button, new GBC(1, 4));
  }

  private void onfigurechange(boolean b, Color shadowColor, Color borderColor, int cover) {
    this.valueIsAdjusting = b;

    this.coverSpinner.setValue(cover);
    this.coverSlider.setValue(cover);

    if ($exists(shadowColor)) {
      this.shadowColorPreview.setColor(shadowColor);
    }

    if ($exists(borderColor)) {
      this.borderColorPreview.setColor(borderColor);
    }

    Z4CenteredFigurePainterType type = null;
    switch ("" + Object.keys(this.radios).find((key, index, array) -> ((JSRadioButton) this.radios.$get(key)).isSelected())) {
      case "TYPE_0":
        type = Z4CenteredFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4CenteredFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4CenteredFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4CenteredFigurePainterType.TYPE_3;
        break;
      case "TYPE_4":
        type = Z4CenteredFigurePainterType.TYPE_4;
        break;
      case "TYPE_5":
        type = Z4CenteredFigurePainterType.TYPE_5;
        break;
    }

    this.value = new Z4CenteredFigurePainter(
            type,
            this.size.getValue(), this.angle1.getValue(), this.angle2.getValue(),
            this.tension.getValue(), this.multiplicity.getValue(), this.hole.getValue(), this.whirlpool.getValue(), this.coverSlider.getValue(),
            this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), $exists(shadowColor) ? shadowColor : this.value.getShadowColor(),
            this.borderSize.getValue(), $exists(borderColor) ? borderColor : this.value.getBorderColor()
    );

    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() != Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));

    this.onchange();
  }

  @Override
  public void setValue(Z4CenteredFigurePainter value) {
    this.value = value;

    ((JSRadioButton) this.radios.$get("" + value.getCenteredFigurePainterType())).setSelected(true);
    this.size.setValue(this.value.getSize());
    this.angle1.setValue(this.value.getAngle1());
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() != Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setValue(this.value.getAngle2());
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setValue(this.value.getTension());
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.hole.setValue(this.value.getHole());
    this.whirlpool.setValue(this.value.getWhirlpool());
    this.coverSpinner.setValue(this.value.getCover());
    this.coverSlider.setValue(this.value.getCover());

    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPreview.setColor(this.value.getShadowColor());

    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPreview.setColor(this.value.getBorderColor());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setEnabled(b));

    this.size.setEnabled(b);
    this.angle1.setEnabled(b && this.value.getCenteredFigurePainterType() != Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(b && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(b && (this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() == Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setEnabled(b);
    this.hole.setEnabled(b);
    this.whirlpool.setEnabled(b);
    this.coverSpinner.setEnabled(b);
    this.coverSlider.setEnabled(b);

    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.editShadowColor.setEnabled(b);

    this.borderSize.setEnabled(b);
    this.editBorderColor.setEnabled(b);
  }
}
