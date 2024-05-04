import React from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import ListPage from '../listPage/listPage';
import UnsplashImageFetcher from '../../components/UnsplashImgFetcher/UnsplashImgFetcher';
import './CityPage.scss'; // Ensure this imports correct styles

function CityPage() {
    const [tabValue, setTabValue] = React.useState('realEstate');

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box className="cityPage" sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Tabs value={tabValue} onChange={handleChange} centered>
                <Tab label="Real Estate" value="realEstate" />
                <Tab label="City Information" value="cityInfo" />
            </Tabs>
            {tabValue === 'realEstate' && <ListPage />}


            {tabValue === 'cityInfo' && (
                <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)' }}> {/* Adjust height to account for tab height */}
                    <UnsplashImageFetcher keyword="Philly" />
                    <Box className="info-section" sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                        {/* Placeholder for statistics or additional info */}
                        <h1>City Details</h1>
                        <p>More details about the city can go here...</p>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default CityPage;
