import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Table from './components/Table/Table';
import Profile from './components/Profile/Profile';
import Toast from './components/common/Toast/Toast';
import {
  getData,
  getApplicantProfile,
  applyFilters,
  bulkUpdateStatus,
} from './api/mockApi';
import './App.css';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    application: '',
    status: [],
    payment: [],
  });
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const profileCacheRef = useRef(new Map());
  const isMountedRef = useRef(true);
  const [toast, setToast] = useState(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getData();
      if (isMountedRef.current) {
        setAllRows(data);
        setApplicationOptions(
          [...new Set(data.map((r) => r.application).filter(Boolean))].sort(),
        );
      }
    } catch (err) {
      if (isMountedRef.current) {
        setAllRows([]);
        setApplicationOptions([]);
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load applications. Please try again.';
        setLoadError(message);
        setToast({
          message: `Unable to load applications. ${message}`,
          variant: 'error',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadApplications();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadApplications]);

  const rows = useMemo(
    () => applyFilters(allRows, searchValue, filters),
    [allRows, searchValue, filters],
  );

  const handleViewApplicant = async (row) => {
    const key = row.businessName;
    const cached = profileCacheRef.current.get(key);
    if (cached) {
      setSelectedApplicant(cached);
      return;
    }

    const { ok, row: profile } = await getApplicantProfile(key);
    const resolved = ok && profile ? profile : row;
    profileCacheRef.current.set(key, resolved);
    setSelectedApplicant(resolved);
  };

  const handleBackToList = () => setSelectedApplicant(null);
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, [selectedApplicant]);

  const handleBulkStatusChange = async (businessNames, status) => {
    if (!Array.isArray(businessNames) || !businessNames.length || !status) {
      return;
    }

    try {
      const result = await bulkUpdateStatus(businessNames, status);
      if (!result?.ok) {
        setToast({
          message:
            'Unable to update status for selected rows. Please try again.',
          variant: 'error',
        });
        return;
      }

      setAllRows((prev) =>
        prev.map((row) =>
          businessNames.includes(row.businessName)
            ? { ...row, currentStatus: status }
            : row,
        ),
      );

      setToast({
        message: `Status updated to "${status}" for ${businessNames.length} selected ${
          businessNames.length === 1 ? 'row' : 'rows'
        }.`,
        variant: 'success',
      });
    } catch {
      setToast({
        message: 'Unable to update status for selected rows. Please try again.',
        variant: 'error',
      });
    }
  };

  return (
    <>
      <a href='#main-content' className='skip-link'>
        Skip to main content
      </a>
      <div className='app'>
        <header className='app-header' aria-label='Eventeny'>
          <img
            src='/logo-page-header.svg'
            alt='Eventeny'
            className='app-header-logo'
          />
        </header>
        {!selectedApplicant ? (
          <>
            <main
              id='main-content'
              ref={mainRef}
              className='app-main'
              tabIndex={-1}
            >
              <header
                className='app-top'
                role='search'
                aria-label='Search and filter applications'
              >
                <Search value={searchValue} onChange={setSearchValue} />
                <Filters
                  filters={filters}
                  onChange={setFilters}
                  applications={applicationOptions}
                />
              </header>

              {loadError && !loading && (
                <div style={{ padding: '0.75rem' }}>
                  <button type='button' onClick={loadApplications}>
                    Retry
                  </button>
                </div>
              )}
              <Table
                key={`${searchValue}|${filters.application}|${filters.status.join(',')}|${filters.payment.join(',')}`}
                rows={rows}
                loading={loading}
                onViewApplicant={handleViewApplicant}
                onBulkStatusChange={handleBulkStatusChange}
              />
            </main>
          </>
        ) : (
          <main
            id='main-content'
            ref={mainRef}
            className='app-main'
            tabIndex={-1}
          >
            <Profile applicant={selectedApplicant} onBack={handleBackToList} />
          </main>
        )}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;
