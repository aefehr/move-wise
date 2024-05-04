const express = require('express');
const router = express.Router();
const pool = require('../database'); // Ensure the path to your database module is correct

// Returns the top 5 cities with the lowest cost of living index where top employers are in the specified sector
router.get('/lcol_cities_by_sector', async (req, res) => {
    const { sector } = req.query; // Extract sector from query parameters

    if (!sector) {
        return res.status(400).send('Sector parameter is required');
    }

    try {
        const query = `
            SELECT 
                c.city,
                c.state,
                AVG(col.cost_of_living_index) AS avg_col_index,
                GROUP_CONCAT(DISTINCT companies.company_name ORDER BY companies.num_of_employees DESC SEPARATOR ', ') AS top_companies
            FROM city c
            JOIN (
                SELECT 
                    city_id,
                    company_name,
                    num_of_employees
                FROM fortune_1000
                WHERE sector = ?
                ORDER BY num_of_employees DESC
            ) companies ON companies.city_id = c.id
            JOIN cost_of_living col ON c.id = col.city_id
            GROUP BY c.city, c.state
            HAVING COUNT(DISTINCT companies.company_name) >= 1
            ORDER BY avg_col_index ASC
            LIMIT 5;
        `;
        const [results] = await pool.query(query, [sector]);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No data found for the specified sector.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities for the sector');
    }
});

// Returns top 10 cities with the highest number of startups (new companies in past 5 years)
// and their cost of living and popular industries
router.get('/top_startup_cities', async (req, res) => {
    try {
        const query = `
            SELECT
                city,
                state,
                total_new_startups,
                avg_col_index,
                popular_industries
            FROM city_startup_data
            ORDER BY total_new_startups DESC, avg_col_index
            LIMIT 10;
        `;
        const [results] = await pool.query(query);  // Assuming pool.query uses Promises; adjust if using callbacks
        if (results.length) {
            res.json(results);
        } else {
            res.status(404).send('No cities found with significant startup activity.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top startup cities');
    }
});

// Returns top 5 cities with the lowest average real estate prices and user-selected cost of living index
router.get('/low_home_price_cities_by_index', async (req, res) => {
    const indexChoice = req.query.indexChoice;  // This will get the index from a query parameter

    // Map user input to actual database columns securely
    const validIndexes = {
        'Cost of Living Index': 'cost_of_living_index',
        'Rent Index': 'rent_index',
        'Groceries Index': 'groceries_index',
        'Restaurant Price Index': 'restaurant_price_index',
        'Local Purchasing Power Index': 'local_purchasing_power_index'
    };

    const selected_index = validIndexes[indexChoice];

    if (!selected_index) {
        return res.status(400).send('Invalid index choice. Please select a valid index.');
    }

    try {
        const query = `
            SELECT
                city,
                state,
                dominant_sectors,
                average_real_estate_price,
                ${selected_index} AS selected_index_value
            FROM city_real_estate_with_index_data
            ORDER BY average_real_estate_price ASC, selected_index_value ASC
            LIMIT 5;
        `;
        const [results] = await pool.query(query);
        if (results.length) {
            res.json(results);
        } else {
            res.status(404).send('No affordable cities found with the selected cost of living index.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top affordable cities');
    }
});



module.exports = router;
