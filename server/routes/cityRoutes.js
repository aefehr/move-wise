const express = require('express');
const router = express.Router();
const pool = require('../database');  // Ensure the correct path to your database connection module

/**
 * Retrieves city data including information about employers, housing, jobs, and average house price.
 * Also includes latitude and longitude coordinates for each city.
 * @route GET /
 * @returns {Object[]} - Array of city data objects.
 * @throws {Error} - If there is an error while fetching city data.
 */
router.get('/', async (req, res) => {
    try {
        const query = `
           SELECT
                c.city,
                c.id,
                c.state,
                MAX(u.lat) AS latitude,
                MAX(u.lng) AS longitude,
                (
                    SELECT COUNT(*)
                    FROM fortune_1000 f
                    WHERE f.city_id = c.id
                ) AS employer_count,
                (
                    SELECT COUNT(*)
                    FROM real_estate_listing_2 rel
                    WHERE rel.city_id = c.id
                ) AS housing_count,
                (
                    SELECT COUNT(*)
                    FROM company co
                    WHERE co.city_id = c.id
                ) AS jobs,
                (
                    SELECT AVG(rel.price)
                    FROM real_estate_listing_2 rel
                    WHERE rel.city_id = c.id
                ) AS average_house_price  -- New subquery to calculate the average price
            FROM city c
            JOIN uszips u ON c.city = u.city AND c.state = u.state_name
            WHERE EXISTS (
                SELECT 1
                FROM fortune_1000 f
                WHERE f.city_id = c.id
            )
            GROUP BY c.city, c.id, c.state
            HAVING housing_count > 0;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching city data');
    }
});

/**
 * Retrieves real estate listings for a specific city and state.
 * @route GET /rel_listings/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object[]} - Array of real estate listing objects.
 * @throws {Error} - If there is an error while fetching real estate listings.
 */
router.get('/rel_listings/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const query = `
           SELECT
                MAX(rel.city) AS city,
                MAX(rel.state) AS state,
                MAX(rel.bed) AS bed,
                MAX(rel.bath) AS bath,
                MAX(rel.acre_lot) AS acre_lot,
                MAX(rel.zip_code) AS zip_code,
                rel.price,
                MAX(u.lat) AS latitude,
                MAX(u.lng) AS longitude,
                MIN(rel.id) AS min_id  
            FROM real_estate_listing_2 rel
            JOIN uszips u ON rel.city = u.city AND rel.state = u.state_name
            WHERE rel.city = ? AND rel.state = ?
                AND rel.city IS NOT NULL
                AND rel.state IS NOT NULL
                AND rel.bed IS NOT NULL
                AND rel.bath IS NOT NULL
                AND rel.acre_lot IS NOT NULL
                AND rel.zip_code IS NOT NULL
                AND rel.price IS NOT NULL
                AND u.lat IS NOT NULL
                AND u.lng IS NOT NULL
            GROUP BY rel.price
            ORDER BY rel.price DESC;
        `;
        const [results] = await pool.query(query, [city, state]);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send('No real estate listings found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching real estate listings');
    }
});

/**
 * Returns the names of all Fortune 1000 companies headquartered in a specific city.
 * @route GET /city_fortune_1000_companies/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object[]} - Array of company names.
 * @throws {Error} - If there is an error while fetching company data.
 */
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

/**
 * Returns company statistics for a specific city and state.
 * @route GET /city_company_stats/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object} - Object containing company statistics.
 * @throws {Error} - If there is an error while fetching company data.
 */
router.get('/city_company_stats/:city/:state', async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT * FROM city_statistics WHERE city = ? AND state = ?;
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

/**
 * Returns cost of living statistics for a specific city and state.
 * @route GET /city_col_stats/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object} - Object containing cost of living statistics.
 * @throws {Error} - If there is an error while fetching cost of living data.
 */
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
        res.status(500).send('Server error occurred while fetching cost of living data');
    }
});

/**
 * Returns real estate statistics for a specific city and state.
 * @route GET /city_rel_stats/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object} - Object containing real estate statistics.
 * @throws {Error} - If there is an error while fetching real estate data.
 */
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
        res.status(500).send('Server error occurred while fetching real estate data');
    }
});

/**
 * Returns the rank of the city in terms of number of companies.
 * @route GET /city_company_rank/:city/:state
 * @param {string} city - The name of the city.
 * @param {string} state - The name of the state.
 * @returns {Object} - Object containing the city rank.
 * @throws {Error} - If there is an error while fetching company rank data.
 */
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

/**
 * Returns 10 cities with the most Fortune 1000 companies.
 * @route GET /top_fortune_1000_cities
 * @returns {Object[]} - Array of city objects with company count.
 * @throws {Error} - If there is an error while fetching top cities.
 */
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

/**
 * Returns top 10 cities with the highest cost of living.
 * @route GET /top_cities_highest_col
 * @returns {Object[]} - Array of city objects with cost of living index.
 * @throws {Error} - If there is an error while fetching top cities with highest COL.
 */
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

/** 
 * Returns top 10 cities with the lowest cost of living.
 * @route GET /top_cities_lowest_col
 * @returns {Object[]} - Array of city objects with cost of living index.
 * @throws {Error} - If there is an error while fetching top cities with lowest COL.
*/
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

/**
 * Returns top 10 cities with the highest average real estate price.
 * @route GET /top_cities_highest_avg_re_price
 * @returns {Object[]} - Array of city objects with average real estate price.
 * @throws {Error} - If there is an error while fetching top cities with highest average real estate price.
 */
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

/**
 * Returns top 10 cities with the lowest average real estate price.
 * @route GET /top_cities_lowest_avg_re_price
 * @returns {Object[]} - Array of city objects with average real estate price.
 * @throws {Error} - If there is an error while fetching top cities with lowest average real estate price.
 */
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

/**
 * Returns top 10 cities with the most companies founded in the last year.
 * @route GET /top_cities_most_new_companies
 * @returns {Object[]} - Array of city objects with new company count.
 * @throws {Error} - If there is an error while fetching top cities with most new companies.
 */
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


/**
 * Returns the names of all states in the database.
 * @route GET /all_states
 * @returns {Object[]} - Array of state names.
 * @throws {Error} - If there is an error while fetching states.
 */
router.get('/all_states', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT state FROM city;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching states');
    }
});

module.exports = router;
