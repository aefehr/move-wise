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

    const { city, state } = useParams();
    const [company_list, setCompanyList] = useState(null); // Initialize as null
    const [company_stats, setCompanyStats] = useState(null); // Initialize as null
    const [col_stats, setColStats] = useState(null); // Initialize as null
    const [rel_stats, setRelStats] = useState(null); // Initialize as null
    const [company_rank_stats, setCompanyRankStats] = useState(null); // Initialize as null

    const [realEstateListings, setRealEstateListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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
                throw new Error(`HTTP status ${res.status}`);
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
                <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}> {/* Adjust height to account for tab height */}
                    <UnsplashImageFetcher keyword={city} />
                    <Box className="info-section" sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                        {/* Placeholder for statistics or additional info */}
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
