import React, { useState, useEffect } from 'react';
import './generalCityPage.scss';
import FilterCity from '../../components/FilterCity/FilterCity';
import Map from '../../components/map/Map';

function GeneralCityPage() {
    const [cities, setCities] = useState([]); // All cities data
    const [filteredCities, setFilteredCities] = useState([]); // Filtered cities for display

    useEffect(() => {
        // Fetch the city data initially and whenever needed
        fetch('http://localhost:8000/api/cities')
            .then(response => response.json())
            .then(data => {
                setCities(data);
                setFilteredCities(data); // Initially, filtered cities are all cities
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    }, []);

    // Handle filtering based on user inputs
    const handleCityFilter = (filterTerm) => {
        console.log("Received filter term:", filterTerm);

        const filtered = cities.filter(cityData => {
            const cityMatch = filterTerm.City ? cityData.city.toLowerCase().includes(filterTerm.City.trim().toLowerCase()) : true;
            const stateMatch = filterTerm.State ? cityData.state.toLowerCase().includes(filterTerm.State.trim().toLowerCase()) : true;
            const housingMatch = filterTerm.HousingCount ? cityData.housing_count >= parseInt(filterTerm.HousingCount) : true;
            const priceMatch = filterTerm.AverageHousePrice ? cityData.average_house_price <= parseFloat(filterTerm.AverageHousePrice) : true;
            const jobsMatch = filterTerm.JobsCount ? cityData.jobs >= parseInt(filterTerm.JobsCount) : true;
            const employersMatch = filterTerm.MajorEmployersCount ? cityData.employer_count >= parseInt(filterTerm.MajorEmployersCount) : true;

            return cityMatch && stateMatch && housingMatch && priceMatch && jobsMatch && employersMatch;
        });

        setFilteredCities(filtered);
    };

    // Handle displaying only the top 10 filtered cities
    const handleShowTop10 = () => {
        const sortedFilteredCities = [...filteredCities].sort((a, b) => {
            // Sort by average house price ascending, then by jobs count descending
            if (a.average_house_price !== b.average_house_price) {
                return a.average_house_price - b.average_house_price;
            }
            return b.jobs - a.jobs;
        }).slice(0, 10); // Get only the top 10

        setFilteredCities(sortedFilteredCities);
    };

    return (
        <div className='generalCityPage'>
            <FilterCity onFilterChange={handleCityFilter} onShowTop10={handleShowTop10} />
            <div className='mapContainer'>
                <Map items={filteredCities} latitude={39.8283} longitude={-98.5795} zoom={5} pin_house={false} />
            </div>
        </div>
    );
}

export default GeneralCityPage;
