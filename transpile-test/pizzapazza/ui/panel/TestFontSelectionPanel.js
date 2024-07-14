/**
 * @author gianpiero.diblasi
 */
class TestFontSelectionPanel extends JSFrame {

  constructor() {
    super();
    Z4Font.getAvailableFontFamilies(false, available => {
      let fonts = new Array();
      available.forEach((font, key, array) => fonts.push(font));
      fonts.sort();
      let fontSelectionPanel = new Z4FontSelectionPanel(fonts);
      fontSelectionPanel.addChangeListener(event => console.log(fontSelectionPanel.getValue()));
      let p = new JSPanel();
      p.add(fontSelectionPanel, null);
      this.getContentPane().add(p, BorderLayout.NORTH);
    });
  }
}
