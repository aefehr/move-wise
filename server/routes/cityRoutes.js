const express = require('express');
const router = express.Router();
const pool = require('../database');  // Ensure the correct path to your database connection module

/* Get all cities with latitude and longitude to populate the map, only if they have a company in the fortune_1000 table */
router.get('/', async (req, res) => {
    try {
        const query = `
        SELECT  c.city,
                MIN(c.id),
                c.state,
                u.lat AS latitude,
                u.lng AS longitude
        FROM city c
        JOIN uszips u ON c.city = u.city 
            AND c.state = u.state_name
        JOIN fortune_1000 f ON c.id = f.city_id
        GROUP BY c.city;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching city data');
    }
});

/* Routes for specific city page */

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

// GET /city_company_stats/:city/:state
// Returns total number of companies in specific city and top 5 most popular industries
router.get('/city_company_stats/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT
                c.city,
                c.state,
                COUNT(*) AS total_companies,
                (
                    SELECT GROUP_CONCAT(industry ORDER BY count DESC SEPARATOR ', ')
                    FROM (
                        SELECT industry, COUNT(*) AS count
                        FROM company
                        WHERE city_id = c.id
                        GROUP BY industry
                        ORDER BY count DESC
                        LIMIT 5
                    ) AS subquery
                ) AS top_industries
            FROM
                city c
            JOIN
                company co ON c.id = co.city_id
            WHERE
                c.city = ? AND c.state = ?
            GROUP BY
                c.city, c.state;
        `;

        const [results] = await pool.query(sql, [city, state]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('No companies found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching company data');
    }
});

// Returns cost of living statistics for a specific city
router.get('/city_col_stats/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT
                col.cost_of_living_index,
                col.rent_index,
                col.groceries_index,
                col.restaurant_price_index
            FROM city c
            JOIN cost_of_living col ON c.id = col.city_id
            WHERE c.city = ? AND c.state = ?;
        `;

        const [results] = await pool.query(sql, [city, state]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('No cost of living data found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500). send('Server error occurred while fetching cost of living data');
    }
});

// Returns real estate statistics for a specific city
router.get('/city_rel_stats/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT MAX(price) AS max_price, MIN(price) AS min_price, AVG(price) AS avg_price
            FROM real_estate_listing_2 rel
            JOIN city c ON rel.city_id = c.id
            WHERE c.city = ? AND c.state = ?
            GROUP BY c.city, c.state;
        `;
        const [results] = await pool.query(sql, [city, state]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('No real estate data found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500). send('Server error occurred while fetching real estate data');
    }
});

// Returns the rank of the city in terms of number of companies
router.get('/city_company_rank/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
        SELECT city_rank
        FROM (
            SELECT
                c.city,
                c.state,
                RANK() OVER (ORDER BY COUNT(*) DESC) AS city_rank
            FROM
                fortune_1000 f
                JOIN city c ON f.city_id = c.id
            GROUP BY
                c.city, c.state
            ) ranked_cities
        WHERE city = ? AND state = ?;
        `;
        const [results] = await pool.query(sql, [city, state]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('No company rank found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching company rank data');
    }
});






/* Routes for City Directory page */


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

/* Returns top 10 cities with the highest COL */
router.get('/top_cities_highest_col', async (req, res) => {
    try {
        const sql = `
            SELECT c.city, c.state, col.cost_of_living_index
            FROM city c
            JOIN cost_of_living col ON c.id = col.city_id
            ORDER BY col.cost_of_living_index DESC
            LIMIT 10;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities with highest COL');
    }
});

/* Returns top 10 cities with the lowest COL */
router.get('/top_cities_lowest_col', async (req, res) => {
    try {
        const sql = `
            SELECT c.city, c.state, col.cost_of_living_index
            FROM city c
            JOIN cost_of_living col ON c.id = col.city_id
            ORDER BY col.cost_of_living_index ASC
            LIMIT 10;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities with lowest COL');
    }
});

/* Returns top 10 cities with highest average real estate price */
router.get('/top_cities_highest_avg_re_price', async (req, res) => {
    try {
        const sql = `
            SELECT c.city, c.state, AVG(rel.price) AS avg_price
            FROM city c
            JOIN real_estate_listing_2 rel ON c.id = rel.city_id
            GROUP BY c.city, c.state
            ORDER BY avg_price DESC
            LIMIT 10;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities with highest average real estate price');
    }
});

/* Returns top 10 cities with lowest average real estate price */
router.get('/top_cities_lowest_avg_re_price', async (req, res) => {
    try {
        const sql = `
            SELECT c.city, c.state, AVG(rel.price) AS avg_price
            FROM city c
            JOIN real_estate_listing_2 rel ON c.id = rel.city_id
            WHERE rel.price IS NOT NULL AND rel.price > 1
            GROUP BY c.city, c.state
            ORDER BY avg_price ASC
            LIMIT 10;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities with lowest average real estate price');
    }
});

/* Returns top 10 cities with the most companies founded in the last year */
router.get('/top_cities_most_new_companies', async (req, res) => {
    try {
        const sql = `
            SELECT c.city, c.state, COUNT(co.id) AS new_company_count
            FROM city c
            JOIN company co ON c.id = co.city_id
            WHERE co.founded = YEAR(CURDATE()) OR co.founded = YEAR(CURDATE()) - 1
            GROUP BY c.city, c.state
            ORDER BY new_company_count DESC
            LIMIT 10;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities with most new companies');
    }
});
module.exports = router;
