/**
 * The composer of a tool
 *
 * @author gianpiero.di.blasi
 */
class Z4ToolComposerUI extends Z4AbstractComponentUI {

   stamperUI = new Z4StamperUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   tracerUI = new Z4TracerUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   spirographUI = new Z4SpirographUI().appendToElement(this.querySelector(".tool-composer-container-point-iterator"));

   shape2DPainterUI = new Z4Shape2DPainterUI().appendToElement(this.querySelector(".tool-composer-container-painter"));

  static  PATH = Z4Loader.UP + (Z4Loader.allFiles ? "src/image/" : "build/image/");

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ToolComposerUI.html");

  /**
   * Creates a Z4ToolComposerUI
   */
  constructor() {
    super(Z4ToolComposerUI.UI);
    this.configTabs();
    this.configPointIterators();
    this.configPointPainters();
  }

   configTabs() {
    let imgs = this.querySelectorAll(".tool-composer-nav img[data-type='tool-composer-tab']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let anchors = this.querySelectorAll(".tool-composer-nav a[data-type='tool-composer-tab']");
    for (let i = 0; i < anchors.length; i++) {
      let anchor = anchors.item(i);
      anchor.onclick = (event) => {
        for (let j = 0; j < anchors.length; j++) {
          (anchors.item(j)).classList.remove("active");
        }
        anchor.classList.add("active");
        this.querySelector(".tool-composer-container-point-iterator").style.display = "none";
        this.querySelector(".tool-composer-container-painter").style.display = "none";
        this.querySelector(".tool-composer-container-try-me").style.display = "none";
        switch(anchor.getAttribute("data-value")) {
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

   configPointIterators() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-point-iterator img[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-point-iterator input[data-type='tool-composer-tab-point-iterator']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(3)").style.display = "none";
        this.querySelector(".tool-composer-container-point-iterator > div:nth-child(4)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
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

   configPointPainters() {
    let imgs = this.querySelectorAll(".tool-composer-btn-group-painter img[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs.item(i);
      img.setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + img.getAttribute("data-icon") + ".svg");
    }
    let name = this.getUniqueName();
    let inputs = this.querySelectorAll(".tool-composer-btn-group-painter input[data-type='tool-composer-tab-painter']");
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      let id = this.getUniqueID();
      input.setAttribute("id", id);
      input.setAttribute("name", name);
      input.nextElementSibling.setAttribute("for", id);
      input.onclick = (event) => {
        let dataValue = input.getAttribute("data-value");
        this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "none";
        this.querySelector(".tool-composer-nav .nav-link.active").setAttribute("data-value", dataValue);
        this.querySelector(".tool-composer-nav .nav-link.active img").setAttribute("src", Z4ToolComposerUI.PATH + "z4toolcomposer_" + dataValue + ".svg");
        switch(dataValue) {
          case "shape2d":
            this.querySelector(".tool-composer-container-painter > div:nth-child(2)").style.display = "block";
            break;
        }
        return null;
      };
    }
  }

   dispose() {
    this.stamperUI.dispose();
    this.tracerUI.dispose();
    this.spirographUI.dispose();
    this.shape2DPainterUI.dispose();
  }
}
