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

module.exports = router;
