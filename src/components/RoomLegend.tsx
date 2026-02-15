import type { Room } from '../types';
import './RoomLegend.css';

interface Props {
  rooms: Room[];
}

const ROOM_COLORS: Record<string, string> = {
  bridge: '#0984e3',
  engineering: '#fdcb6e',
  cargo: '#6c5ce7',
  quarters: '#00b894',
  medbay: '#e84393',
  airlock: '#e74c3c',
  corridor: '#b2bec3',
};

export function RoomLegend({ rooms }: Props) {
  return (
    <div className="room-legend">
      <h3>Ship Manifest</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <span
              className="color-swatch"
              style={{ backgroundColor: ROOM_COLORS[room.type] || '#636e72' }}
            />
            {room.name} ({room.cells.length} cells)
          </li>
        ))}
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#b2bec3' }} />
          Corridors
        </li>
        <li className="legend-item">
          <span className="color-swatch" style={{ backgroundColor: '#2d3436' }} />
          Hull
        </li>
      </ul>
    </div>
  );
}
