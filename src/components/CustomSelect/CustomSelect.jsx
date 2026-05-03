import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";
import { FiChevronDown } from "react-icons/fi";

function CustomSelect({ options, value, onChange, disabled = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTriggerClick = () => {
        if (!disabled) {
            setOpen(!open);
        }
    };

    const handleOptionClick = (option) => {
        if (!disabled) {
            onChange(option);
            setOpen(false);
        }
    };

    return (
        <div className={`custom-select ${disabled ? "disabled" : ""}`} ref={ref}>
            <button
                className="select-trigger"
                onClick={handleTriggerClick}
                disabled={disabled}
            >
                {value.label}
                <FiChevronDown
                    className={`select-arrow ${open ? "open" : ""}`}
                />
            </button>

            {open && !disabled && (
                <div className="select-dropdown">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`select-option ${
                                option.value === value.value ? "active" : ""
                            }`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;