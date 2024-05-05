const express = require('express');
const router = express.Router();
const pool = require('../database'); // Adjust the path to your database configuration

/* Routes for specific company page */

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



/* Routes for Company Directory */

// Returns the Fortune 1000 companies by current rank with optional filters for sector or city and state
router.get('/fortune_1000_companies', async (req, res) => {
    const { sector, city, state } = req.query; // Using query parameters for optional filtering

    let query = `
        SELECT f.company_name, f.curr_rank, c.city, c.state, f.sector, f.website
        FROM fortune_1000 f
        JOIN city c ON f.city_id = c.id
    `;

    let conditions = [];
    let params = [];

    // Add conditions based on provided query parameters
    if (sector) {
        conditions.push("f.sector = ?");
        params.push(sector);
    }
    if (city && state) {
        conditions.push("c.city = ? AND c.state = ?");
        params.push(city, state);
    } else if (city) {
        conditions.push("c.city = ?");
        params.push(city);
    } else if (state) {
        conditions.push("c.state = ?");
        params.push(state);
    }

    if (conditions.length) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY f.curr_rank ASC `;

    try {
        const [results] = await pool.query(query, params);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No matching companies found.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top companies');
    }
});


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

// Returns all unique sectors
router.get('/fortune_1000_sectors', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT sector
            FROM fortune_1000;
        `;
        const [results] = await pool.query(query);
        if (results.length > 0) {
            const sectors = results.map(result => result.sector);
            res.json(sectors);
        } else {
            res.status(404).send('No sectors found');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error retrieving sectors');
    }
});

module.exports = router;