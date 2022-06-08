package giada.pizzapazza.ui;

import def.dom.Element;
import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.iterator.ui.Z4SpirographUI;
import giada.pizzapazza.iterator.ui.Z4StamperUI;
import giada.pizzapazza.iterator.ui.Z4TracerUI;
import giada.pizzapazza.painter.ui.Z4Shape2DPainterUI;
import giada.pizzapazza.setting.Z4HTMLFactory;

/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
public class Z4ToolComposerUI extends Z4AbstractComponentUI {

  private final Z4StamperUI stamperUI = new Z4StamperUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));
  private final Z4TracerUI tracerUI = new Z4TracerUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));
  private final Z4SpirographUI spirographUI = new Z4SpirographUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

  private final Z4Shape2DPainterUI shape2DPainterUI = new Z4Shape2DPainterUI().appendToElement(this.querySelector(".tool-composer-container-painter"));

  private final static String PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");
  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  public Z4ToolComposerUI() {
    super(Z4ToolComposerUI.UI);

    this.configTabs();
    this.configPointIterators();
    this.configPointPainters();
  }

  private void configTabs() {
    NodeList imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    NodeList anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (int i = 0; i < anchors.length; i++) {
      HTMLElement anchor = (HTMLElement) anchors.item(i);
      anchor.onclick = (event) -> {
        for (int j = 0; j < anchors.length; j++) {
          ((Element) anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");

        this.querySelector(".tool-composer-container-point-iterator").style.display = "none";
        this.querySelector(".tool-composer-container-painter").style.display = "none";
        this.querySelector(".tool-composer-container-try-me").style.display = "none";
        switch (anchor.getAttribute("data-value")) {
          case "stamper":
          case "tracer":
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator").style.display = "flex";
            break;
          case "shape2d":
            this.querySelector(".tool-composer-container-painter").style.display = "flex";
            break;
          case "tryme":
            this.querySelector(".tool-composer-container-try-me").style.display = "flex";
            break;
        }
        return null;
      };
    }

    this.querySelector(".tool-composer-container-painter").style.display = "none";
    this.querySelector(".tool-composer-container-try-me").style.display = "none";
  }

  private void configPointIterators() {
    NodeList imgs = this.querySelectorAll(".tool-composer-btn-group-point-iterator img[data-type='tool-composer-tab-point-iterator']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    String name = this.getUniqueName();
    NodeList inputs = this.querySelectorAll(".tool-composer-btn-group-point-iterator input[data-type='tool-composer-tab-point-iterator']");
    for (int i = 0; i < inputs.length; i++) {
      HTMLElement input = (HTMLElement) inputs.item(i);
      String id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);

      input.onclick = (event) -> {
        String dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";

        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");

        switch (dataValue) {
          case "stamper":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "block";
            break;
          case "tracer":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "block";
            break;
          case "spirograph":
            this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "block";
            break;
        }
        return null;
      };
    }
  }

  private void configPointPainters() {
    NodeList imgs = this.querySelectorAll(".tool-composer-btn-group-painter img[data-type='tool-composer-tab-painter']");
    for (int i = 0; i < imgs.length; i++) {
      HTMLElement img = (HTMLElement) imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }

    String name = this.getUniqueName();
    NodeList inputs = this.querySelectorAll(".tool-composer-btn-group-painter input[data-type='tool-composer-tab-painter']");
    for (int i = 0; i < inputs.length; i++) {
      HTMLElement input = (HTMLElement) inputs.item(i);
      String id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);

      input.onclick = (event) -> {
        String dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "none";

        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");

        switch (dataValue) {
          case "shape2d":
            this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "block";
            break;
        }
        return null;
      };
    }
  }

  @Override
  public void dispose() {
    this.stamperUI.dispose();
    this.tracerUI.dispose();
    this.spirographUI.dispose();

    this.shape2DPainterUI.dispose();
  }
}
