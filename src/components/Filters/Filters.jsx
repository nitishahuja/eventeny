import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import FiltersDropdown from './FiltersDropdown/FiltersDropdown';
import './Filters.css';

const MOBILE_BREAKPOINT = 767;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const STATUS_OPTIONS = [
  'Approved',
  'Waitlisted',
  'Withdrawn',
  'Awaiting decision',
  'Rejected',
];

const PAYMENT_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'Not Paid', label: 'Not paid' },
];

function Filters({
  rows = [],
  filters = {},
  onChange,
  applicationOptions = [],
}) {
  const { application = '', status = [], payment = [] } = filters;
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const applications =
    applicationOptions.length > 0
      ? applicationOptions
      : [...new Set(rows.map((r) => r.application).filter(Boolean))].sort();

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        close();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isMobile]);

  const handleApplicationSelect = (value) => {
    onChange({ ...filters, application: value });
  };

  const handleStatusChange = (option) => {
    const next = status.includes(option)
      ? status.filter((s) => s !== option)
      : [...status, option];
    onChange({ ...filters, status: next });
  };

  const handlePaymentChange = (value) => {
    const next = payment.includes(value)
      ? payment.filter((p) => p !== value)
      : [...payment, value];
    onChange({ ...filters, payment: next });
  };

  return (
    <div className={`filters-wrapper${isOpen ? ' filters-wrapper--open' : ''}`}>
      <button
        ref={triggerRef}
        type='button'
        className='filters-trigger'
        aria-label='Filter results'
        aria-expanded={isOpen}
        aria-haspopup='true'
        aria-controls='filters-panel'
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className='filters-icon' aria-hidden>
          <SlidersHorizontal size={20} strokeWidth={2} />
        </span>
        <span className='filters-label'>Filter</span>
        <span className='filters-chevron' aria-hidden>
          <ChevronDown size={18} strokeWidth={2} />
        </span>
      </button>

      {isOpen &&
        (isMobile ? (
          createPortal(
            <>
              <div className='filters-backdrop' aria-hidden onClick={close} />
              <div
                ref={panelRef}
                id='filters-panel'
                className='filters-panel filters-panel--bottom-sheet'
                role='dialog'
                aria-label='Filter options'
              >
                <div className='filters-panel-inner'>
                  <FiltersDropdown
                    value={application}
                    options={applications}
                    onChange={handleApplicationSelect}
                    placeholder='All applications'
                  />
                  <div className='filters-field'>
                    <h3 className='filters-section-title'>Status</h3>
                    <div className='filters-checkbox-grid'>
                      {STATUS_OPTIONS.map((option) => (
                        <label key={option} className='filters-checkbox-label'>
                          <input
                            type='checkbox'
                            checked={status.includes(option)}
                            onChange={() => handleStatusChange(option)}
                            className='filters-checkbox'
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className='filters-field'>
                    <h3 className='filters-section-title'>Payment status</h3>
                    <div className='filters-checkbox-grid'>
                      {PAYMENT_OPTIONS.map(({ value, label }) => (
                        <label key={value} className='filters-checkbox-label'>
                          <input
                            type='checkbox'
                            checked={payment.includes(value)}
                            onChange={() => handlePaymentChange(value)}
                            className='filters-checkbox'
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>,
            document.body,
          )
        ) : (
          <div
            ref={panelRef}
            id='filters-panel'
            className='filters-panel'
            role='dialog'
            aria-label='Filter options'
          >
            <div className='filters-panel-inner'>
              <FiltersDropdown
                value={application}
                options={applications}
                onChange={handleApplicationSelect}
                placeholder='All applications'
              />

              {/* Status */}
              <div className='filters-field'>
                <h3 className='filters-section-title'>Status</h3>
                <div className='filters-checkbox-grid'>
                  {STATUS_OPTIONS.map((option) => (
                    <label key={option} className='filters-checkbox-label'>
                      <input
                        type='checkbox'
                        checked={status.includes(option)}
                        onChange={() => handleStatusChange(option)}
                        className='filters-checkbox'
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment status */}
              <div className='filters-field'>
                <h3 className='filters-section-title'>Payment status</h3>
                <div className='filters-checkbox-grid'>
                  {PAYMENT_OPTIONS.map(({ value, label }) => (
                    <label key={value} className='filters-checkbox-label'>
                      <input
                        type='checkbox'
                        checked={payment.includes(value)}
                        onChange={() => handlePaymentChange(value)}
                        className='filters-checkbox'
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Filters;
