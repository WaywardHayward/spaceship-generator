import type { Cell } from '../types';
import { CellType } from '../types';
import './ShipCell.css';

interface Props {
  cell: Cell;
}

const CELL_CLASS_MAP: Record<CellType, string> = {
  [CellType.EMPTY]: 'cell-empty',
  [CellType.HULL]: 'cell-hull',
  [CellType.FLOOR]: 'cell-floor',
  [CellType.WALL]: 'cell-wall',
  [CellType.DOOR]: 'cell-door',
  [CellType.BRIDGE]: 'cell-bridge',
  [CellType.ENGINEERING]: 'cell-engineering',
  [CellType.CARGO]: 'cell-cargo',
  [CellType.QUARTERS]: 'cell-quarters',
  [CellType.MEDBAY]: 'cell-medbay',
  [CellType.AIRLOCK]: 'cell-airlock',
  [CellType.CORRIDOR]: 'cell-corridor',
};

export function ShipCell({ cell }: Props) {
  const className = `ship-cell ${CELL_CLASS_MAP[cell.type]}`;
  return <div className={className} />;
}
