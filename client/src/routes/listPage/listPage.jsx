import React, { useState } from 'react';
import './listPage.scss';
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import FilterListing from "../../components/FilterListing/FilterListing";

function ListPage({ listings }) {
    const [filters, setFilters] = useState({});
    const [filteredListings, setFilteredListings] = useState(listings);

    // Handle filter change
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    // Apply filters to listings based on specific rules
    const applyFilters = (filters) => {
        const filtered = listings.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === "" || isNaN(value)) {
                    return true;  // Ignore empty or non-numeric filters
                }
                switch (key) {
                    case 'price':
                        return item[key] <= parseFloat(value);  // Less than or equal to filter for price
                    case 'bath':
                    case 'bed':
                        return item[key] >= parseInt(value);  // Greater than or equal to filter for bath and bed
                    default:
                        return item[key] === value;  // Default exact match (for future use)
                }
            });
        });
        setFilteredListings(filtered);
    };

    // Determine if there are listings to display
    const hasListings = filteredListings.length > 0;

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper">
                    <FilterListing onFilterChange={handleFilterChange} />
                    {filteredListings.map(item => (
                        <Card key={item.id} item={item} />
                    ))}
                </div>
            </div>
            <div className="mapContainer">
                {/* Conditionally render the Map component only if there are listings */}
                {hasListings ? (
                    <Map
                        items={filteredListings}
                        latitude={filteredListings[0].latitude}
                        longitude={filteredListings[0].longitude}
                        zoom={11}
                        pin_house={true}
                    />
                ) : (
                    <p>No listings available.</p>  // Display when no listings match filters or are available
                )}
            </div>
        </div>
    );
}

export default ListPage;
