import { useState, useEffect, useMemo } from 'react';
import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Table from './components/Table/Table';
import Profile from './components/Profile/Profile';
import { getData, getApplicantProfile } from './api/mockApi';
import './App.css';

function filterRows(allRows, searchValue, filters) {
  let rows = [...allRows];

  const search = (searchValue || '').trim().toLowerCase();
  if (search) {
    rows = rows.filter(
      (row) =>
        row.businessName.toLowerCase().includes(search) ||
        row.application.toLowerCase().includes(search) ||
        row.tag.some((t) => t.toLowerCase().includes(search)),
    );
  }

  if (filters.application) {
    rows = rows.filter((row) => row.application === filters.application);
  }

  if (filters.status && filters.status.length > 0) {
    const set = new Set(filters.status);
    rows = rows.filter((row) => set.has(row.currentStatus));
  }

  if (filters.payment && filters.payment.length > 0) {
    const set = new Set(filters.payment);
    rows = rows.filter((row) => set.has(row.payment));
  }

  return rows;
}

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

  useEffect(() => {
    let cancelled = false;
    getData('', {}).then((data) => {
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
    () => filterRows(allRows, searchValue, filters),
    [allRows, searchValue, filters],
  );

  const handleViewApplicant = async (row) => {
    const { ok, row: profile } = await getApplicantProfile(row.businessName);
    setSelectedApplicant(ok && profile ? profile : row);
    queueMicrotask(() => {
      const el = document.querySelector('.profile-name');
      if (el && typeof el.focus === 'function') el.focus();
    });
  };

  const handleBackToList = () => setSelectedApplicant(null);

  // Read-only profile — no status update actions

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
                rows={rows}
                filters={filters}
                onChange={setFilters}
                applicationOptions={applicationOptions}
              />
            </header>
            <main id='main-content' className='app-main' tabIndex={-1}>
              <Table
                rows={rows}
                loading={loading}
                onViewApplicant={handleViewApplicant}
              />
            </main>
          </>
        ) : (
          <main id='main-content' className='app-main' tabIndex={-1}>
            <Profile applicant={selectedApplicant} onBack={handleBackToList} />
          </main>
        )}
      </div>
    </>
  );
}

export default App;
