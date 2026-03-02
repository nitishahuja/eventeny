import { useState, useEffect } from 'react';
import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Table from './components/Table/Table';
import { getData } from './api/mockApi';
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

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    getData(searchValue, filters).then((data) => {
      if (cancelled) return;
      setRows(data);
      setLoading(false);
      console.log('Mock API data:', data);
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

  return (
    <>
      <a href='#main-content' className='skip-link'>
        Skip to main content
      </a>
      <div className='app' role='document'>
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
          <Table rows={rows} loading={loading} />
        </main>
      </div>
    </>
  );
}

export default App;
