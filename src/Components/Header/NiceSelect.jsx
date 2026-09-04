import React, { useState, useRef, useEffect } from "react";

const NiceSelect = ({ options, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue || options[0].label);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nice-select-wrapper">
      <div className={`nice-select ${isOpen ? "open" : ""}`} ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
        <span className="current">{selected}</span>
        <ul className="list">
          {options.map((option, index) => (
            <li key={index} className="option" onClick={() => { setSelected(option.label); setIsOpen(false); }}>
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NiceSelect;
