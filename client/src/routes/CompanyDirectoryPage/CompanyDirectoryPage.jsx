import { useEffect, useState } from 'react';
import { Tab, Tabs, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function CompanyDirectoryPage() {
    const [companies, setCompanies] = useState([]);
    const [filter, setFilter] = useState({ sector: '', city: '', state: '' });
    const [topCities, setTopCities] = useState([]);
    const [mostImprovedCompanies, setMostImprovedCompanies] = useState([]);
    const [mostImprovedSectors, setMostImprovedSectors] = useState([]);
    const [states, setStates] = useState([]);
    const [sectors, setSectors] = useState([]);

    
    
    const [tabValue, setTabValue] = useState('companies');

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/companies/fortune_1000_companies?sector=" + filter.sector + "&city=" + filter.city + "&state=" + filter.state)
        .then((res) => res.json())
        .then((data) => {
            if (data && Array.isArray(data)) {
            setCompanies(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching companies:', error);
            alert('An error occurred while fetching companies. Redirecting to another page.' + error);
        });

        fetch("http://localhost:8000/api/cities/all_states")
        .then((res) => res.json())
        .then((data) => {
            if (data && Array.isArray(data)) {
                setStates(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching states:', error);
            alert('An error occurred while fetching states. Redirecting to another page.');
            window.location.href = '/';
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
            alert('An error occurred while fetching sectors. Redirecting to another page.');
            window.location.href = '/';
        });
    }, [filter]);

    return (
        <Box className="companyDirectoryPage" sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1>Company Directory</h1>
            <div className="filters">
                <label htmlFor="sector">Sector:</label>
                <select name="state" onChange={handleInputChange} value={filter.sector}>
                    <option value="">Select Sector</option>
                    {sectors.length > 0 && sectors.map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                    ))}
                </select>

                <label htmlFor="city">City:</label>
                <input type="text" id="city" value={filter.city} onChange={(e) => setFilter({ ...filter, city: e.target.value })} />

                <label htmlFor="state">State:</label>
                <select name="state" onChange={handleInputChange} value={filter.state}>
                    <option value="">Select State</option>
                    {states.length > 0 && states.map((state) => (
                        <option key={state.state} value={state.state}>{state.state}</option>
                    ))}
                </select>
            </div>

            <ul style={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {companies.map((company, index) => (
                    <li key={index}>
                        <a href={`/companies/${company.company_name}`}>{company.company_name}</a>
                    </li>
                ))}
            </ul>
        </Box>
    );
}

export default CompanyDirectoryPage;