import React, { useState, useEffect, useRef } from 'react';

const gridSize = 128;
const octagonSize = 80;
const overlap = 0.15;
const scrollThreshold = 50; // Distance from the edge to start scrolling
const scrollSpeed = 20;

function App() {
  const [hoveredOctagon, setHoveredOctagon] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [aircraftCarrierPosition, setAircraftCarrierPosition] = useState({ row: 2, col: 60, orientation: 'horizontal' }); // { row: number, col: number, orientation: 'horizontal' | 'vertical' }
  const [isSelected, setIsSelected] = useState(false);

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

  const handleMouseEnter = (octagon, event) => {
    setHoveredOctagon(octagon);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredOctagon(null);
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Scroll horizontally
    if (clientX < scrollThreshold) {
      window.scrollBy({ left: -scrollSpeed, behavior: 'smooth' });
    } else if (clientX > windowWidth - scrollThreshold) {
      window.scrollBy({ left: scrollSpeed, behavior: 'smooth' });
    }

    // Scroll vertically
    if (clientY < scrollThreshold) {
      window.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
    } else if (clientY > windowHeight - scrollThreshold) {
      window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
    }
  };

  const handleOctagonClick = (octagon) => {
    if (aircraftCarrierPosition) {
      const { row, col } = aircraftCarrierPosition;
      const isCarrierOctagon = (octagon.row === row && (octagon.col === col || octagon.col === col + 1));
      if (isCarrierOctagon) {
        setIsSelected(!isSelected);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const renderAircraftCarrier = () => {
    if (!aircraftCarrierPosition) return null;

    const { row, col, orientation } = aircraftCarrierPosition;
    const firstOctagon = octagons.find((o) => o.row === row && o.col === col);

    if (!firstOctagon) return null;

    const secondOctagon = orientation === 'horizontal'
      ? octagons.find((o) => o.row === row && o.col === col + 1)
      : octagons.find((o) => o.row === row + 1 && o.col === col);

    if (!secondOctagon) return null;

    const carrierColor = isSelected ? 'rgba(0, 0, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)'; // Blue if selected, red otherwise

    return (
      <>
        <div
          style={{
            position: 'absolute',
            left: firstOctagon.x,
            top: firstOctagon.y,
            width: octagonSize,
            height: octagonSize,
            backgroundColor: carrierColor,
            zIndex: 10,
          }}
          onClick={() => handleOctagonClick(firstOctagon)}
        />
        <div
          style={{
            position: 'absolute',
            left: secondOctagon.x,
            top: secondOctagon.y,
            width: octagonSize,
            height: octagonSize,
            backgroundColor: carrierColor,
            zIndex: 10,
          }}
          onClick={() => handleOctagonClick(secondOctagon)}
        />
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: `${gridSize * octagonSize * (1 - overlap)}px`, height: `${gridSize * octagonSize * (1 - overlap)}px` }}
    >
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
          onMouseEnter={(event) => handleMouseEnter(octagon, event)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {renderAircraftCarrier()}
      {hoveredOctagon && (
        <div
          style={{
            position: 'fixed',
            top: mousePosition.y + 10,
            left: mousePosition.x + 10,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '5px',
            zIndex: 1000,
          }}
        >
          Row: {hoveredOctagon.row}, Col: {hoveredOctagon.col}
        </div>
      )}
    </div>
  );
}

export default App;
