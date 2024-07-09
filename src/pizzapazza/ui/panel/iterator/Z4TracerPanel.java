package pizzapazza.ui.panel.iterator;

import javascript.awt.GBC;
import javascript.swing.JSCheckBox;
import pizzapazza.iterator.Z4Tracer;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.util.Z4Translations;

/**
 * The panel to edit a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
public class Z4TracerPanel extends Z4PointIteratorPanel<Z4Tracer> {

  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final Z4FancifulValuePanel push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final Z4FancifulValuePanel step = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final JSCheckBox assistedDrawing = new JSCheckBox();

  private final Z4FancifulValuePanel attack = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final Z4FancifulValuePanel sustain = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final Z4FancifulValuePanel release = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);
  private final JSCheckBox endlessSustain = new JSCheckBox();

  /**
   * Creates the object
   */
  public Z4TracerPanel() {
    super();
    this.cssAddClass("z4tracerpanel");

    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event -> this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).i(0, 0, 0, 1));

    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event -> this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.add(this.push, new GBC(1, 0).i(0, 0, 0, 1));

    this.step.setSignsVisible(false);
    this.step.setConstantRange(1, 50);
    this.step.setLabel(Z4Translations.STEP);
    this.step.cssAddClass("z4abstractvaluepanel-titled");
    this.step.addChangeListener(event -> this.onIteratorChange(this.step.getValueIsAdjusting()));
    this.add(this.step, new GBC(2, 0).i(0, 0, 0, 5));

    this.attack.setSignsVisible(false);
    this.attack.setLabel(Z4Translations.ATTACK);
    this.attack.cssAddClass("z4abstractvaluepanel-titled");
    this.attack.addChangeListener(event -> this.onIteratorChange(this.attack.getValueIsAdjusting()));
    this.add(this.attack, new GBC(3, 0).i(0, 0, 0, 1));

    this.sustain.setSignsVisible(false);
    this.sustain.setLabel(Z4Translations.SUSTAIN);
    this.sustain.cssAddClass("z4abstractvaluepanel-titled");
    this.sustain.addChangeListener(event -> this.onIteratorChange(this.sustain.getValueIsAdjusting()));
    this.sustain.add(this.endlessSustain, new GBC(0, 4).w(3).a(GBC.WEST));
    this.add(this.sustain, new GBC(4, 0).h(2).a(GBC.NORTH).i(0, 0, 0, 1));

    this.endlessSustain.setText(Z4Translations.ENDLESS);
    this.endlessSustain.addActionListener(event -> this.onIteratorChange(false));

    this.release.setSignsVisible(false);
    this.release.setLabel(Z4Translations.RELEASE);
    this.release.cssAddClass("z4abstractvaluepanel-titled");
    this.release.addChangeListener(event -> this.onIteratorChange(this.release.getValueIsAdjusting()));
    this.add(this.release, new GBC(5, 0));

    this.assistedDrawing.setText(Z4Translations.ASSISTED_DRAWING);
    this.assistedDrawing.addActionListener(event -> this.onIteratorChange(false));
    this.add(this.assistedDrawing, new GBC(3, 1).a(GBC.NORTHWEST));

    this.add(this.rotation, new GBC(0, 1).w(3).a(GBC.WEST).i(1,0,0,0));

    this.setValue(new Z4Tracer(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), true,
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            true,
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false)));
  }

  @Override
  protected void onIteratorChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;

    this.sustain.setEnabled(this.enabled && !this.endlessSustain.isSelected());
    this.release.setEnabled(this.enabled && !this.endlessSustain.isSelected());

    this.value = new Z4Tracer(
            this.multiplicity.getValue(), this.push.getValue(),
            this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustain.isSelected(),
            this.step.getValue(), this.assistedDrawing.isSelected(),
            this.rotation.getValue());

    this.onchange();
  }

  @Override
  public void setValue(Z4Tracer value) {
    super.setValue(value);

    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());

    this.attack.setValue(value.getAttack());
    this.sustain.setValue(value.getSustain());
    this.sustain.setEnabled(this.enabled && !value.isEndlessSustain());
    this.release.setValue(value.getRelease());
    this.release.setEnabled(this.enabled && !value.isEndlessSustain());
    this.endlessSustain.setSelected(value.isEndlessSustain());

    this.step.setValue(value.getStep());
    this.assistedDrawing.setSelected(value.isAssistedDrawing());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);

    this.attack.setEnabled(b);
    this.sustain.setEnabled(b && !this.endlessSustain.isSelected());
    this.release.setEnabled(b && !this.endlessSustain.isSelected());
    this.endlessSustain.setEnabled(b);

    this.step.setEnabled(b);
    this.assistedDrawing.setEnabled(b);
  }
}
