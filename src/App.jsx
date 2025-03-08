import React from 'react';

const gridSize = 64;
const squareSize = 20;
const spacing = 1; // Adjust for desired spacing between squares

function App() {
  const grid = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * (squareSize + spacing);
      const y = row * (squareSize + spacing);

      grid.push({
        id: `${row}-${col}`,
        row,
        col,
        x,
        y,
      });
    }
  }

  return (
    <div style={{ position: 'relative', width: `${gridSize * (squareSize + spacing)}px`, height: `${gridSize * (squareSize + spacing)}px` }}>
      {grid.map((square) => (
        <div
          key={square.id}
          style={{
            position: 'absolute',
            left: square.x,
            top: square.y,
            width: squareSize,
            height: squareSize,
            backgroundColor: 'lightgrey',
            border: '1px solid grey',
          }}
        />
      ))}
    </div>
  );
}

export default App;
