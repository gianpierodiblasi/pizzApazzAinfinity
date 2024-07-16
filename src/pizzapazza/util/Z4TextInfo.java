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

  public Z4Font font; // NON USATO
  public Z4Rotation rotation; // NON USATO
  public Z4GeometricShape shape; // NON USATO
  
  public String textText; // NON USATO
  public boolean textEmpty; // NON USATO
  public Z4GradientColor textColor; // NON USATO
  public int textBorder; // NON USATO
  public Color textBorderColor; // NON USATO
  public int textShearX; // NON USATO
  public int textShearY; // NON USATO

  public boolean shadow; // NON USATO
  public String shadowText; // NON USATO
  public boolean shadowEmpty; // NON USATO
  public Color shadowColor; // NON USATO
  public boolean shadowReflex; // NON USATO
  public int shadowOffsetX; // NON USATO
  public int shadowOffsetY; // NON USATO
  public int shadowShearX; // NON USATO
  public int shadowShearY; // NON USATO
}
