import { createNoise2D } from 'simplex-noise';
import type { NoiseFunction2D } from 'simplex-noise';
import Alea from 'alea';

export class NoiseGenerator {
  private noise2D: NoiseFunction2D;
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
    const prng = Alea(seed);
    this.noise2D = createNoise2D(prng);
  }

  getSeed(): number {
    return this.seed;
  }

  /**
   * Get raw noise value at coordinates (-1 to 1)
   */
  getValue(x: number, y: number, scale: number = 1): number {
    return this.noise2D(x * scale, y * scale);
  }

  /**
   * Get normalized noise value (0 to 1)
   */
  getNormalized(x: number, y: number, scale: number = 1): number {
    return (this.getValue(x, y, scale) + 1) / 2;
  }

  /**
   * Get layered noise (fractal/octave noise) for more organic shapes
   */
  getLayered(
    x: number,
    y: number,
    octaves: number = 4,
    persistence: number = 0.5,
    scale: number = 1
  ): number {
    let total = 0;
    let frequency = scale;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.getValue(x, y, frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return (total / maxValue + 1) / 2;
  }

  /**
   * Get threshold value - useful for hull shape generation
   */
  isAboveThreshold(
    x: number,
    y: number,
    threshold: number,
    scale: number = 1
  ): boolean {
    return this.getNormalized(x, y, scale) > threshold;
  }
}
