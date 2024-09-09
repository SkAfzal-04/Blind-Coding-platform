import React, { useState } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container">
      <div className="custom-select" onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || 'Select Language'}
      </div>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-select-option ${selectedValue === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {selectedValue === option.value && <span className="tick-mark">&#9989;</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
