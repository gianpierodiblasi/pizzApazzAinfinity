/**
 * The ribbon panel containing the help
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonHelpPanel extends JSPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    this.cssAddClass("z4ribbonhelppanel");
    let button = new JSButton();
    button.setText(Z4Translations.ABOUT);
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.showAbout());
    this.add(button, null);
  }

   showAbout() {
    let regExp = new RegExp("pizzApazzA-bundle-.*js");
    document.querySelectorAll("script").forEach(script => {
      let src = script.getAttribute("src");
      if (regExp.test(src)) {
        let start = src.indexOf("pizzApazzA-bundle-");
        let end = src.indexOf(".js");
        let version = src.substring(start + 18, end);
        let panel = new JSPanel();
        panel.cssAddClass("z4ribbonhelppanel-about");
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        let component = new JSComponent(document.createElement("img"));
        component.cssAddClass("z4ribbonhelppanel-splash");
        panel.add(component, null);
        let label = new JSLabel();
        label.setProperty("innerHTML", Z4Translations.BASED_ON.replace("$version$", version));
        label.getStyle().marginTop = "5px";
        label.getStyle().maxWidth = "500px";
        panel.add(label, null);
        JSOptionPane.showMessageDialog(panel, Z4Translations.ABOUT, JSOptionPane.INFORMATION_MESSAGE, null);
      }
    });
  }
}
