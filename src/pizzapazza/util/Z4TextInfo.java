package pizzapazza.util;

import javascript.awt.Color;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.geometricshape.Z4GeometricShape;

/**
 * Utility object to store text info
 *
 * @author gianpiero.diblasi
 */
public class Z4TextInfo {

  public Z4Font font;
  public Z4Rotation rotation;
  public Z4GeometricShape shape;
  
  public String textText;
  public boolean textEmpty;
  public Z4GradientColor textColor;
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
