import { useState, useEffect } from 'react';
import sectorData from './unique_sectors.json'; // Import sector data
import "./marketExplorerPage.scss";

function MarketExplorerPage() {
    const [sector, setSector] = useState(sectorData.UniqueSectors[0]); // Default to first sector
    const [indexChoice, setIndexChoice] = useState('Cost of Living Index'); // Default index
    const [citiesBySector, setCitiesBySector] = useState([]);
    const [citiesByIndex, setCitiesByIndex] = useState([]);
    const [topStartupCities, setTopStartupCities] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/market/top_startup_cities')
            .then(response => response.json())
            .then(data => setTopStartupCities(data))
            .catch(error => console.error('Error fetching top startup cities:', error));
    }, []);

    /**
     * Fetches cities by sector based on the selected sector.
     */
    const fetchCitiesBySector = () => {
        fetch(`http://localhost:8000/api/market/lcol_cities_by_sector?sector=${encodeURIComponent(sector)}`)
            .then(response => response.json())
            .then(data => setCitiesBySector(data))
            .catch(error => console.error('Error fetching cities by sector:', error));
    };

    /**
     * Fetches cities by index based on the selected index choice.
     */
    const fetchCitiesByIndex = () => {
        fetch(`http://localhost:8000/api/market/low_home_price_cities_by_index?indexChoice=${encodeURIComponent(indexChoice)}`)
            .then(response => response.json())
            .then(data => setCitiesByIndex(data))
            .catch(error => console.error('Error fetching cities by index:', error));
    };

    return (
        <div className="market-explorer">
            <div className="chat-bubble question">
                <h2>Show me the top 5 cities with the lowest cost of living index where top employers are in the
                    <select value={sector} onChange={e => setSector(e.target.value)}>
                        {sectorData.UniqueSectors.map((sector, index) => (
                            <option key={index} value={sector}>{sector}</option>
                        ))}
                    </select>
                    sector
                </h2>
                <button onClick={fetchCitiesBySector}>Fetch Cities</button>
            </div>
            <div className="chat-bubble answer">
                <ul>
                    {citiesBySector.map((city, index) => (
                        <li key={index}>{city.city}, {city.state} - Avg. COL Index: {city.avg_col_index}</li>
                    ))}
                </ul>
            </div>

            <div className="chat-bubble question">
                <h2>Show top 5 cities with the lowest average real estate prices, ordered by
                    <select value={indexChoice} onChange={e => setIndexChoice(e.target.value)}>
                        <option value="Cost of Living Index">Cost of Living Index</option>
                        <option value="Rent Index">Rent Index</option>
                        <option value="Groceries Index">Groceries Index</option>
                        <option value="Restaurant Price Index">Restaurant Price Index</option>
                        <option value="Local Purchasing Power Index">Local Purchasing Power Index</option>
                    </select>
                </h2>
                <button onClick={fetchCitiesByIndex}>Fetch Cities</button>
            </div>
            <div className="chat-bubble answer">
                <ul>
                    {citiesByIndex.map((city, index) => (
                        <li key={index}>{city.city}, {city.state} - Average Real Estate Price: ${city.average_real_estate_price} - {indexChoice}: {city.selected_index_value}</li>
                    ))}
                </ul>
            </div>

            <div className="chat-bubble question">
                <h2>Top 10 cities with the highest number of startups (new companies in past 5 years)</h2>
            </div>
            <div className="chat-bubble answer">
                <ul>
                    {topStartupCities.map((city, index) => (
                        <li key={index}>{city.city}, {city.state} - New Startups: {city.total_new_startups}, Popular Industries: {city.popular_industries}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MarketExplorerPage;

