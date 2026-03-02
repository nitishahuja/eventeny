import { useState, useEffect } from 'react';
import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Table from './components/Table/Table';
import Profile from './components/Profile/Profile';
import { getData, getApplicantProfile } from './api/mockApi';
import './App.css';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    application: '',
    status: [],
    payment: [],
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    getData(searchValue, filters).then((data) => {
      if (cancelled) return;
      setRows(data);
      setLoading(false);
      if (
        !filters.application &&
        filters.status.length === 0 &&
        filters.payment.length === 0
      ) {
        setApplicationOptions(
          [...new Set(data.map((r) => r.application).filter(Boolean))].sort(),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [searchValue, filters]);

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
