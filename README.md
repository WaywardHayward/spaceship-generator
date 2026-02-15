# 🚀 Spaceship Generator

A procedural spaceship deck plan generator built with React + TypeScript. Uses layered Simplex noise for organic ship layouts - no AI, pure mathematics!

## Features

- **Procedural Hull Generation** - Organic ship shapes using layered noise algorithms
- **Room Placement** - Bridge, Engineering, Cargo Bay, Crew Quarters, Medbay, Airlock
- **Ship Name Generator** - Procedural names like "ISS Wandering Star" or "Freighter Crimson Dawn"
- **Grid-Based Output** - Perfect for tabletop RPG use
- **Seed-Based** - Same seed = same ship. Share seeds with friends!
- **Regenerate Button** - New ship, new adventure

## Tech Stack

- Vite + React + TypeScript
- simplex-noise for procedural generation
- CSS Grid for rendering

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How It Works

1. **NoiseGenerator** - Wraps simplex-noise with layered/octave noise support
2. **HullGenerator** - Creates ship hull using noise-distorted ellipse
3. **RoomGenerator** - Places rooms based on position preferences and noise
4. **NameGenerator** - Combines prefixes, adjectives, and nouns for ship names

## Code Quality

- DRY principles
- Single responsibility per file
- Guard clauses, no deep nesting
- Max 200 lines per file
- TypeScript strict mode

## License

MIT
