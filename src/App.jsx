import React from 'react';

const gridSize = 128;
const octagonSize = 80; // Increased from 20 to 80 (4x)
const overlap = 0.15; // Adjust this value to control the overlap

function App() {
  const octagons = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * (octagonSize * (1 - overlap));
      const y = row * (octagonSize * (1 - overlap));

      octagons.push({
        id: `${row}-${col}`,
        row,
        col,
        x,
        y,
      });
    }
  }

  return (
    <div style={{ position: 'relative', width: `${gridSize * octagonSize * (1 - overlap)}px`, height: `${gridSize * octagonSize * (1 - overlap)}px` }}>
      {octagons.map((octagon) => (
        <div
          key={octagon.id}
          style={{
            position: 'absolute',
            left: octagon.x,
            top: octagon.y,
            width: octagonSize,
            height: octagonSize,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            backgroundColor: 'lightgrey',
            border: '1px solid grey',
          }}
        />
      ))}
    </div>
  );
}

export default App;
