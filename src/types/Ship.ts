export const CellType = {
  EMPTY: 'empty',
  HULL: 'hull',
  FLOOR: 'floor',
  WALL: 'wall',
  DOOR: 'door',
  BRIDGE: 'bridge',
  ENGINEERING: 'engineering',
  CARGO: 'cargo',
  QUARTERS: 'quarters',
  MEDBAY: 'medbay',
  AIRLOCK: 'airlock',
  CORRIDOR: 'corridor',
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export interface Cell {
  type: CellType;
  roomId?: number;
}

export interface Room {
  id: number;
  type: CellType;
  name: string;
  cells: Array<{ x: number; y: number }>;
}

export interface Ship {
  name: string;
  width: number;
  height: number;
  grid: Cell[][];
  rooms: Room[];
  seed: number;
}
