import React from 'react';
import { Tab, Tabs, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ListPage from '../listPage/listPage';
import UnsplashImageFetcher from '../../components/UnsplashImgFetcher/UnsplashImgFetcher';
import './CityPage.scss'; // Ensure this imports correct styles
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CityPage.scss';

function CityPage() {
    const [tabValue, setTabValue] = React.useState('realEstate');

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    //react hook to get city and state from URL
    const { city, state } = useParams();
    //react hooks to store data from API
    const [company_list, setCompanyList] = useState(null);
    const [company_stats, setCompanyStats] = useState(null);
    const [col_stats, setColStats] = useState(null);
    const [rel_stats, setRelStats] = useState(null);
    const [company_rank_stats, setCompanyRankStats] = useState(null);
    const [realEstateListings, setRealEstateListings] = useState([]);

    //fetch data from API
    useEffect(() => {
        const fetchData = async () => {
        /**
         * Fetches city data from the server.
         * If the city is not found, redirects to home page.
         * If an error occurs, redirects to home page and displays an error message.
         */
          try {
            const endpoints = [
              `http://localhost:8000/api/cities/city_fortune_1000_companies/${city}/${state}`,
              `http://localhost:8000/api/cities/city_company_stats/${city}/${state}`,
              `http://localhost:8000/api/cities/city_col_stats/${city}/${state}`,
              `http://localhost:8000/api/cities/city_rel_stats/${city}/${state}`,
              `http://localhost:8000/api/cities/city_company_rank/${city}/${state}`,
              `http://localhost:8000/api/cities/rel_listings/${city}/${state}`
            ];
      
            const responses = await Promise.all(endpoints.map(url => fetch(url)));
            const dataPromises = responses.map(res => {
              if (!res.ok) {
                if (res.status === 404) {
                    // Handle 404 error, city not found
                    throw new Error('City not found');
                }
                throw new Error(`HTTP status ${res.status}`);
                // Handle other HTTP errors
              }
              return res.json();
            });
      
            const [
              companyListData,
              companyStatsData,
              colStatsData,
              relStatsData,
              companyRankStatsData,
              realEstateListingsData
            ] = await Promise.all(dataPromises);
      
            setCompanyList(companyListData);
            setCompanyStats(companyStatsData);
            setColStats(colStatsData);
            setRelStats(relStatsData);
            setCompanyRankStats(companyRankStatsData);
            setRealEstateListings(realEstateListingsData);
          } catch (error) {
            console.error(error);
            alert(`An error occurred: ${error.message}`);
            window.location.href = '/';
          }
        };
      
        fetchData();
      }, [city, state]); // Depend on city and state to rerun when they change
      




    return (
        <Box className="cityPage" sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Tabs value={tabValue} onChange={handleChange} centered>
                <Tab label="Real Estate" value="realEstate" />
                <Tab label="City Information" value="cityInfo" />
            </Tabs>
            {tabValue === 'realEstate' && <ListPage listings={realEstateListings} />}
            {tabValue === 'cityInfo' && (
                <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}>
                    <UnsplashImageFetcher keyword={city} />
                    <Box className="info-section" sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                        <h1>{city.toUpperCase()}, {state.toUpperCase()}</h1>
                        <br />
                        <h2>Cost of Living</h2>
                        <p><strong>Cost of Living Index:</strong> {col_stats && col_stats.cost_of_living_index}</p>
                        <p><strong>Rent Index:</strong> {col_stats && col_stats.rent_index}</p>
                        <p><strong>Groceries Index:</strong> {col_stats && col_stats.groceries_index}</p>
                        <p><strong>Restaurant Price Index:</strong> {col_stats && col_stats.restaurant_price_index}</p>
                        <br />
                        <h2>Real Estate Statistics</h2>
                        <p><strong>Average Home Price:</strong> {rel_stats && Math.ceil(rel_stats.avg_price)}</p>
                        <p><strong>Maximum Price:</strong> {rel_stats && rel_stats.max_price}</p>
                        <p><strong>Minimum Price:</strong> {rel_stats && rel_stats.min_price}</p>
                        <br />
                        <h2>Company Statistics</h2>
                        <p><strong>Number of Companies:</strong> {company_stats && company_stats.total_companies}</p>
                        <p><strong>Top 5 Industries:</strong> {company_stats && company_stats.top_industries}</p>
                        <p><strong>Average Founding Year:</strong> {company_stats && company_stats.average_founding_year}</p>
                        <p><strong>Companies founded in the last 2 years:</strong> {company_stats && company_stats.companies_founded_last_2_years}</p>
                        <p><strong>City Rank by Number of Companies:</strong> {company_rank_stats && company_rank_stats.city_rank}</p>
                        <br />
                        <h2>Fortune 1000 companies in this city:</h2>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell key='Name'>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {company_list && company_list.map((company, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell key='#'>{idx + 1}</TableCell>
                                            <TableCell key='Name'><a href={`/companies/${company.company_name}`}>{company.company_name}</a></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default CityPage;
