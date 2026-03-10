import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './SelectDropdown.css';

function SelectDropdown({
  value = '',
  options = [],
  onChange,
  placeholder = '',
  ariaLabel = 'Select option',
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
    <div className='select-dropdown' ref={wrapRef}>
      <div className='select-dropdown-wrap'>
        <button
          type='button'
          className='select-dropdown-trigger'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-label={ariaLabel}
          onClick={() => setIsOpen((o) => !o)}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </button>
        {isOpen && (
          <ul
            className='select-dropdown-list'
            role='listbox'
            aria-label={ariaLabel}
          >
            <li role='option' aria-selected={!value}>
              <button
                type='button'
                className={`select-dropdown-option ${
                  !value ? 'select-dropdown-option--selected' : ''
                }`}
                onClick={() => handleSelect('')}
              >
                <span>{placeholder}</span>
                {!value && (
                  <Check
                    size={16}
                    strokeWidth={2}
                    className='select-dropdown-check'
                    aria-hidden
                  />
                )}
              </button>
            </li>
            {options.map((opt) => (
              <li key={opt} role='option' aria-selected={value === opt}>
                <button
                  type='button'
                  className={`select-dropdown-option ${
                    value === opt ? 'select-dropdown-option--selected' : ''
                  }`}
                  onClick={() => handleSelect(opt)}
                >
                  <span>{opt}</span>
                  {value === opt && (
                    <Check
                      size={16}
                      strokeWidth={2}
                      className='select-dropdown-check'
                      aria-hidden
                    />
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

export default SelectDropdown;
