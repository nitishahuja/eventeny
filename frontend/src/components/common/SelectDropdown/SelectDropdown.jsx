import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import './SelectDropdown.css';

function SelectDropdown({
  value = '',
  options = [],
  onChange,
  placeholder = '',
  ariaLabel = 'Select option',
  className = '',
  triggerClassName = '',
  disabled = false,
  onOpenChange,
  usePortal = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      const wrapEl = wrapRef.current;
      const menuEl = menuRef.current;
      const target = e.target;

      const clickedInsideTrigger = wrapEl && wrapEl.contains(target);
      const clickedInsideMenu = menuEl && menuEl.contains(target);

      if (!clickedInsideTrigger && !clickedInsideMenu) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onOpenChange]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    onOpenChange?.(false);
  };

  useLayoutEffect(() => {
    if (!isOpen || !usePortal) return;
    const triggerEl =
      wrapRef.current?.querySelector('.select-dropdown-trigger') ??
      wrapRef.current;
    if (!triggerEl) return;
    if (!menuRef.current) return;

    const rect = triggerEl.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const top = rect.bottom + scrollY;
    const left = rect.left + scrollX;
    const width = rect.width;

    const style = menuRef.current.style;
    style.position = 'absolute';
    style.top = `${top}px`;
    style.left = `${left}px`;
    style.right = 'auto';
    style.width = `${width}px`;
    style.minWidth = `${width}px`;
    style.zIndex = '1000';
  }, [isOpen, usePortal]);

  return (
    <div className={`select-dropdown ${className}`} ref={wrapRef}>
      <div className='select-dropdown-wrap'>
        <button
          type='button'
          className={`select-dropdown-trigger ${triggerClassName}`}
          aria-expanded={disabled ? false : isOpen}
          aria-haspopup='listbox'
          aria-label={ariaLabel}
          onClick={
            disabled
              ? undefined
              : () => {
                  const next = !isOpen;
                  setIsOpen(next);
                  onOpenChange?.(next);
                }
          }
          disabled={disabled}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </button>
        {isOpen &&
          (() => {
            const list = (
              <ul
                className='select-dropdown-list'
                role='listbox'
                aria-label={ariaLabel}
                ref={menuRef}
              >
                {!!placeholder && (
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
                )}
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
            );

            if (usePortal && typeof document !== 'undefined') {
              return createPortal(list, document.body);
            }

            return list;
          })()}
      </div>
    </div>
  );
}

export default SelectDropdown;
