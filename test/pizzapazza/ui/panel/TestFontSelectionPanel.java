package pizzapazza.ui.panel;

import static def.dom.Globals.console;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Font;

/**
 *
 * @author gianpiero.diblasi
 */
public class TestFontSelectionPanel extends JSFrame {

  public TestFontSelectionPanel() {
    super();

    Z4Font.getAvailableFontFamilies(false, available -> {
      Array<String> fonts = new Array<>();
      available.forEach((font, key, array) -> fonts.push(font));
      fonts.sort();

      Z4FontSelectionPanel fontSelectionPanel = new Z4FontSelectionPanel(fonts);
      fontSelectionPanel.addChangeListener(event -> console.log(fontSelectionPanel.getValue()));

      JSPanel p = new JSPanel();
      p.add(fontSelectionPanel, null);
      this.getContentPane().add(p, BorderLayout.NORTH);
    });
  }
}
