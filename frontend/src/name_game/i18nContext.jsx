import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('appLanguage');
    if (saved && translations[saved]) {
      return saved;
    }
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      return browserLang;
    }
    return 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key, params = {}) => {
    let str = translations[language]?.[key] || translations['en'][key] || key;
    // Replace {n} or other params
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
    return str;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
