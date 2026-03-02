import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './FiltersDropdown.css';

function FiltersDropdown({
  value = '',
  options = [],
  onChange,
  placeholder = 'All applications',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="filters-dropdown" ref={wrapRef}>
      <div className="filters-dropdown-wrap">
        <button
          type="button"
          className="filters-dropdown-trigger"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Application"
          onClick={() => setIsOpen((o) => !o)}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </button>
        {isOpen && (
          <ul
            className="filters-dropdown-list"
            role="listbox"
            aria-label="Application"
          >
            <li role="option" aria-selected={!value}>
              <button
                type="button"
                className={`filters-dropdown-option ${!value ? 'filters-dropdown-option--selected' : ''}`}
                onClick={() => handleSelect('')}
              >
                <span>{placeholder}</span>
                {!value && (
                  <Check size={16} strokeWidth={2} className="filters-dropdown-check" aria-hidden />
                )}
              </button>
            </li>
            {options.map((opt) => (
              <li key={opt} role="option" aria-selected={value === opt}>
                <button
                  type="button"
                  className={`filters-dropdown-option ${value === opt ? 'filters-dropdown-option--selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  <span>{opt}</span>
                  {value === opt && (
                    <Check size={16} strokeWidth={2} className="filters-dropdown-check" aria-hidden />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FiltersDropdown;
