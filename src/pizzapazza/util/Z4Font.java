package pizzapazza.util;

/**
 * The font object
 *
 * @author gianpiero.diblasi
 */
public class Z4Font {

  public final String family;
  public final int size;
  public final boolean bold;
  public final boolean italic;

  /**
   * Creates the object
   *
   * @param family The font family
   * @param size The font size (in pixel)
   * @param bold true for a bold font, false otherwise
   * @param italic true for an italic font, false otherwise
   */
  public Z4Font(String family, int size, boolean bold, boolean italic) {
    this.family = family;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
  }
}
