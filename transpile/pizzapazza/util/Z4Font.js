/**
 * The font object
 *
 * @author gianpiero.diblasi
 */
class Z4Font {

   family = null;

   size = 0;

   bold = false;

   italic = false;

  /**
   * Creates the object
   *
   * @param family The font family
   * @param size The font size (in pixel)
   * @param bold true for a bold font, false otherwise
   * @param italic true for an italic font, false otherwise
   */
  constructor(family, size, bold, italic) {
    this.family = family;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
  }
}
