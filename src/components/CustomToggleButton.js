import React, { useState } from "react";
import "../css/CustomToggleButton.css";

const CustomToggleButton = ({ label, handleSaveState }) => {
    const [selected, setSelected] = useState(null);

    const handleSelection = (value) => {
        setSelected(value);
        if (label === 'Colour') {
            if (value === 'Yes') {
                handleSaveState('Color');
            } else if (value === 'No') {
                handleSaveState('B/W');
            }
        } else {
            if (value === 'Yes') {
                handleSaveState('Yes');
            } else if (value === 'No') {
                handleSaveState('No');
            }
        }

    };

    return (
        <div className="custom-toggle-button-container">
            <label className="toggle-label">{label}</label>
            <div className="button-group">
                <button
                    className={`toggle-button ${selected === "Yes" ? "selected" : ""}`}
                    onClick={() => handleSelection("Yes")}
                >
                    Yes
                </button>
                <button
                    className={`toggle-button ${selected === "No" ? "selected" : ""}`}
                    onClick={() => handleSelection("No")}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default CustomToggleButton;
