import type { Room } from '../types';
import './RoomLegend.css';

interface Props {
  rooms: Room[];
  currentDeck?: number;
  turboliftCount?: number;
}

const ROOM_COLORS: Record<string, string> = {
  bridge: '#0984e3',
  engineering: '#fdcb6e',
  cargo: '#6c5ce7',
  quarters: '#00b894',
  medbay: '#e84393',
  airlock: '#e74c3c',
  corridor: '#b2bec3',
  turbolift: '#00cec9',
  bulkhead: '#636e72',
};

export function RoomLegend({ rooms, currentDeck, turboliftCount }: Props) {
  // Filter rooms by current deck if specified
  const displayRooms = currentDeck 
    ? rooms.filter(r => r.deck === currentDeck)
    : rooms;

  return (
    <div className="room-legend">
      <h3>Ship Manifest {currentDeck ? `- Deck ${currentDeck}` : ''}</h3>
      <ul>
        {displayRooms.map((room) => (
          <li key={room.id}>
            <span
              className="color-swatch"
              style={{ backgroundColor: ROOM_COLORS[room.type] || '#636e72' }}
            />
            {room.name} ({room.cells.length} cells)
            {room.deck && !currentDeck && <span className="deck-badge">D{room.deck}</span>}
          </li>
        ))}
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#b2bec3' }} />
          Corridors
        </li>
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#00cec9' }} />
          Turbolifts {turboliftCount ? `(${turboliftCount})` : ''}
        </li>
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#636e72' }} />
          Bulkheads
        </li>
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#2d3436' }} />
          Hull
        </li>
      </ul>
    </div>
  );
}
