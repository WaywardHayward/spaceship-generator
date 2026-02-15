import type { Cell } from '../types';
import { CellType } from '../types';
import { NoiseGenerator } from './NoiseGenerator';

export class HullGenerator {
  private noise: NoiseGenerator;
  private width: number;
  private height: number;

  constructor(noise: NoiseGenerator, width: number, height: number) {
    this.noise = noise;
    this.width = width;
    this.height = height;
  }

  generate(): Cell[][] {
    const grid: Cell[][] = [];

    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y][x] = this.generateCell(x, y);
      }
    }

    return this.addWalls(grid);
  }

  private generateCell(x: number, y: number): Cell {
    if (!this.isInsideHull(x, y)) {
      return { type: CellType.EMPTY };
    }
    return { type: CellType.FLOOR };
  }

  private isInsideHull(x: number, y: number): boolean {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Normalize coordinates to -1..1 range
    const nx = (x - centerX) / (this.width / 2);
    const ny = (y - centerY) / (this.height / 2);

    // Base ellipse shape - elongated horizontally for ship-like appearance
    const ellipseValue = (nx * nx) / 1.0 + (ny * ny) / 0.25;

    // Add noise for organic variation
    const noiseValue = this.noise.getLayered(x, y, 3, 0.5, 0.1) * 0.3;

    // Sharpen the front of the ship
    const frontTaper = x > centerX ? Math.pow(nx, 2) * 0.3 : 0;

    return ellipseValue + noiseValue + frontTaper < 0.8;
  }

  private addWalls(grid: Cell[][]): Cell[][] {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (grid[y][x].type !== CellType.FLOOR) continue;
        if (!this.hasEmptyNeighbor(grid, x, y)) continue;
        grid[y][x] = { type: CellType.HULL };
      }
    }
    return grid;
  }

  private hasEmptyNeighbor(grid: Cell[][], x: number, y: number): boolean {
    const neighbors = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    ];

    return neighbors.some(([nx, ny]) => {
      if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) return true;
      return grid[ny][nx].type === CellType.EMPTY;
    });
  }
}
