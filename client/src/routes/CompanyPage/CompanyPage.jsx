import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CompanyPage.scss'; 
import { Box } from '@mui/material';

/**
 * Renders the CompanyPage component.
 * Displays information about a specific company.
 */
function CompanyPage() {
    const { company_name } = useParams();
    const [companyData, setCompanyData] = useState(null); // Initialize as null

    useEffect(() => {
        /**
         * Fetches company data from the server.
         * If the company is not found, redirects to another page.
         * If an error occurs, redirects to another page and displays an error message.
         */
        fetch(`http://localhost:8000/api/companies/fortune_1000_company_info/${company_name}`)
          .then(res => res.json())
          .then(resJson => setCompanyData(resJson))
          .catch(error => {
            window.console.error('Error fetching company data:', error);
            if (error.message.includes('Company not found')) {
                alert('Company not found. Redirecting to another page.');
            } else {
                alert('An error occurred while fetching company data. Redirecting to another page.' + error);
            }
            window.location.href = '/';
            // Redirect to another page
            
          });
      }, [company_name]);

    return (
        <Box className="cityPage" sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', height: '100vh' }}> {/* Adjust height to account for tab height */}
                {companyData ? (
                    <Box className="info-section" sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                            <h1>{company_name}</h1>
                            <div>
                                <p><strong>Current Rank:</strong> {companyData.curr_rank} | <strong>Size in City Rank:</strong> {companyData.size_in_city_rank} | <strong>Rank Change:</strong> {companyData.rank_change}</p>
                            </div>
                        </Box>
                        <h3>{companyData.city.charAt(0).toUpperCase() + companyData.city.slice(1)}, {companyData.state.charAt(0).toUpperCase() + companyData.state.slice(1)}</h3>
                        <br />
                        <p><strong>Revenue:</strong> ${companyData.revenue} million</p>
                        <p><strong>Profit:</strong> ${companyData.profit} million</p>
                        <p><strong>Number of Employees:</strong> {companyData.num_of_employees}</p>
                        <p><strong>Sector:</strong> {companyData.sector}</p>
                        <p><strong>Newcomer:</strong> {companyData.newcomer}</p>
                        <p><strong>CEO Founder:</strong> {companyData.ceo_founder}</p>
                        <p><strong>CEO Woman:</strong> {companyData.ceo_woman}</p>
                        <p><strong>Website:</strong> <a href={`//${companyData.website}`}>{companyData.website}</a></p>
                        <p><strong>Ticker:</strong> {companyData.ticker}</p>
                        <p><strong>Market Cap:</strong> ${companyData.market_cap} million</p>
                    </Box>
                ) : (
                    <p>Loading...</p>
                )}
            </Box>
        </Box>
    );
}

export default CompanyPage;
