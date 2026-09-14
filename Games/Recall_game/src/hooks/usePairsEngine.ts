import { useMemo } from 'react';
import { CATEGORIES } from '../config/levels';

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function usePairsEngine(levelConfig) {
  const deck = useMemo(() => {
    if (!levelConfig) return [];
    
    // Gather all available icons from specified categories
    let availableIcons = [];
    levelConfig.categories.forEach(cat => {
      if (CATEGORIES[cat]) {
        availableIcons = [...availableIcons, ...CATEGORIES[cat]];
      }
    });
    
    // Shuffle and pick the required number of pairs
    availableIcons = shuffle(availableIcons);
    const selectedIcons = availableIcons.slice(0, levelConfig.pairs);
    
    // Create pairs
    let cards = [];
    selectedIcons.forEach((icon, index) => {
      cards.push({ id: `pair-${index}-a`, value: icon, pairId: index });
      cards.push({ id: `pair-${index}-b`, value: icon, pairId: index });
    });
    
    // If level has empty slots, add placeholder cards
    if (levelConfig.emptySlots) {
      for (let i = 0; i < levelConfig.emptySlots; i++) {
        cards.push({ id: `empty-${i}`, value: null, isEmpty: true });
      }
    }
    
    // Shuffle the final deck
    return shuffle(cards);
  }, [levelConfig]);

  return deck;
}
