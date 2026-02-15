import { useState, useCallback } from 'react';
import type { Ship } from './types';
import { ShipGenerator } from './generators';
import { ShipDisplay } from './components';

function generateShip(): Ship {
  // Taller than wide for vertical orientation (bow at top)
  const generator = new ShipGenerator(undefined, 40, 60);
  return generator.generate();
}

export default function App() {
  const [ship, setShip] = useState<Ship>(() => generateShip());

  const handleRegenerate = useCallback(() => {
    setShip(generateShip());
  }, []);

  return <ShipDisplay ship={ship} onRegenerate={handleRegenerate} />;
}
