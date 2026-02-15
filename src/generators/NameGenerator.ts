import Alea from 'alea';

const PREFIXES = [
  'ISS', 'USS', 'HMS', 'SCS', 'TNS', 'Freighter', 'Cruiser', 'Scout', 'Hauler',
];

const ADJECTIVES = [
  'Wandering', 'Crimson', 'Silent', 'Burning', 'Frozen', 'Radiant', 'Shadow',
  'Golden', 'Iron', 'Stellar', 'Cosmic', 'Eternal', 'Swift', 'Valiant', 'Daring',
];

const NOUNS = [
  'Star', 'Dawn', 'Horizon', 'Phoenix', 'Eclipse', 'Voyager', 'Pioneer',
  'Serpent', 'Dragon', 'Falcon', 'Raven', 'Wolf', 'Bear', 'Spirit', 'Fortune',
];

const SUFFIXES = ['II', 'III', 'IV', 'V', 'Prime', 'Alpha', 'Omega', ''];

export class NameGenerator {
  private random: () => number;

  constructor(seed: number) {
    this.random = Alea(seed + 1000); // Offset to avoid same sequence as noise
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(this.random() * arr.length)];
  }

  generate(): string {
    const prefix = this.pick(PREFIXES);
    const adjective = this.pick(ADJECTIVES);
    const noun = this.pick(NOUNS);
    const suffix = this.pick(SUFFIXES);

    const name = `${prefix} ${adjective} ${noun}`;
    return suffix ? `${name} ${suffix}` : name;
  }
}
