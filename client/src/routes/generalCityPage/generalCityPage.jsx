
import React, { useState, useEffect } from 'react';
import './generalCityPage.scss';
import FilterCity from '../../components/FilterCity/FilterCity';
import Map from '../../components/map/Map';

function GeneralCityPage() {
    const [cities, setCities] = useState([]);         // All cities data
    const [filteredCities, setFilteredCities] = useState([]); // Filtered cities for display

    useEffect(() => {
        fetch('http://localhost:8000/api/cities')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCities(data);
                setFilteredCities(data); // Initially, filtered cities are all cities
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    }, []);

    // Placeholder for filter handling if needed in the future
    const handleCityFilter = (filterTerm) => {
        console.log("Filter Term:", filterTerm);
        // This can be implemented later when filtering is required
    };
    return (
        <div className='generalCityPage'>
            <FilterCity onFilterChange={handleCityFilter} />
            <div className='mapContainer'>
                <Map items={cities} latitude={39.8283} longitude={-98.5795} zoom={5} />
            </div>
        </div>
    );
}

export default GeneralCityPage;

