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
  const [aircraftCarrierPosition, setAircraftCarrierPosition] = useState({
    row: 2,
    col: 60,
    orientation: 'horizontal',
    size: 6, // Number of octagons the carrier occupies
    planes: [
      { id: 1, skill: 70, health: 100, hasTorpedo: false },
      { id: 2, skill: 80, health: 100, hasTorpedo: true },
      { id: 3, skill: 60, health: 100, hasTorpedo: false },
      { id: 4, skill: 90, health: 100, hasTorpedo: true },
    ],
  });
  const [aircraftCarrier2Position, setAircraftCarrier2Position] = useState({
    row: 6,
    col: 60,
    orientation: 'horizontal',
    size: 6, // Number of octagons the carrier occupies
    planes: [
      { id: 5, skill: 75, health: 100, hasTorpedo: true },
      { id: 6, skill: 85, health: 100, hasTorpedo: false },
      { id: 7, skill: 65, health: 100, hasTorpedo: true },
      { id: 8, skill: 95, health: 100, hasTorpedo: false },
    ],
  });
  const [selectedCarrier, setSelectedCarrier] = useState(null); // null, 1, or 2
  const [tooltipContent, setTooltipContent] = useState(null);
  const [hoveredPlane, setHoveredPlane] = useState(null);
  const [selectedPlane, setSelectedPlane] = useState(null); // { carrier: 1|2, planeIndex: number }

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

    let carrier = null;
    if (aircraftCarrierPosition) {
      const { row, col, size, planes } = aircraftCarrierPosition;
      let isCarrierOctagon = false;
      let planeIndex = -1;

      for (let i = 0; i < size; i++) {
        if (octagon.row === row && octagon.col === col + i) {
          isCarrierOctagon = true;
          if (i > 0 && i < size - 1) {
            planeIndex = i - 1; // Map octagon index to plane index
          }
          break;
        }
      }

      if (isCarrierOctagon) {
        carrier = 1;
        if (planeIndex !== -1 && planes[planeIndex]) {
          setTooltipContent({
            type: 'Plane',
            ...planes[planeIndex],
          });
        } else {
          setTooltipContent({
            type: 'Aircraft Carrier',
            aircraft: planes.length,
            torpedoes: planes.filter((plane) => plane.hasTorpedo).length,
            health: 100,
            planes: planes,
          });
        }
      }
    }

    if (aircraftCarrier2Position) {
      const { row, col, size, planes } = aircraftCarrier2Position;
      let isCarrier2Octagon = false;
      let planeIndex = -1;

      for (let i = 0; i < size; i++) {
        if (octagon.row === row && octagon.col === col + i) {
          isCarrier2Octagon = true;
          if (i > 0 && i < size - 1) {
            planeIndex = i - 1; // Map octagon index to plane index
          }
          break;
        }
      }

      if (isCarrier2Octagon) {
        carrier = 2;
        if (planeIndex !== -1 && planes[planeIndex]) {
          setTooltipContent({
            type: 'Plane',
            ...planes[planeIndex],
          });
        } else {
          setTooltipContent({
            type: 'Aircraft Carrier 2',
            aircraft: planes.length,
            torpedoes: planes.filter((plane) => plane.hasTorpedo).length,
            health: 100,
            planes: planes,
          });
        }
      }
    }

    if (!aircraftCarrierPosition && !aircraftCarrier2Position) {
      setTooltipContent({
        type: 'Octagon',
        row: octagon.row,
        col: octagon.col,
      });
    } else if (!tooltipContent) {
      setTooltipContent({
        type: 'Octagon',
        row: octagon.row,
        col: octagon.col,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredOctagon(null);
    setTooltipContent(null);
    setHoveredPlane(null);
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
    let carrierClicked = null;

    if (aircraftCarrierPosition) {
      const { row, col, size, planes } = aircraftCarrierPosition;
      let isCarrierOctagon = false;
      let planeIndex = -1;

      for (let i = 0; i < size; i++) {
        if (octagon.row === row && octagon.col === col + i) {
          isCarrierOctagon = true;
          if (i > 0 && i < size - 1) {
            planeIndex = i - 1;
          }
          break;
        }
      }

      if (isCarrierOctagon) {
        carrierClicked = 1;
        if (planeIndex !== -1 && selectedCarrier === 1) {
          // Select the plane
          setSelectedPlane({ carrier: 1, planeIndex: planeIndex });
          return;
        } else {
          setSelectedPlane(null);
        }
      }
    }

    if (aircraftCarrier2Position) {
      const { row, col, size, planes } = aircraftCarrier2Position;
      let isCarrier2Octagon = false;
      let planeIndex = -1;

      for (let i = 0; i < size; i++) {
        if (octagon.row === row && octagon.col === col + i) {
          isCarrier2Octagon = true;
          if (i > 0 && i < size - 1) {
            planeIndex = i - 1;
          }
          break;
        }
      }

      if (isCarrier2Octagon) {
        carrierClicked = 2;
        if (planeIndex !== -1 && selectedCarrier === 2) {
          // Select the plane
          setSelectedPlane({ carrier: 2, planeIndex: planeIndex });
          return;
        } else {
          setSelectedPlane(null);
        }
      }
    }

    // If no plane was selected, handle carrier selection
    if (carrierClicked) {
      setSelectedCarrier(selectedCarrier === carrierClicked ? null : carrierClicked);
    } else {
      setSelectedCarrier(null);
      setSelectedPlane(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLoadTorpedo = () => {
    if (selectedPlane) {
      // Implement load torpedo logic here
      console.log(`Loading torpedo for plane ${selectedPlane.planeIndex} on carrier ${selectedPlane.carrier}`);
    }
  };

  const handleLaunchPlane = () => {
    if (selectedPlane) {
      // Implement launch plane logic here
      console.log(`Launching plane ${selectedPlane.planeIndex} on carrier ${selectedPlane.carrier}`);
    }
  };

  const handleRepairPlane = () => {
    if (selectedPlane) {
      // Implement repair plane logic here
      console.log(`Repairing plane ${selectedPlane.planeIndex} on carrier ${selectedPlane.carrier}`);
    }
  };

  const renderAircraftCarrier = () => {
    if (!aircraftCarrierPosition) return null;

    const { row, col, orientation, size, planes } = aircraftCarrierPosition;
    const isSelected = selectedCarrier === 1;
    const carrierColor = isSelected ? 'rgba(0, 0, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)'; // Blue if selected, red otherwise
    const carrierStyle = {
      position: 'absolute',
      width: octagonSize,
      height: octagonSize,
      backgroundColor: carrierColor,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: 'white',
    };

    const carrierOctagons = [];
    for (let i = 0; i < size; i++) {
      const currentOctagon = octagons.find((o) => o.row === row && o.col === col + i);
      if (currentOctagon) {
        let content = null;
        let planeIndex = i - 1;
        const isPlaneSelected =
          selectedCarrier === 1 && selectedPlane && selectedPlane.carrier === 1 && selectedPlane.planeIndex === planeIndex;
        const planeColor = isPlaneSelected ? 'rgba(0, 255, 0, 0.5)' : null; // Green if selected

        if (i === 0) {
          content = <div style={{ position: 'absolute' }}>B</div>; // Bow
        } else if (i > 0 && i < size - 1) {
          // Render plane indicators
          content = <div style={{ position: 'absolute' }}>P</div>;
        } else if (i === size - 1) {
          content = <div style={{ position: 'absolute' }}>S</div>; // Stern
        }

        carrierOctagons.push(
          <div
            key={`carrier1-${i}`}
            style={{
              ...carrierStyle,
              left: currentOctagon.x,
              top: currentOctagon.y,
              backgroundColor: planeColor || carrierStyle.backgroundColor,
            }}
            onMouseEnter={(event) => handleMouseEnter(currentOctagon, event)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleOctagonClick(currentOctagon)}
          >
            {content}
          </div>
        );
      }
    }

    return <>{carrierOctagons}</>;
  };

  const renderAircraftCarrier2 = () => {
    if (!aircraftCarrier2Position) return null;

    const { row, col, orientation, size, planes } = aircraftCarrier2Position;
    const isSelected = selectedCarrier === 2;
    const carrierColor = isSelected ? 'rgba(0, 0, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)'; // Blue if selected, red otherwise
    const carrierStyle = {
      position: 'absolute',
      width: octagonSize,
      height: octagonSize,
      backgroundColor: carrierColor,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: 'white',
    };

    const carrierOctagons = [];
    for (let i = 0; i < size; i++) {
      const currentOctagon = octagons.find((o) => o.row === row && o.col === col + i);
      if (currentOctagon) {
        let content = null;
        let planeIndex = i - 1;
        const isPlaneSelected =
          selectedCarrier === 2 && selectedPlane && selectedPlane.carrier === 2 && selectedPlane.planeIndex === planeIndex;
        const planeColor = isPlaneSelected ? 'rgba(0, 255, 0, 0.5)' : null; // Green if selected

        if (i === 0) {
          content = <div style={{ position: 'absolute' }}>B</div>; // Bow
        } else if (i > 0 && i < size - 1) {
          // Render plane indicators
          content = <div style={{ position: 'absolute' }}>P</div>;
        } else if (i === size - 1) {
          content = <div style={{ position: 'absolute' }}>S</div>; // Stern
        }

        carrierOctagons.push(
          <div
            key={`carrier2-${i}`}
            style={{
              ...carrierStyle,
              left: currentOctagon.x,
              top: currentOctagon.y,
              backgroundColor: planeColor || carrierStyle.backgroundColor,
            }}
            onMouseEnter={(event) => handleMouseEnter(currentOctagon, event)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleOctagonClick(currentOctagon)}
          >
            {content}
          </div>
        );
      }
    }

    return <>{carrierOctagons}</>;
  };

  const renderTooltip = () => {
    if (!tooltipContent) return null;

    if (tooltipContent.type === 'Plane') {
      return (
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
          <div>Type: Plane</div>
          <div>Skill: {tooltipContent.skill}</div>
          <div>Health: {tooltipContent.health}%</div>
          <div>Torpedo: {tooltipContent.hasTorpedo ? 'Yes' : 'No'}</div>
        </div>
      );
    }

    return (
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
        {tooltipContent.type === 'Aircraft Carrier' || tooltipContent.type === 'Aircraft Carrier 2' ? (
          <div>
            <div>Type: {tooltipContent.type}</div>
            <div>Aircraft: {tooltipContent.aircraft}</div>
            <div>Torpedoes: {tooltipContent.torpedoes}</div>
            <div>Health: {tooltipContent.health}%</div>
            <div>
              Planes:
              <ul>
                {tooltipContent.planes.map((plane) => (
                  <li key={plane.id}>
                    Plane {plane.id}: Skill: {plane.skill}, Health: {plane.health}%, Torpedo:{' '}
                    {plane.hasTorpedo ? 'Yes' : 'No'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            Row: {tooltipContent.row}, Col: {tooltipContent.col}
          </div>
        )}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (!selectedPlane) return null;

    const carrier = selectedPlane.carrier;
    const planeIndex = selectedPlane.planeIndex;
    const plane = carrier === 1 ? aircraftCarrierPosition.planes[planeIndex] : aircraftCarrier2Position.planes[planeIndex];

    return (
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
        <button onClick={handleLoadTorpedo}>Load Torpedo</button>
        <button onClick={handleLaunchPlane}>Launch Plane</button>
        {plane.health < 100 && <button onClick={handleRepairPlane}>Repair</button>}
      </div>
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
            zIndex: 1, // Ensure octagons are below the carrier and tooltip
          }}
          onMouseEnter={(event) => handleMouseEnter(octagon, event)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {renderAircraftCarrier()}
      {renderAircraftCarrier2()}
      {renderTooltip()}
      {renderActionButtons()}
    </div>
  );
}

export default App;
