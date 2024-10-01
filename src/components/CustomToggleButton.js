import React, { useEffect, useState } from "react";
import "../css/CustomToggleButton.css";

const CustomToggleButton = ({ label, handleSaveState, defaultSelection = 'No', disableYes = false }) => {
    const [selected, setSelected] = useState(defaultSelection);

    useEffect(() => {
        if (label === 'Colour') {
            handleSaveState(selected === 'Yes' ? 'Color' : 'B/W');
        }
    }, [])

    const handleSelection = (value) => {
        if (value === 'Yes' && disableYes) return;
        setSelected(value);
        if (label === 'Colour') {
            handleSaveState(value === 'Yes' ? 'Color' : 'B/W');
        } else {
            handleSaveState(value === 'Yes' ? 'Yes' : 'No');
        }
    };

    return (
        <div className="custom-toggle-button-container">
            <label className="toggle-label">{label}</label>
            <div className="button-group">
                <button
                    className={`toggle-button ${selected === "Yes" ? "selected" : ""} ${disableYes ? "disabled" : ""}`}
                    onClick={() => handleSelection("Yes")}
                    disabled={disableYes}
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
