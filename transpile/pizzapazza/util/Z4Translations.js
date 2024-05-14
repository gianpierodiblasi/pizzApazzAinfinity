/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  CURRENT_LANGUAGE = null;

  // Ribbon File
  static  FILE = "";

  static  NEW_PROJECT = "";

  static  CREATE = "";

  static  FROM_CLIPBOARD = "";

  static  FROM_FILE = "";

  static  OPEN = "";

  static  OPEN_PROJECT = "";

  static  SAVE = "";

  static  SAVE_PROJECT = "";

  static  EXPORT = "";

  static  PROJECT_NOT_SAVED_MESSAGE = "";

  // Ribbon Layer
  static  LAYER = "";

  static  LAYER_NAME = "";

  static  NEW_LAYER = "";

  static  BACKGROUND_LAYER = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  THEME_COLOR = "";

  static  REFRESH_PAGE_MESSAGE = "";

  // Other
  static  PROJECT_NAME = "";

  static  FILENAME = "";

  static  QUALITY = "";

  static  RESET = "";

  static  WIDTH = "";

  static  HEIGHT = "";

  static  RESOLUTION = "";

  static  FILLING_COLOR = "";

  static  EDIT = "";

  static  FIT = "";

  static  OFFSET_X = "";

  static  OFFSET_Y = "";

  static  BASIC = "";

  static  ADVANCED = "";

  // Composite Operation
  static  COMPOSITE_OPERATION = "";

  static  COMPOSITE_OPERATION_SOURCE_OVER = "";

  static  COMPOSITE_OPERATION_SOURCE_IN = "";

  static  COMPOSITE_OPERATION_SOURCE_OUT = "";

  static  COMPOSITE_OPERATION_SOURCE_ATOP = "";

  static  COMPOSITE_OPERATION_DESTINATION_OVER = "";

  static  COMPOSITE_OPERATION_DESTINATION_IN = "";

  static  COMPOSITE_OPERATION_DESTINATION_OUT = "";

  static  COMPOSITE_OPERATION_DESTINATION_ATOP = "";

  static  COMPOSITE_OPERATION_LIGHTER = "";

  static  COMPOSITE_OPERATION_COPY = "";

  static  COMPOSITE_OPERATION_XOR = "";

  static  COMPOSITE_OPERATION_MULTIPLY = "";

  static  COMPOSITE_OPERATION_SCREEN = "";

  static  COMPOSITE_OPERATION_OVERLAY = "";

  static  COMPOSITE_OPERATION_DARKEN = "";

  static  COMPOSITE_OPERATION_LIGHTEN = "";

  static  COMPOSITE_OPERATION_COLOR_DODGE = "";

  static  COMPOSITE_OPERATION_COLOR_BURN = "";

  static  COMPOSITE_OPERATION_HARD_LIGHT = "";

  static  COMPOSITE_OPERATION_SOFT_LIGHT = "";

  static  COMPOSITE_OPERATION_DIFFERENCE = "";

  static  COMPOSITE_OPERATION_EXCLUSION = "";

  static  COMPOSITE_OPERATION_HUE = "";

  static  COMPOSITE_OPERATION_SATURATION = "";

  static  COMPOSITE_OPERATION_COLOR = "";

  static  COMPOSITE_OPERATION_LUMINOSITY = "";

  static {
    switch(navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  constructor() {
  }
  /**
   * Sets the English language
   */
  static  setEnglish() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW_PROJECT = "New Project";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.EXPORT = "Export";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Project not saved, do you want to save your changes?";
    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    Z4Translations.LAYER_NAME = "Layer Name";
    Z4Translations.NEW_LAYER = "New Layer";
    Z4Translations.BACKGROUND_LAYER = "Bkgrd";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    // Other
    Z4Translations.PROJECT_NAME = "Project Name";
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.WIDTH = "Width";
    Z4Translations.HEIGHT = "Height";
    Z4Translations.RESOLUTION = "Resolution";
    Z4Translations.FILLING_COLOR = "Filling Color";
    Z4Translations.EDIT = "Edit";
    Z4Translations.FIT = "Fit";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Basic";
    Z4Translations.ADVANCED = "Advanced";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Composite Operation";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "default, layer drawn on top of content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "layer drawn only where overlap with content, transparent everything else";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "layer drawn where it doesn't overlap content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "layer drawn only where it overlaps content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "layer drawn behind content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "content kept where layer and content overlap, transparent everything else";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "content kept where it doesn't overlap layer";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "content kept only where it overlaps layer, layer drawn behind content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "where both elements overlap the color is determined by adding color values";
    Z4Translations.COMPOSITE_OPERATION_COPY = "only layer shown";
    Z4Translations.COMPOSITE_OPERATION_XOR = "layer and content made transparent where both overlap and drawn normal everywhere else";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "multiply layer pixels with corresponding content pixel: darker picture";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "pixels inverted, multiplied, inverted again: lighter picture, opposite of multiply";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "multiply-screen combination: content dark parts become darker, light parts become lighter";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "retain darkest pixels of both";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "retain lightest pixels of both";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "divide content by inverted layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "divide inverted content by layer and inverts the result";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "multiply-screen combination like overlay, with layer and content swapped";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "hard-light softer version (Pure black or white does not result in pure black or white)";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "subtract content from layer and round to always get positive values";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "like difference, but with lower contrast";
    Z4Translations.COMPOSITE_OPERATION_HUE = "preserve content luma and chroma, adopt layer hue";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "preserve content luma and hue, adopt layer chroma";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "preserve content luma, adopt layer hue and chroma";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "preserve content hue and chroma, adopt layer luma";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    // Ribbon File
    Z4Translations.FILE = "File";
    Z4Translations.NEW_PROJECT = "Nuovo Progetto";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.EXPORT = "Esporta";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Progetto non salvato, vuoi salvare le modifiche?";
    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    Z4Translations.LAYER_NAME = "Nome Livello";
    Z4Translations.NEW_LAYER = "Nuovo Livello";
    Z4Translations.BACKGROUND_LAYER = "Sfondo";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    // Other
    Z4Translations.PROJECT_NAME = "Nome Progetto";
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.WIDTH = "Larghezza";
    Z4Translations.HEIGHT = "Altezza";
    Z4Translations.RESOLUTION = "Risoluzione";
    Z4Translations.FILLING_COLOR = "Colore di Riempimento";
    Z4Translations.EDIT = "Modifica";
    Z4Translations.FIT = "Adatta";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Base";
    Z4Translations.ADVANCED = "Avanzato";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Operazione Composita";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "default, livello disegnato sopra contenuto";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "livello disegnato solo dove sovrapposto con contenuto, trasparente altrove";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "livello disegnato dove non sovrapposto al contenuto";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "livello disegnato solo dove sovrapposto con contenuto";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "livello disegnato dietro contenuto";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "contenuto mantenuto dove livello e contenuto sovrapposti, trasparente altrove";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "contenuto mantenuto dove non sovrapposto al livello";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "contenuto mantenuto solo dove sovrapposto al livello, livello disegnato dietro contenuto";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "dove entrambi elementi sovrapposti colore determinato sommando i colori";
    Z4Translations.COMPOSITE_OPERATION_COPY = "mostrato solo il livello";
    Z4Translations.COMPOSITE_OPERATION_XOR = "livello e contenuto resi trasparenti dove sovrapposti e disegnato normale altrove";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "multiply: moltiplica pixel livello con corrispondente pixel contenuto: immagine scurita";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "screen: pixel invertiti, moltiplicati, invertiti ancora: immagine schiarita, opposto di multiply";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "overlay: combinazione multiply-screen: parti scure del contenuto scuriscono, parti chiare schiariscono";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "conserva pixel pi\u00F9 scuri di entrambi";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "conserva pixel pi\u00F9 chiari di entrambi";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "divide contenuto per l'inverso del livello";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "divide l'inverso del contenuto per il livello ed inverte il risultato";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "combinazione multiply-screen come overlay, con livello e contenuto scambiati";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "versione soft di hard-light (neri e bianchi puri non diventano neri e bianchi puri)";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "sottrae contenuto da livello ed arrotonda per avere sempre un valore positivo";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "come difference, ma con costrasto minore";
    Z4Translations.COMPOSITE_OPERATION_HUE = "preserva luminanza e crominanza del contenuto, usa tinta del livello";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "preserva luminanza e tinta del contenuto, usa crominanza del livello";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "preserva luminanza del contenuto, usa tinta e crominanza del livello";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "preserva tinta e crominanza del contenuto, usa luminanza del livello";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
