package pizzapazza.util;

import javascript.awt.Color;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.math.Z4Rotation;

/**
 * Utility object to store text info
 *
 * @author gianpiero.diblasi
 */
public class Z4TextInfo {

  public Z4Font font;
  public Z4Rotation rotation;

  public String textText;
  public boolean textEmpty;
  public Z4BiGradientColor textColor;
  public int textBorder;
  public Color textBorderColor;
  public int textShearX;
  public int textShearY;

  public boolean shadow;
  public String shadowText;
  public boolean shadowEmpty;
  public Color shadowColor;
  public boolean shadowReflex;
  public int shadowOffsetX;
  public int shadowOffsetY;
  public int shadowShearX;
  public int shadowShearY;
}
