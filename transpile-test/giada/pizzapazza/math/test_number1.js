/**
 * @author gianpiero.di.blasi
 */
class test_number1 {

  static  onLoad() {
    document.getElementById("language").value = Z4Setting.getLanguage();
    document.getElementById("language").onchange = (event) => {
      Z4Setting.setLanguage(document.getElementById("language").value);
      Z4MessageFactory.changingLanguage();
      return null;
    };
    document.getElementById("theme").value = Z4Setting.getTheme();
    document.getElementById("theme").onchange = (event) => {
      Z4Setting.setTheme(document.getElementById("theme").value);
      return null;
    };
    document.getElementById("mode").value = Z4Setting.getMode();
    document.getElementById("mode").onchange = (event) => {
      Z4Setting.setMode(document.getElementById("mode").value);
      return null;
    };
    let ui = new Z4NumberUI();
    ui.appendTo(document.querySelector("#test1"));
    ui.oninput = (Object) => document.getElementById("test2").textContent = "ONINPUT " + ui.getValue() + " " + JSON.stringify(ui.getSign());
    ui.onchange = (Object) => document.getElementById("test2").textContent = "ONCHANGE " + ui.getValue() + " " + JSON.stringify(ui.getSign());
    document.getElementById("test2").textContent = ui.getValue() + " " + JSON.stringify(ui.getSign());
  }

  constructor() {
  }
}
