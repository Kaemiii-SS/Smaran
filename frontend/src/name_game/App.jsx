import { useState, useEffect } from 'react'
import SpotTheImpostor from './SpotTheImpostor'
import Navbar from './Navbar'
import AddPics from './AddPics'
import LanguageModal from './LanguageModal'
import { useI18n } from './i18nContext'
import './App.css'

function App() {
  const [view, setView] = useState('landing') // 'landing', 'menu', 'playing', 'addPics'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [customPhotos, setCustomPhotos] = useState([])
  const [showLangModal, setShowLangModal] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {view !== 'landing' && <Navbar />}
      
      {showLangModal && <LanguageModal onClose={() => setShowLangModal(false)} />}

      {view === 'playing' && <SpotTheImpostor customPhotos={customPhotos} onBack={() => setView('menu')} />}
      
      {view === 'addPics' && (
        <AddPics 
          customPhotos={customPhotos} 
          setCustomPhotos={setCustomPhotos} 
          setView={setView} 
        />
      )}

      {view === 'menu' && (
        <div className="impostor-game-container" style={{ paddingTop: '80px' }}>
          <div className="stage menu-card">
            <button className="menu-btn" onClick={() => setView('playing')}>
              {t('play')}
            </button>
            <button className="menu-btn small-btn" onClick={() => setView('addPics')}>
              {t('add_photos')}
            </button>
          </div>
        </div>
      )}
      
      {view === 'landing' && (
        <div className="landing-page">
          <button className="btn lang-btn" onClick={() => setShowLangModal(true)}>
            🌐 {t('Language') || 'Language'}
          </button>
          <video 
            key={isMobile ? 'mobile' : 'desktop'}
            className="background-video" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={isMobile ? "/make_this_for_mobile_screen_to.mp4" : "/background-video.mp4"} type="video/mp4" />
          </video>
          <div className="button-group">
            <button className="play-btn" onClick={() => setView('menu')}>
              {t('play_game')}
            </button>
          </div>
        </div>
      )}
      
      {/* Mascot Video with native transparency, only visible during gameplay */}
      {view === 'playing' && (
        <video className="mascot-video" autoPlay loop muted playsInline>
          <source src="/mascot-transparent.webm" type="video/webm" />
        </video>
      )}
    </>
  )
}

export default App
