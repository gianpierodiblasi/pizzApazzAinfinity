/* global Translations, Z4Translations */

window.onload = event => {
  var language = localStorage.getItem("z4language");
  switch (language) {
    case "en":
      Translations.setEnglish();
      Z4Translations.setEnglish();
      break;
    case "it":
      Translations.setItalian();
      Z4Translations.setItalian();
      break;
  }

  localStorage.getItem("z4darkmode");
  
  new Z4Frame();
};