package pizzapazza.ui.panel.ribbon;

import def.js.RegExp;
import javascript.awt.BoxLayout;
import javascript.awt.FlowLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.document;

/**
 * The ribbon panel containing the help
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonHelpPanel extends JSPanel {

  /**
   * Creates the object
   */
  public Z4RibbonHelpPanel() {
    super();
    this.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    this.cssAddClass("z4ribbonhelppanel");

    JSButton button = new JSButton();
    button.setText(Z4Translations.ABOUT);
    button.setContentAreaFilled(false);
    button.addActionListener(event -> this.showAbout());
    this.add(button, null);
  }

  private void showAbout() {
    RegExp regExp = new RegExp("pizzApazzA-bundle-.*js");
    document.querySelectorAll("script").forEach(script -> {
      String src = script.getAttribute("src");
      if (regExp.test(src)) {
        int offset = 22;
        int start = src.indexOf("pizzApazzA-bundle-min-");
        if (start == -1) {
          offset = 18;
          start = src.indexOf("pizzApazzA-bundle-");
        }

        int end = src.indexOf(".js");
        String version = src.substring(start + offset, end);

        JSPanel panel = new JSPanel();
        panel.cssAddClass("z4ribbonhelppanel-about");
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));

        JSComponent component = new JSComponent(document.createElement("img"));
        component.cssAddClass("z4ribbonhelppanel-splash");
        panel.add(component, null);

        JSLabel label = new JSLabel();
        label.setProperty("innerHTML", Z4Translations.BASED_ON.replace("$version$", version));
        label.getStyle().marginTop = "5px";
        label.getStyle().maxWidth = "500px";
        panel.add(label, null);

        JSOptionPane.showMessageDialog(panel, Z4Translations.ABOUT, JSOptionPane.INFORMATION_MESSAGE, null);
      }
    });
  }
}
