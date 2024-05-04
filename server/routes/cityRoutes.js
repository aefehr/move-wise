const express = require('express');
const router = express.Router();
const pool = require('../database');  // Ensure the correct path to your database connection module

/* Get all cities with latitude and longitude to populate the map, only if they have a company in the fortune_1000 table */
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT
                c.city,
                MAX(c.id) AS id,
                MAX(c.state) AS state,
                MAX(u.lat) AS latitude,
                MAX(u.lng) AS longitude
            FROM city c
            JOIN uszips u ON c.city = u.city AND c.state = u.state_name
            WHERE EXISTS (
                SELECT 1
                FROM fortune_1000 f
                WHERE c.id = f.city_id
            )
            GROUP BY c.city;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching city data');
    }
});



/* Returns the names of all Fortune 1000 companies headquartered in a specific city */
router.get('/city_fortune_1000_companies/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const query = `
            SELECT company_name
            FROM fortune_1000
            JOIN city ON fortune_1000.city_id = city.id
            WHERE city.city = ? AND city.state = ?;
        `;
        const [results] = await pool.query(query, [city, state]);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No companies found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching Fortune 1000 companies');
    }
});

/* Returns cities with the most Fortune 1000 companies */
router.get('/top_fortune_1000_cities', async (req, res) => {
    try {
        const query = `
            SELECT c.city, c.state, COUNT(f.id) AS company_count
            FROM city c
            JOIN fortune_1000 f ON c.id = f.city_id
            GROUP BY c.city, c.state
            ORDER BY company_count DESC
            LIMIT 10;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities');
    }
});

module.exports = router;
