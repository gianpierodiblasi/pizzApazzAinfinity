window.onload=e=>{switch(localStorage.getItem("z4language")){case"en":Translations.setEnglish(),Z4Translations.setEnglish();break;case"it":Translations.setItalian(),Z4Translations.setItalian()}switch(localStorage.getItem("z4theme")){case"light":break;case"dark":SwingJS.instance().darkMode(!0).build();break;default:SwingJS.instance().darkMode(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches).build()}new Z4Frame};class Z4Frame extends JSFrame{ribbon=new Z4Ribbon;constructor(){super(),this.cssAddClass("z4frame"),this.getContentPane().add(this.ribbon,BorderLayout.NORTH)}}class Z4RibbonSettingsPanel extends JSPanel{language=new JSComboBox;theme=new JSComboBox;languageModelAndRenderer=new DefaultKeyValueComboBoxModelAndRenderer;themeModelAndRenderer=new DefaultKeyValueComboBoxModelAndRenderer;constructor(){super(),this.cssAddClass("z4ribbonsettingspanel"),this.setLayout(new GridBagLayout);let e=new JSLabel;e.setText(Z4Translations.LANGUAGE);let n=new GridBagConstraints;n.gridx=0,n.gridy=0,n.anchor=GridBagConstraints.WEST,n.insets=new Insets(5,5,2,0),this.add(e,n),this.languageModelAndRenderer.addElement(new KeyValue("en",Z4Translations.LANGUAGE_ENGLISH_NATIVE)),this.languageModelAndRenderer.addElement(new KeyValue("it",Z4Translations.LANGUAGE_ITALIAN_NATIVE)),this.language.setModelAndRenderer(this.languageModelAndRenderer),this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE),this.language.addActionListener(e=>this.onchangeLanguage()),(n=new GridBagConstraints).gridx=0,n.gridy=1,n.fill=GridBagConstraints.HORIZONTAL,n.insets=new Insets(0,5,0,0),this.add(this.language,n),(e=new JSLabel).setText(Z4Translations.THEME),(n=new GridBagConstraints).gridx=1,n.gridy=0,n.anchor=GridBagConstraints.WEST,n.insets=new Insets(5,5,2,0),this.add(e,n);let t=null;switch(localStorage.getItem("z4theme")){case"light":t=new KeyValue("light",Z4Translations.THEME_LIGHT);break;case"dark":t=new KeyValue("dark",Z4Translations.THEME_DARK);break;default:t=new KeyValue("auto",Z4Translations.THEME_AUTO)}this.themeModelAndRenderer.addElement(new KeyValue("auto",Z4Translations.THEME_AUTO)),this.themeModelAndRenderer.addElement(new KeyValue("light",Z4Translations.THEME_LIGHT)),this.themeModelAndRenderer.addElement(new KeyValue("dark",Z4Translations.THEME_DARK)),this.theme.setModelAndRenderer(this.themeModelAndRenderer),this.theme.setSelectedItem(t),this.theme.addActionListener(e=>this.onchangeTheme()),(n=new GridBagConstraints).gridx=1,n.gridy=1,n.fill=GridBagConstraints.HORIZONTAL,n.insets=new Insets(0,5,0,0),this.add(this.theme,n),e=new JSLabel,(n=new GridBagConstraints).gridx=2,n.gridy=0,n.gridheight=2,n.fill=GridBagConstraints.BOTH,n.weightx=1,this.add(e,n)}onchangeLanguage(){localStorage.setItem("z4language",this.language.getSelectedItem().key),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.LANGUAGE,JSOptionPane.INFORMATION_MESSAGE,null)}onchangeTheme(){localStorage.setItem("z4theme",this.theme.getSelectedItem().key),JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE,Z4Translations.THEME,JSOptionPane.INFORMATION_MESSAGE,null)}}class Z4Ribbon extends JSTabbedPane{settingsPanel=new Z4RibbonSettingsPanel;constructor(){super(),this.cssAddClass("z4ribbon"),this.addTab(Z4Translations.SETTINGS,this.settingsPanel)}}class Z4Translations{static CURRENT_LANGUAGE=null;static REFRESH_PAGE_MESSAGE="";static SETTINGS="";static LANGUAGE="";static LANGUAGE_ENGLISH_NATIVE="";static LANGUAGE_ITALIAN_NATIVE="";static THEME="";static THEME_AUTO="";static THEME_LIGHT="";static THEME_DARK="";static{switch(navigator.language.substring(0,2)){case"en":default:Z4Translations.setEnglish();break;case"it":Z4Translations.setItalian()}}constructor(){}static setEnglish(){Z4Translations.REFRESH_PAGE_MESSAGE="Refresh the page to make the changes",Z4Translations.SETTINGS="Settings",Z4Translations.LANGUAGE="Language",Z4Translations.LANGUAGE_ENGLISH_NATIVE="English",Z4Translations.LANGUAGE_ITALIAN_NATIVE="Italiano",Z4Translations.THEME="Theme",Z4Translations.THEME_AUTO="Auto",Z4Translations.THEME_LIGHT="Light",Z4Translations.THEME_DARK="Dark",Z4Translations.CURRENT_LANGUAGE=new KeyValue("en",Z4Translations.LANGUAGE_ENGLISH_NATIVE)}static setItalian(){Z4Translations.REFRESH_PAGE_MESSAGE="Aggiorna la pagina per eseguire le modifiche",Z4Translations.SETTINGS="Impostazioni",Z4Translations.LANGUAGE="Lingua",Z4Translations.LANGUAGE_ENGLISH_NATIVE="English",Z4Translations.LANGUAGE_ITALIAN_NATIVE="Italiano",Z4Translations.THEME="Tema",Z4Translations.THEME_AUTO="Auto",Z4Translations.THEME_LIGHT="Chiaro",Z4Translations.THEME_DARK="Scuro",Z4Translations.CURRENT_LANGUAGE=new KeyValue("it",Z4Translations.LANGUAGE_ITALIAN_NATIVE)}}