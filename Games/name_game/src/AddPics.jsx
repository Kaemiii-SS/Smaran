import React, { useState, useRef } from 'react';
import { useI18n } from './i18nContext';

export default function AddPics({ customPhotos, setCustomPhotos, setView }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const fileInputRef = useRef(null);

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file && name.trim()) {
      const url = URL.createObjectURL(file);
      setCustomPhotos(prev => [...prev, { url, title: name.trim().toUpperCase(), maker: "" }]);
      setName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index) => {
    setCustomPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="impostor-game-container add-pics-container" style={{ paddingTop: '80px' }}>
      <div className="stage menu-card add-pics-card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="instructions-title" style={{ marginBottom: '20px' }}>{t('add_photos_title')}</h1>
        
        <div className="upload-form" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder={t('enter_name')} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="name-input"
            style={{ padding: '12px 20px', borderRadius: '100px', border: '3px solid #1459c4', fontFamily: 'Space Grotesk', fontSize: '16px', outline: 'none' }}
          />
          <div className="file-upload-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
            <button className={`btn ghost upload-btn ${!name.trim() ? 'disabled' : ''}`} style={{ margin: 0, height: '100%' }}>
              {t('select_image')}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleAddPhoto} 
              disabled={!name.trim()} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: name.trim() ? 'pointer' : 'default' }}
            />
          </div>
        </div>
        
        <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: '20px' }}>
          {customPhotos.length < 4 
            ? t('upload_more', { n: 4 - customPhotos.length })
            : t('photos_ready', { n: customPhotos.length })}
        </p>

        <div className="preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {customPhotos.map((photo, i) => (
            <div key={i} className="preview-card" style={{ position: 'relative', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '3px solid #1459c4', aspectRatio: '1' }}>
              <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                {photo.title}
              </div>
              <button 
                onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn ghost" onClick={() => setView('menu')} style={{ margin: 0 }}>{t('back')}</button>
          <button 
            className="btn" 
            disabled={customPhotos.length < 4}
            onClick={() => setView('playing')}
            style={{ margin: 0, opacity: customPhotos.length < 4 ? 0.5 : 1, cursor: customPhotos.length < 4 ? 'not-allowed' : 'pointer' }}
          >
            {t('play_custom_game')}
          </button>
        </div>
      </div>
    </div>
  );
}
