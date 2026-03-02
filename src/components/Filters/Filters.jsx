import FiltersDropdown from './FiltersDropdown/FiltersDropdown';
import './Filters.css';

function Filters({
  rows = [],
  filters = {},
  onChange,
  applicationOptions = [],
}) {
  const applications =
    applicationOptions.length > 0
      ? applicationOptions
      : [...new Set(rows.map((r) => r.application).filter(Boolean))].sort();

  return (
    <FiltersDropdown
      filters={filters}
      onChange={onChange}
      applications={applications}
    />
  );
}

export default Filters;
