import React, { useState } from 'react';
import './FilterListing.scss';

function FilterListing({ onFilterChange }) {
    const [price, setPrice] = useState('');
    const [bath, setBath] = useState('');
    const [bed, setBed] = useState('');

    // Handle input changes
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleBathChange = (e) => setBath(e.target.value);
    const handleBedChange = (e) => setBed(e.target.value);

    // Handle search submission
    const handleSubmit = () => {
        onFilterChange({
            price: price ? parseFloat(price) : undefined,
            bath: bath ? parseInt(bath) : undefined,
            bed: bed ? parseInt(bed) : undefined
        });
    };

    return (
        <div className='filter'>
            <h1>Search results: </h1>

            <div className="bottom">
                <div className="item">
                    <label htmlFor="Price">Price (≤)</label>
                    <input
                        type="number"
                        id="Price"
                        name="Price"
                        placeholder="any"
                        value={price}
                        onChange={handlePriceChange}
                        title="Filter by maximum price"
                    />
                </div>

                <div className="item">
                    <label htmlFor="bathroom">Bath (≥)</label>
                    <input
                        type="number"
                        id="bathroom"
                        name="bathroom"
                        placeholder="any"
                        value={bath}
                        onChange={handleBathChange}
                        title="Filter by minimum bathrooms"
                    />
                </div>

                <div className="item">
                    <label htmlFor="bedroom">Bed (≥)</label>
                    <input
                        type="number"
                        id="bedroom"
                        name="bedroom"
                        placeholder="any"
                        value={bed}
                        onChange={handleBedChange}
                        title="Filter by minimum bedrooms"
                    />
                </div>

                <button onClick={handleSubmit}>
                    <img src='/search.png' alt='' />
                </button>
            </div>
        </div>
    );
}

export default FilterListing;
