import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import './FilterCity.scss';

function FilterCity({ onFilterChange }) {
  const [activeTab, setActiveTab] = useState('cost');
  const [costFilters, setCostFilters] = useState({
    costIndex: '',
    rentIndex: '',
    purchasingPower: '',
    propertyPrice: ''
  });
  const [companyFilters, setCompanyFilters] = useState({
    ranking: '',
    industry: ''
  });

  const handleCostFilterChange = (prop) => (event) => {
    setCostFilters({ ...costFilters, [prop]: event.target.value });
  };

  const handleCompanyFilterChange = (prop) => (event) => {
    setCompanyFilters({ ...companyFilters, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    onFilterChange({ type: activeTab, value: activeTab === 'cost' ? costFilters : companyFilters });
  };

  const handleShowTopTen = () => {
    console.log("Showing Top 10");
  };

  return (
    <Box className='filterCity'>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
        <Tab label="Cost" value="cost" />
        <Tab label="Employer" value="company" />
      </Tabs>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {activeTab === 'cost' && (
            <>
              <TextField label="Cost of Living Index" variant="outlined" value={costFilters.costIndex} onChange={handleCostFilterChange('costIndex')} fullWidth />
              <TextField label="Average Property Price" variant="outlined" value={costFilters.propertyPrice} onChange={handleCostFilterChange('propertyPrice')} fullWidth />
            </>
          )}
          {activeTab === 'company' && (
            <>
              <TextField label="Ranking" variant="outlined" value={companyFilters.ranking} onChange={handleCompanyFilterChange('ranking')} fullWidth />
              <TextField label="Industry/Sector" variant="outlined" value={companyFilters.industry} onChange={handleCompanyFilterChange('industry')} fullWidth />
            </>
          )}
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" flexDirection="column" height="100%" justifyContent="space-between">
            <Tooltip title="Click to search with the specified filters">
              <Button className='search' onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                Search
              </Button>
            </Tooltip>
            <Tooltip title="Show the top 10 best best results regardless of filters">
              <Button className='top' onClick={handleShowTopTen} variant="outlined" color="primary" fullWidth>
                Show Top 10
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FilterCity;
