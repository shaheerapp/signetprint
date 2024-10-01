import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import "../css/customselector.css";

const CustomSelector = ({ label, options, handleSaveState, defaultOption, disabledOptions = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        if (!disabledOptions.includes(option)) {
            setSelectedOption(option);
            handleSaveState(option);
            setIsOpen(false);
        }
    };

    return (
        <>
            <label className="selector-label">{label}</label>
            <div className="custom-selector-container">
                <div className="selector-box" onClick={toggleDropdown}>
                    <div className="selector-text">{selectedOption}</div>
                    <div className="selector-arrow">&#9662;</div>
                </div>
                <CSSTransition
                    in={isOpen}
                    timeout={300}
                    classNames="dropdown"
                    unmountOnExit
                >
                    <div className="dropdown-list">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className={`dropdown-item ${disabledOptions.includes(option) ? 'disabled' : ''}`}
                                onClick={() => selectOption(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
            </div>
        </>
    );
};

export default CustomSelector;
