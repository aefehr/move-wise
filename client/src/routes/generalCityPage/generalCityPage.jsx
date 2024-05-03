// import React, { useState, useEffect, useCallback } from 'react';
// import './generalCityPage.scss';
// import FilterCity from '../../components/FilterCity/FilterCity';
// import Map from '../../components/map/Map';

// function GeneralCityPage() {
//     const [cities, setCities] = useState([]);
//     const [filteredCities, setFilteredCities] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:8000/api/cities')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Data received:', data); // Check what data is received
//                 setCities(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching cities:', error);
//             });
//     }, []);

//     const handleCityFilter = useCallback((filterTerm) => {
//         console.log("Filter Term:", filterTerm);
//         // Implement filtering logic based on filterTerm, for example:
//         if (!filterTerm) {
//             setFilteredCities(cities);
//         } else {
//             const filtered = cities.filter(city => city.city.toLowerCase().includes(filterTerm.toLowerCase()));
//             setFilteredCities(filtered);
//         }
//     }, [cities]);

//     return (
//         <div className='generalCityPage'>
//             <FilterCity onFilterChange={handleCityFilter} />
//             <div className='mapContainer'>
//                 <Map items={filteredCities} latitude={39.8283} longitude={-98.5795} zoom={5} />
//             </div>
//         </div>
//     );
// }

// export default GeneralCityPage;


import React, { useState, useEffect } from 'react';
import './generalCityPage.scss';
import FilterCity from '../../components/FilterCity/FilterCity';
import Map from '../../components/map/Map';

function GeneralCityPage() {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/cities')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCities(data); // Set fetched data to cities
            })
            .catch(error => {
                console.error('Error fetching cities:', error); // Log any errors
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

