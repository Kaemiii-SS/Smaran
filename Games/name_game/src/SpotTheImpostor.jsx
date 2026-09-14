import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SpotTheImpostor.css';
import { ALL_ANIMALS } from './gameData';
import { useI18n } from './i18nContext';

const HIT_WORDS = ["Sharp eye!", "Nice catch!", "Nailed it!", "Spot on!"];
const MISS_WORDS = ["Not quite!", "So close!", "Look again next time!"];

export default function SpotTheImpostor({ customPhotos = [], onBack }) {
  const { t } = useI18n();
  const [view, setView] = useState('intro'); // 'intro', 'countdown', 'round', 'over'
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [shuffledRounds, setShuffledRounds] = useState([]);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [cardStates, setCardStates] = useState(Array(4).fill('')); // '', 'correct', 'wrong'
  const [roundStartTime, setRoundStartTime] = useState(0);

  const startGame = () => {
    let sourceRounds = [];

    if (customPhotos && customPhotos.length >= 4) {
      sourceRounds = customPhotos.map((targetPhoto) => {
        const otherPhotos = customPhotos.filter(p => p !== targetPhoto);
        const shuffledOthers = [...otherPhotos].sort(() => Math.random() - 0.5).slice(0, 3);
        return {
          label: targetPhoto.title,
          images: [targetPhoto, ...shuffledOthers]
        };
      });
    } else {
      // Pick 10 random targets from ALL_ANIMALS
      const shuffledAnimals = [...ALL_ANIMALS].sort(() => Math.random() - 0.5);
      const targets = shuffledAnimals.slice(0, 10);
      
      sourceRounds = targets.map((targetPhoto) => {
        const otherPhotos = ALL_ANIMALS.filter(p => p.title !== targetPhoto.title);
        const shuffledOthers = [...otherPhotos].sort(() => Math.random() - 0.5).slice(0, 3);
        return {
          label: targetPhoto.title,
          images: [targetPhoto, ...shuffledOthers]
        };
      });
    }

    let shuffled = [...sourceRounds].sort(() => Math.random() - 0.5);
    shuffled = shuffled.map(round => ({
      ...round,
      images: [...round.images].sort(() => Math.random() - 0.5)
    }));
    
    setShuffledRounds(shuffled);
    setRoundIndex(0);
    startRound();
  };

  const startRound = useCallback(() => {
    setRoundIndex(prev => {
      // Because startRound can be called from nextRound which updates state, we use functional update
      // But actually we just want to ensure we don't go out of bounds.
      return prev; 
    });
    setLocked(false);
    setFeedback({ text: '', type: '' });
    setCardStates(Array(4).fill(''));
    setView('round');
    setRoundStartTime(performance.now());
  }, []);

  // Needs to be ref-aware of current round info, but we can just use roundIndex state
  const handleGuess = (index) => {
    // Avoid double clicks
    setLocked(prevLocked => {
      if (prevLocked) return true;
      
      // Safe state updates since this is inside a setState to check `locked`
      setRoundIndex(currentRoundIndex => {
        setShuffledRounds(currentRounds => {
          const round = currentRounds[currentRoundIndex];
          const isCorrect = round.images[index].title === round.label;
          const elapsedSeconds = (performance.now() - roundStartTime) / 1000;

          setCardStates(prevStates => {
            const newStates = [...prevStates];
            if (isCorrect) {
              newStates[index] = 'correct';
              // Base 100 pts, lose 10 pts per second, min 20 pts
              let gained = 100 - Math.floor(elapsedSeconds * 10);
              if (gained < 20) gained = 20;
              setScore(s => s + gained);
              setFeedback({ 
                text: HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)] + ` +${gained}`, 
                type: 'correct' 
              });
            } else {
              if (index >= 0) newStates[index] = 'wrong';
              const correctIdx = round.images.findIndex(img => img.title === round.label);
              if (correctIdx >= 0) newStates[correctIdx] = 'correct';
              
              setLives(l => l - 1);
              setFeedback({ 
                text: MISS_WORDS[Math.floor(Math.random() * MISS_WORDS.length)], 
                type: 'wrong' 
              });
            }
            return newStates;
          });

          return currentRounds;
        });
        return currentRoundIndex;
      });

      return true; // Now locked
    });
  };

  const nextRound = () => {
    if (lives <= 1 && locked && feedback.type === 'wrong') { 
        // We lost the last life just now
        setView('over');
        return;
    }

    const nextIndex = roundIndex + 1;
    if (nextIndex >= shuffledRounds.length) {
      setView('over');
    } else {
      setRoundIndex(nextIndex);
      // Hacky way to ensure startRound sees the updated index if we used states. 
      // Instead we use useEffect below or call it directly.
      // But setRoundIndex is async.
      setLocked(false);
      setFeedback({ text: '', type: '' });
      setCardStates(Array(4).fill(''));
      setView('round');
      setRoundStartTime(performance.now());
    }
  };

  const reset = () => {
    setLives(5);
    setScore(0);
    setRoundIndex(0);
    setView('intro');
  };

  // Render lives
  const renderLives = () => {
    return (
      <div className="lives-display">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`pixel-heart ${i >= lives ? 'empty' : 'full'}`}></div>
        ))}
      </div>
    );
  };

  const currentRound = shuffledRounds.length > 0 ? shuffledRounds[roundIndex] : null;

  return (
    <div className="impostor-game-container">
      {onBack && (
        <button className="game-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}

      {(view === 'round' || view === 'intro') && (
        <div className="game-lives-container">
          {renderLives()}
        </div>
      )}
      
      <div className="stage">
        {/* Topbar removed as requested */}

        {view === 'intro' && (
          <div className="panel-view active" id="view-intro">
            <div className="intro instructions-panel">
              <h1 className="instructions-title">{t('how_to_play')}</h1>
              
              <div className="instructions-content">
                <h3 className="instructions-header">{t('gameplay')}</h3>
                <p style={{ marginTop: '5px' }}>{t('gameplay_desc_1')}</p>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: '15px' }}>
                  <li style={{ marginBottom: '8px' }}>{t('gameplay_li_1')}</li>
                  <li>{t('gameplay_li_2')}</li>
                </ul>

                <h3 className="instructions-header">{t('score')}</h3>
                <p>{t('score_desc')}</p>

                <h3 className="instructions-header">{t('lives')}</h3>
                <p>{t('lives_desc')}</p>
              </div>
              
              <div className="instructions-footer">
                <button className="btn instructions-done-btn" onClick={startGame}>{t('done')}</button>
              </div>
            </div>
          </div>
        )}

        {view === 'round' && (
          <div className="panel-view active" id="view-round">
            <div className="prompt-ribbon-container">
              <div className="prompt-ribbon">{t('which_is')} {t(currentRound?.label)}?</div>
            </div>
            
            <div className="cards">
              {currentRound?.images.map((img, i) => {
                const state = cardStates[i];
                const isRevealed = locked;
                let badge = null;
                if (state === 'correct') badge = <div className="badge correct">✓</div>;
                if (state === 'wrong') badge = <div className="badge wrong">✗</div>;
                
                return (
                  <div 
                    key={i} 
                    className={`card ${state} ${locked ? 'disabled revealed' : ''}`}
                    onClick={() => handleGuess(i)}
                  >
                    <img src={img.url} alt={`${currentRound.label} specimen`} />
                    {badge}
                  </div>
                );
              })}
            </div>

            <div className={`feedback ${feedback.type === 'wrong' ? 'wrong' : ''}`}>
              {feedback.text}
            </div>
            
            <div className="round-footer" style={{ minHeight: '52px', display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
              {locked && (
                <button className="btn next-round-btn" onClick={nextRound} style={{ marginTop: 0 }}>
                  {lives <= 0 ? t('see_results') : t('next')} 
                  {lives > 0 && <span style={{marginLeft: '8px'}}>»</span>}
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'over' && (
          <div className="panel-view active" id="view-over">
            <div className="over v2">
              <h1 
                className="win-title-v2" 
                style={lives <= 0 ? {color: '#ff8a8a', textShadow: '-3px -3px 0 #7b0606, 3px -3px 0 #7b0606, -3px 3px 0 #7b0606, 3px 3px 0 #7b0606, 0px 6px 0 #4a0101'} : {}}
              >
                {lives <= 0 ? t('try_again') : t('excellent')}
              </h1>
              
              <div className="win-stars" style={lives <= 0 ? { filter: 'grayscale(100%) opacity(0.8)' } : {}}>
                <img src="/stars_and_coins.jpg" alt="Stars and coins" className="stars-img" />
              </div>
              
              <div className="final-score-v2">{score}</div>
              
              <button 
                className="btn claim-btn" 
                onClick={reset}
                style={lives <= 0 ? { 
                  background: 'linear-gradient(180deg, #ff6b6b 0%, #d62828 100%)', 
                  borderColor: '#9b1b1b', 
                  boxShadow: '0 8px 0 #721111, 0 15px 20px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.4)', 
                  textShadow: '2px 2px 0 #721111, -1px -1px 0 #721111, 1px -1px 0 #721111, -1px 1px 0 #721111' 
                } : {}}
              >
                {lives <= 0 ? t('play_again') : t('claim')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
