import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip';
import './FilterCity.scss';

function FilterCity({ onFilterChange, onShowTop10 }) {
    const [activeTab, setActiveTab] = useState('living');

    const [filters, setFilters] = useState({
        living: {
            City: '',
            State: '',
            HousingCount: '',
            AverageHousePrice: ''
        },
        employment: {
            JobsCount: '',
            MajorEmployersCount: '',
        }
    });

    // Define tooltips based on the filter type
    const tooltips = {
        living: {
            City: "Matches exact city name.",
            State: "Matches exact state name.",
            HousingCount: "Filter for housing counts greater than this value.",
            AverageHousePrice: "Filter for average house prices less than this value."
        },
        employment: {
            JobsCount: "Filter for job counts greater than this value.",
            MajorEmployersCount: "Filter for major employer counts greater than this value."
        }
    };

    const handleFilterChange = (tab, prop) => (event) => {
        setFilters({
            ...filters,
            [tab]: { ...filters[tab], [prop]: event.target.value }
        });
    };

    const handleSubmit = () => {
        onFilterChange(filters[activeTab]);
    };

    return (
        <Box className="filterCity">
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
                <Tab label="Living" value="living" />
                <Tab label="Employment" value="employment" />
            </Tabs>
            <Grid container className="filterGrid">
                <Box className="filterItems">
                    {Object.entries(filters[activeTab]).map(([key, value]) => (
                        <Tooltip title={tooltips[activeTab][key]} key={key}>
                            <TextField
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                variant="outlined"
                                value={value}
                                onChange={handleFilterChange(activeTab, key)}
                                fullWidth
                            />
                        </Tooltip>
                    ))}
                </Box>
                <Box className="actionButtons">
                    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                        Search
                    </Button>
                    <Button onClick={onShowTop10} variant="contained" color="secondary" fullWidth>
                        Show Top 10
                    </Button>
                </Box>
            </Grid>
        </Box>
    );
}

export default FilterCity;
