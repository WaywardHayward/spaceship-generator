import type { Cell, Room } from '../types';
import { CellType } from '../types';
import { NoiseGenerator } from './NoiseGenerator';

interface RoomConfig {
  type: CellType;
  name: string;
  minSize: number;
  maxSize: number;
  priority: number;
  preferredX: 'front' | 'back' | 'center' | 'any';
}

const ROOM_CONFIGS: RoomConfig[] = [
  { type: CellType.BRIDGE, name: 'Bridge', minSize: 4, maxSize: 8, priority: 1, preferredX: 'front' },
  { type: CellType.ENGINEERING, name: 'Engineering', minSize: 6, maxSize: 12, priority: 2, preferredX: 'back' },
  { type: CellType.CARGO, name: 'Cargo Bay', minSize: 8, maxSize: 16, priority: 3, preferredX: 'center' },
  { type: CellType.MEDBAY, name: 'Medbay', minSize: 3, maxSize: 6, priority: 4, preferredX: 'center' },
  { type: CellType.QUARTERS, name: 'Crew Quarters', minSize: 4, maxSize: 8, priority: 5, preferredX: 'center' },
  { type: CellType.AIRLOCK, name: 'Airlock', minSize: 2, maxSize: 3, priority: 6, preferredX: 'any' },
];

export class RoomGenerator {
  private noise: NoiseGenerator;
  private width: number;
  private height: number;
  private rooms: Room[] = [];
  private nextRoomId = 1;

  constructor(noise: NoiseGenerator, width: number, height: number) {
    this.noise = noise;
    this.width = width;
    this.height = height;
  }

  generate(grid: Cell[][]): { grid: Cell[][]; rooms: Room[] } {
    const updatedGrid = this.cloneGrid(grid);
    
    for (const config of ROOM_CONFIGS) {
      this.placeRoom(updatedGrid, config);
    }

    this.markCorridors(updatedGrid);
    return { grid: updatedGrid, rooms: this.rooms };
  }

  private cloneGrid(grid: Cell[][]): Cell[][] {
    return grid.map(row => row.map(cell => ({ ...cell })));
  }

  private placeRoom(grid: Cell[][], config: RoomConfig): void {
    const candidates = this.findCandidates(grid, config);
    if (candidates.length === 0) return;

    const chosen = this.selectBestCandidate(candidates, config);
    if (!chosen) return;

    this.fillRoom(grid, chosen, config);
  }

  private findCandidates(grid: Cell[][], config: RoomConfig): Array<{ x: number; y: number }> {
    const candidates: Array<{ x: number; y: number }> = [];
    
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        if (grid[y][x].type !== CellType.FLOOR) continue;
        if (this.canPlaceRoom(grid, x, y, config.minSize)) {
          candidates.push({ x, y });
        }
      }
    }
    return candidates;
  }

  private canPlaceRoom(grid: Cell[][], x: number, y: number, size: number): boolean {
    const halfSize = Math.floor(size / 2);
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) return false;
        if (grid[ny][nx].type !== CellType.FLOOR) return false;
      }
    }
    return true;
  }

  private selectBestCandidate(
    candidates: Array<{ x: number; y: number }>,
    config: RoomConfig
  ): { x: number; y: number } | null {
    if (candidates.length === 0) return null;

    const scored = candidates.map(c => ({
      ...c,
      score: this.scorePosition(c.x, c.y, config),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  private scorePosition(x: number, y: number, config: RoomConfig): number {
    const normalizedX = x / this.width;
    const noise = this.noise.getNormalized(x, y, 0.2);
    
    const xScoreMap = {
      front: normalizedX,
      back: 1 - normalizedX,
      center: 1 - Math.abs(0.5 - normalizedX),
      any: noise,
    };

    return xScoreMap[config.preferredX] + noise * 0.5;
  }

  private fillRoom(grid: Cell[][], center: { x: number; y: number }, config: RoomConfig): void {
    const size = config.minSize + Math.floor(
      this.noise.getNormalized(center.x, center.y, 0.5) * (config.maxSize - config.minSize)
    );
    const halfSize = Math.floor(size / 2);
    const room: Room = {
      id: this.nextRoomId++,
      type: config.type,
      name: config.name,
      cells: [],
    };

    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        const nx = center.x + dx;
        const ny = center.y + dy;
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;
        if (grid[ny][nx].type !== CellType.FLOOR) continue;
        
        grid[ny][nx] = { type: config.type, roomId: room.id };
        room.cells.push({ x: nx, y: ny });
      }
    }

    if (room.cells.length > 0) {
      this.rooms.push(room);
    }
  }

  private markCorridors(grid: Cell[][]): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (grid[y][x].type !== CellType.FLOOR) continue;
        grid[y][x] = { type: CellType.CORRIDOR };
      }
    }
  }
}
