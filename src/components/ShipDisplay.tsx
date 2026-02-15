import { useState } from 'react';
import type { Ship } from '../types';
import { ShipGrid } from './ShipGrid';
import { RoomLegend } from './RoomLegend';
import './ShipDisplay.css';

interface Props {
  ship: Ship;
  onRegenerate: () => void;
}

export function ShipDisplay({ ship, onRegenerate }: Props) {
  const [currentDeck, setCurrentDeck] = useState(1);

  const currentDeckData = ship.decks[currentDeck - 1];
  const displayGrid = currentDeckData?.grid || ship.grid;

  return (
    <div className="ship-display">
      <header className="ship-header">
        <h1>{ship.name}</h1>
        <p className="seed">Seed: {ship.seed}</p>
        <div className="ship-stats">
          <span className="stat">🚀 {ship.deckCount} Decks</span>
          <span className="stat">🛗 {ship.turboliftPositions.length} Turbolifts</span>
          <span className="stat">📦 {ship.rooms.length} Rooms</span>
        </div>
        <button className="regenerate-btn" onClick={onRegenerate}>
          🎲 Generate New Ship
        </button>
      </header>

      <div className="ship-main-area">
        <aside className="deck-sidebar">
          <h3>Decks</h3>
          <div className="deck-buttons">
            {ship.decks.map((deck) => (
              <button
                key={deck.number}
                className={`deck-btn ${currentDeck === deck.number ? 'active' : ''}`}
                onClick={() => setCurrentDeck(deck.number)}
              >
                <span className="deck-number">D{deck.number}</span>
                <span className="deck-name">{deck.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="ship-content">
          <div className="grid-container">
            <h3 className="deck-title">
              Deck {currentDeck}: {currentDeckData?.name || 'Unknown'}
            </h3>
            <ShipGrid ship={{ ...ship, grid: displayGrid }} />
          </div>
          <RoomLegend 
            rooms={ship.rooms} 
            currentDeck={currentDeck}
            turboliftCount={ship.turboliftPositions.length}
          />
        </div>
      </div>
    </div>
  );
}
