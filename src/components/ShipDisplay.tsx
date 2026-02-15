import type { Ship } from '../types';
import { ShipGrid } from './ShipGrid';
import { RoomLegend } from './RoomLegend';
import './ShipDisplay.css';

interface Props {
  ship: Ship;
  onRegenerate: () => void;
}

export function ShipDisplay({ ship, onRegenerate }: Props) {
  return (
    <div className="ship-display">
      <header className="ship-header">
        <h1>{ship.name}</h1>
        <p className="seed">Seed: {ship.seed}</p>
        <button className="regenerate-btn" onClick={onRegenerate}>
          🎲 Generate New Ship
        </button>
      </header>

      <div className="ship-content">
        <ShipGrid ship={ship} />
        <RoomLegend rooms={ship.rooms} />
      </div>
    </div>
  );
}
