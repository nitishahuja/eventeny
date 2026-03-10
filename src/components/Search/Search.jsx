import { useState, useRef, useCallback, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import './Search.css';

const PLACEHOLDER = 'Search by business, name, tag, etc';
const DEBOUNCE_MS = 300;

function Search({ value = '', onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const commitValue = useCallback(
    (next) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        if (onChange) onChange(next);
      }, DEBOUNCE_MS);
    },
    [onChange],
  );

  const handleChange = (e) => {
    const next = e.target.value;
    setLocalValue(next);
    commitValue(next);
  };

  const handleClear = () => {
    setLocalValue('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (onChange) onChange('');
    inputRef.current?.focus();
  };

  const inputRef = useRef(null);
  const hasValue = localValue.length > 0;

  return (
    <div className='search-wrapper'>
      <label htmlFor='search-input' className='search-label'>
        Search by business name, tag, or application
      </label>
      <div
        className={`search-inner ${hasValue ? 'has-value' : ''}`}
        role='group'
        aria-label='Search'
      >
        <span className='search-icon' aria-hidden='true'>
          <SearchIcon size={20} strokeWidth={2} />
        </span>
        <input
          ref={inputRef}
          id='search-input'
          type='text'
          className='search-input'
          value={localValue}
          onChange={handleChange}
          placeholder={PLACEHOLDER}
          autoComplete='off'
        />
        <button
          type='button'
          className='search-clear'
          onClick={handleClear}
          aria-label='Clear search'
          tabIndex={hasValue ? 0 : -1}
          aria-hidden={!hasValue}
        >
          <X size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default Search;
