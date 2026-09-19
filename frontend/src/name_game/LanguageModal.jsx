import React, { useState } from 'react';
import './LanguageModal.css';
import { useI18n } from './i18nContext';

export default function LanguageModal({ onClose }) {
  const { language, setLanguage, t } = useI18n();
  const [selectedLang, setSelectedLang] = useState(language);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'as', label: 'অসমীয়া' }
  ];

  const handleSave = () => {
    setLanguage(selectedLang);
    onClose();
  };

  return (
    <div className="lang-modal-overlay">
      <div className="lang-modal">
        <div className="lang-modal-header">
          <h2>Change Language</h2>
          <div className="wave"></div>
        </div>
        
        <div className="lang-modal-body">
          <div className="lang-grid">
            {languages.map(lang => (
              <div 
                key={lang.code} 
                className={`lang-option ${selectedLang === lang.code ? 'selected' : ''}`}
                onClick={() => setSelectedLang(lang.code)}
              >
                <div className="checkbox">
                  {selectedLang === lang.code && <div className="checkmark">✔</div>}
                </div>
                <span>{lang.label}</span>
              </div>
            ))}
          </div>
          
          <button className="lang-ok-btn" onClick={handleSave}>OK</button>
        </div>
      </div>
    </div>
  );
}
