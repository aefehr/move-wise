import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

/**
 * Renders the Company Directory page.
 * @returns {JSX.Element} The Company Directory page component.
 */
function CompanyDirectoryPage() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState({ sector: '', city: '', state: '' });
  const [states, setStates] = useState([]);
  const [sectors, setSectors] = useState([]);

  /**
   * Handles the input change event.
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Cleans the input by removing special characters.
   * @param {string} input - The input string to clean.
   * @returns {string} The cleaned input string.
   */
  const cleanInput = (input) => {
    return input.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  };

  /**
   * Handles the search button click event.
   */
  const handleSearch = () => {
    fetch(`http://localhost:8000/api/companies/fortune_1000_companies?sector=${encodeURIComponent(filter.sector)}&city=${encodeURIComponent(cleanInput(filter.city.toLowerCase()))}&state=${encodeURIComponent(filter.state)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.error('Unexpected API response:', data);
          alert('No Matching Companies!');
        }
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
        alert('No Matching Companies!')
      });
  };
  // Fetch states and sectors data from API
  useEffect(() => {
    fetch("http://localhost:8000/api/cities/all_states")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setStates(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching states:', error);
        alert('Error fetching states');
      });

    fetch("http://localhost:8000/api/companies/fortune_1000_sectors")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setSectors(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching sectors:', error);
        alert('Error fetching sectors');
      });
  }, []);

  return (
    <Box className="companyDirectoryPage" sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1>Company Directory</h1>
      <div className="filters">
        <label htmlFor="sector">Sector:</label>
        <select name="sector" onChange={handleInputChange} value={filter.sector}>
          <option value="">Select Sector</option>
          {sectors.length > 0 && sectors.map((sector) => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <label htmlFor="city">City:</label>
        <input type="text" id="city" name="city" value={filter.city} onChange={handleInputChange} />

        <label htmlFor="state">State:</label>
        <select name="state" onChange={handleInputChange} value={filter.state}>
          <option value="">Select State</option>
          {states.length > 0 && states.map((state) => (
            <option key={state.state} value={state.state}>{state.state}</option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      <ul style={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {companies.length > 0 ? (
          companies.map((company, index) => (
            <li key={index}>
              <a href={`/companies/${company.company_name}`}>{company.company_name}</a>
            </li>
          ))
        ) : (
          <li>No matching companies found.</li>
        )}
      </ul>
    </Box>
  );
}

export default CompanyDirectoryPage;