import type { Ship } from '../types';
import { ShipCell } from './ShipCell';
import './ShipGrid.css';

interface Props {
  ship: Ship;
}

export function ShipGrid({ ship }: Props) {
  return (
    <div
      className="ship-grid"
      style={{
        gridTemplateColumns: `repeat(${ship.width}, 12px)`,
        gridTemplateRows: `repeat(${ship.height}, 12px)`,
      }}
    >
      {ship.grid.flatMap((row, y) =>
        row.map((cell, x) => (
          <ShipCell key={`${x}-${y}`} cell={cell} />
        ))
      )}
    </div>
  );
}
