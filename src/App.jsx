import { useState, useEffect, useMemo, useRef } from 'react';
import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Table from './components/Table/Table';
import Profile from './components/Profile/Profile';
import { getData, getApplicantProfile, applyFilters } from './api/mockApi';
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
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const profileCacheRef = useRef(new Map());

  useEffect(() => {
    let cancelled = false;
    getData().then((data) => {
      if (cancelled) return;
      setAllRows(data);
      setApplicationOptions(
        [...new Set(data.map((r) => r.application).filter(Boolean))].sort(),
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
            <main
              id='main-content'
              ref={mainRef}
              className='app-main'
              tabIndex={-1}
            >
              <Table
                key={`${searchValue}|${filters.application}|${filters.status.join(',')}|${filters.payment.join(',')}`}
                rows={rows}
                loading={loading}
                onViewApplicant={handleViewApplicant}
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
    </>
  );
}

export default App;
