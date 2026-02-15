import type { Ship, Deck, Cell } from '../types';
import { CellType } from '../types';
import { NoiseGenerator } from './NoiseGenerator';
import { NameGenerator } from './NameGenerator';
import { HullGenerator } from './HullGenerator';
import { RoomGenerator } from './RoomGenerator';

const DECK_NAMES = [
  'Bridge Deck',
  'Crew Deck', 
  'Operations Deck',
  'Engineering Deck',
  'Cargo Deck',
];

export class ShipGenerator {
  private seed: number;
  private width: number;
  private height: number;

  constructor(seed?: number, width: number = 60, height: number = 30) {
    this.seed = seed ?? Math.floor(Math.random() * 1000000);
    this.width = width;
    this.height = height;
  }

  generate(): Ship {
    const noise = new NoiseGenerator(this.seed);
    const nameGen = new NameGenerator(this.seed);

    // Determine number of decks based on ship size (2-5 decks)
    const deckCount = Math.min(5, Math.max(2, Math.floor(2 + noise.getNormalized(0, 0, 0.1) * 4)));

    // Generate turbolift positions (2-4 turbolifts based on ship size)
    const turboliftCount = Math.floor(2 + noise.getNormalized(10, 10, 0.1) * 3);
    const turboliftPositions = this.generateTurboliftPositions(noise, turboliftCount);

    // Generate each deck
    const decks: Deck[] = [];
    let allRooms: import('../types').Room[] = [];
    let roomIdOffset = 0;

    for (let d = 0; d < deckCount; d++) {
      const deckNoise = new NoiseGenerator(this.seed + d * 1000);
      
      // Generate hull shape (slightly different per deck for variety)
      const hullGen = new HullGenerator(deckNoise, this.width, this.height);
      const hullGrid = hullGen.generate();

      // Mark turbolift positions on the hull
      this.markTurbolifts(hullGrid, turboliftPositions);

      // Place rooms inside hull
      const roomGen = new RoomGenerator(deckNoise, this.width, this.height, d, roomIdOffset);
      const { grid, rooms } = roomGen.generate(hullGrid, d, deckCount);
      
      // Add bulkheads between sections
      this.addBulkheads(grid, noise, d);

      // Mark deck number on all cells
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (grid[y][x].type !== CellType.EMPTY) {
            grid[y][x].deck = d + 1;
          }
        }
      }

      decks.push({
        number: d + 1,
        name: DECK_NAMES[d] || `Deck ${d + 1}`,
        grid,
        rooms,
      });

      allRooms = allRooms.concat(rooms);
      roomIdOffset += rooms.length;
    }

    // Use the first deck's grid as the main grid for backwards compatibility
    const mainGrid = decks[0]?.grid || this.createEmptyGrid();

    return {
      name: nameGen.generate(),
      width: this.width,
      height: this.height,
      grid: mainGrid,
      rooms: allRooms,
      decks,
      turboliftPositions,
      seed: this.seed,
      deckCount,
    };
  }

  private generateTurboliftPositions(
    noise: NoiseGenerator, 
    count: number
  ): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = [];
    const centerY = this.height / 2;

    // Place turbolifts at strategic locations along the ship's spine
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / (count + 1); // Distribute evenly along ship length
      const x = Math.floor(this.width * 0.15 + (this.width * 0.7) * t);
      const yOffset = Math.floor(noise.getNormalized(x, i * 100, 0.2) * 4 - 2);
      const y = Math.floor(centerY + yOffset);
      
      positions.push({ x, y });
    }

    return positions;
  }

  private markTurbolifts(grid: Cell[][], positions: Array<{ x: number; y: number }>): void {
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
        if (grid[pos.y][pos.x].type === CellType.FLOOR || 
            grid[pos.y][pos.x].type === CellType.CORRIDOR) {
          grid[pos.y][pos.x] = { type: CellType.TURBOLIFT };
        }
      }
    }
  }

  private addBulkheads(grid: Cell[][], noise: NoiseGenerator, deckNum: number): void {
    // Add bulkheads at regular intervals along the ship
    const bulkheadInterval = Math.floor(this.width / 5);
    
    for (let section = 1; section < 5; section++) {
      const x = section * bulkheadInterval;
      const jitter = Math.floor(noise.getNormalized(x, deckNum * 50, 0.3) * 3 - 1);
      const bulkheadX = Math.max(2, Math.min(this.width - 3, x + jitter));
      
      // Draw vertical bulkhead
      for (let y = 0; y < this.height; y++) {
        const cell = grid[y][bulkheadX];
        // Only place bulkhead on floor/corridor cells, not rooms or turbolifts
        if (cell.type === CellType.FLOOR || cell.type === CellType.CORRIDOR) {
          grid[y][bulkheadX] = { type: CellType.BULKHEAD };
        }
      }
    }
  }

  private createEmptyGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y][x] = { type: CellType.EMPTY };
      }
    }
    return grid;
  }
}
