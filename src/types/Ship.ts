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
  TURBOLIFT: 'turbolift',
  BULKHEAD: 'bulkhead',
} as const;

export type CellType = typeof CellType[keyof typeof CellType];

export interface Cell {
  type: CellType;
  roomId?: number;
  deck?: number;
}

export interface Room {
  id: number;
  type: CellType;
  name: string;
  cells: Array<{ x: number; y: number }>;
  deck: number;
}

export interface Deck {
  number: number;
  name: string;
  grid: Cell[][];
  rooms: Room[];
}

export interface Ship {
  name: string;
  width: number;
  height: number;
  grid: Cell[][];  // Legacy - kept for simple view
  rooms: Room[];
  decks: Deck[];
  turboliftPositions: Array<{ x: number; y: number }>;
  seed: number;
  deckCount: number;
}
