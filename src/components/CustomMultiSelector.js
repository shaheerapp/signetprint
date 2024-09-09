import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import "../css/custommultiselector.css";

const CustomMultiSelector = ({ label, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        if (!selectedOptions.includes(option)) {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const removeOption = (optionToRemove) => {
        setSelectedOptions(
            selectedOptions.filter((option) => option !== optionToRemove)
        );
    };

    return (
        <>
            <p className="text-white font-bold font-25 mt-4">{label}</p>
            <div className="custom-multi--selector-container"
                style={{ borderRadius: !isOpen && '7px' }}>
                <div className="multi-selector-box" onClick={toggleDropdown}
                    style={{ borderRadius: !isOpen && '7px' }}
                >
                    <div className="multi-selector-text flex items-center flex-wrap">
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="multi-selected-option flex items-center justify-between text-black pr-2 pl-2 rounded-lg w-20 py-1 mr-2"
                                    style={{ backgroundColor: '#D9D9D9' }}
                                >
                                    <span className="mr-2 font-bold">{option}</span>
                                    <span
                                        className="cursor-pointer text-black font-bold"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeOption(option);
                                        }}
                                    >
                                        &#10005;
                                    </span>
                                </div>
                            ))
                        ) : null}
                    </div>
                    <div className="multi-selector-arrow">&#9662;</div>
                </div>
                <CSSTransition
                    in={isOpen}
                    timeout={300}
                    classNames="multi-dropdown"
                    unmountOnExit
                >
                    <div className="multi-dropdown-list">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="multi-dropdown-item"
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

export default CustomMultiSelector;
