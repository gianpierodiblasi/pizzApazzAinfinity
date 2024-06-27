package pizzapazza.ui.panel.painter;

import javascript.awt.GBC;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.painter.Z4BrushPainter;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.util.Z4Translations;

/**
 * The panel to edit a Z4BrushPainter
 *
 * @author gianpiero.diblasi
 */
public class Z4BrushPainterPanel extends Z4PainterPanel<Z4BrushPainter> {

  private final Z4FancifulValuePanel width = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel thickness = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  public Z4BrushPainterPanel() {
    super();
    this.cssAddClass("z4brushpainterpanel");

    this.width.setSignsVisible(false);
    this.width.setConstantRange(1, 150);
    this.width.setLabel(Z4Translations.WIDTH);
    this.width.cssAddClass("z4abstractvaluepanel-titled");
    this.width.addChangeListener(event -> this.onbrushchange(this.width.getValueIsAdjusting()));
    this.add(this.width, new GBC(0, 0).i(1, 0, 1, 0));

    this.thickness.setSignsVisible(false);
    this.thickness.setConstantRange(1, 15);
    this.thickness.setLabel(Z4Translations.THICKNESS);
    this.thickness.cssAddClass("z4abstractvaluepanel-titled");
    this.thickness.addChangeListener(event -> this.onbrushchange(this.thickness.getValueIsAdjusting()));
    this.add(this.thickness, new GBC(0, 1));

    this.setValue(new Z4BrushPainter(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 2),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false)
    ));
  }

  private void onbrushchange(boolean b) {
    this.valueIsAdjusting = b;

    this.value = new Z4BrushPainter(this.width.getValue(), this.thickness.getValue());
    this.onchange();
  }

  @Override
  public void setValue(Z4BrushPainter value) {
    this.value = value;

    this.width.setValue(this.value.getWidth());
    this.thickness.setValue(this.value.getThickness());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);

    this.width.setEnabled(b);
    this.thickness.setEnabled(b);
  }
}
