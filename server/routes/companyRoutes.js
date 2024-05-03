const express = require('express');
const router = express.Router();
const pool = require('../database'); // Adjust the path to your database configuration

// Returns total number of companies in a specific city, top 5 most popular industries, average company founded year, and number of companies founded in past 2 years
router.get('/city_company_stats/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT * 
            FROM city_statistics 
            WHERE city = ? AND state = ?;
        `;

        const results = await pool.query(sql, [city, state]);
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).send('No companies found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching company data');
    }
});

// Returns information about a specific company in Fortune 1000 list 
router.get('/fortune_1000_company_info/:company_name', async (req, res) => {
    const { company_name } = req.params;
    const query = `
        SELECT c.city, c.state, f.curr_rank, f.rank_change, f.revenue, f.profit, 
                f.num_of_employees, f.sector, f.newcomer, f.ceo_founder, 
                f.ceo_woman, f.website, f.ticker, f.market_cap,
                (
                    SELECT COUNT(*) + 1
                    FROM fortune_1000 f2
                    WHERE f2.city_id = f.city_id 
                    AND f2.num_of_employees > f.num_of_employees
                ) AS size_in_city_rank
        FROM fortune_1000 f
        JOIN city c ON f.city_id = c.id
        WHERE f.company_name = ?
    `;

    try {
        const [results] = await pool.query(query, [company_name]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Company not found');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error retrieving company details');
    }
});



/* Routes for general company page */

// Returns companies that have the most significant rank improvement
router.get('/most-improved-companies', async (req, res) => {
    try {
        const query = `
            SELECT company_name, prev_rank, curr_rank, (prev_rank - curr_rank) AS rank_improvement
            FROM fortune_1000
            WHERE prev_rank != 0 AND curr_rank != 0
            ORDER BY rank_improvement DESC
            LIMIT 10;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching most improved companies');
    }
});

// Returns the top 5 sectors with the most average rank improvement
router.get('/most-improved-sectors', async (req, res) => {
    try {
        const query = `
            SELECT 
                sector, 
                AVG(prev_rank - curr_rank) AS avg_rank_improvement
            FROM fortune_1000
            WHERE prev_rank > 0 AND curr_rank > 0 AND prev_rank != curr_rank
            GROUP BY sector
            ORDER BY avg_rank_improvement DESC
            LIMIT 5;
        `;
        const [results] = await pool.query(query);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No data found for sector rank improvements.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching sector rank improvements');
    }
});

module.exports = router;