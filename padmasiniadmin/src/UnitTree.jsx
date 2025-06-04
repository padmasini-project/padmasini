import React, { useState } from 'react';

const UnitTree = ({ units }) => {
  const [expandedUnits, setExpandedUnits] = useState({});

  const toggleExpand = (id) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
      {units.map((unit) => (
        <li key={unit.id}>
          <div
            onClick={() => toggleExpand(unit.id)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span style={{ fontWeight: 'bold' }}>{unit.unitName}</span>
            {unit.units && unit.units.length > 0 && (
              <span style={{ marginLeft: '10px', color: 'gray' }}>
                [{expandedUnits[unit.id] ? '-' : '+'}]
              </span>
            )}
          </div>

          {/* Recursively show sub-units */}
          {unit.units && unit.units.length > 0 && expandedUnits[unit.id] && (
            <UnitTree units={unit.units} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default UnitTree;
