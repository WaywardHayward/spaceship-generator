import type { Ship } from '../types';
import { NoiseGenerator } from './NoiseGenerator';
import { NameGenerator } from './NameGenerator';
import { HullGenerator } from './HullGenerator';
import { RoomGenerator } from './RoomGenerator';

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

    // Generate hull shape
    const hullGen = new HullGenerator(noise, this.width, this.height);
    const hullGrid = hullGen.generate();

    // Place rooms inside hull
    const roomGen = new RoomGenerator(noise, this.width, this.height);
    const { grid, rooms } = roomGen.generate(hullGrid);

    return {
      name: nameGen.generate(),
      width: this.width,
      height: this.height,
      grid,
      rooms,
      seed: this.seed,
    };
  }
}
