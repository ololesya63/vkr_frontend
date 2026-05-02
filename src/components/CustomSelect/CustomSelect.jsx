import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";
import { FiChevronDown } from "react-icons/fi";

function CustomSelect({ options, value, onChange }) {
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

    return (
        <div className="custom-select" ref={ref}>
            <button
                className="select-trigger"
                onClick={() => setOpen(!open)}
            >
                {value.label}

                <FiChevronDown
                    className={`select-arrow ${open ? "open" : ""}`}
                />
            </button>

            {open && (
                <div className="select-dropdown">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`select-option ${
                                option.value === value.value ? "active" : ""
                            }`}
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
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