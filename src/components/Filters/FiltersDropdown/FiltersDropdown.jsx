import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import SelectDropdown from '../../common/SelectDropdown/SelectDropdown';
import useIsMobile from '../../../hooks/useIsMobile';

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

function FiltersDropdown({ filters = {}, onChange, applications = [] }) {
  const { application = '', status = [], payment = [] } = filters;

  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  const panel = (
    <div
      ref={panelRef}
      id='filters-panel'
      className={`filters-panel${
        isMobile ? ' filters-panel--bottom-sheet' : ''
      }`}
      role='dialog'
      aria-label='Filter options'
    >
      <div className='filters-panel-inner'>
        <SelectDropdown
          value={application}
          options={applications}
          onChange={handleApplicationSelect}
          placeholder='All applications'
          ariaLabel='Application'
        />
        <div className='filters-field'>
          <h3
            id='filters-status-heading'
            className='filters-section-title'
          >
            Status
          </h3>
          <div
            className='filters-checkbox-grid'
            role='group'
            aria-labelledby='filters-status-heading'
          >
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
          <h3
            id='filters-payment-heading'
            className='filters-section-title'
          >
            Payment status
          </h3>
          <div
            className='filters-checkbox-grid'
            role='group'
            aria-labelledby='filters-payment-heading'
          >
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
  );

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
        (isMobile
          ? createPortal(
              <>
                <div className='filters-backdrop' aria-hidden onClick={close} />
                {panel}
              </>,
              document.body,
            )
          : panel)}
    </div>
  );
}

export default FiltersDropdown;
