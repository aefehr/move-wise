const mysql = require('mysql2/promise');
const config = require('./config.json');

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});


/* Routes for specific city page */

// GET /city_fortune_1000_companies/:city/:state
// Returns the names of all Fortune 1000 companies headquartared in a specific city
const city_fortune_1000_companies = async (req, res) => {
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
};


// GET /city_company_stats/:city/:state
// Returns total number of companies in specific city and top 5 most popular industries
const city_company_stats = async (req, res) => {
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
};

// GET /city_col_stats/:city/:state
// Returns cost of living statistics for a specific city
const city_col_stats = async (req, res) => {
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

        const results = await pool.query(sql, [city, state]);
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).send('No cost of living data found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching cost of living data');
    }
};

// GET /city_rel_stats/:city/:state
// Returns real estate statistics for a specific city
const city_rel_stats = async (req, res) => {
    const { city, state } = req.params;
    try {
        const sql = `
            SELECT MAX(price) AS max_price, MIN(price) AS min_price, AVG(price) AS avg_price
            FROM real_estate_listing rel
            JOIN city c ON rel.city_id = c.id
            WHERE c.city = ? AND c.state = ?
            GROUP BY c.city, c.state;
        `;
        const results = await pool.query(sql, [city, state]);
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).send('No real estate data found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching real estate data');
    }
};

//GET /city_company_rank/:city/:state
// Returns the rank of the city in terms of number of companies
const city_company_rank = async (req, res) => {
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
        const results = await pool.query(sql, [city, state]);
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).send('No company rank found for the specified city and state.');
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching company rank data');
    }
}

/* Routes for specific (fortune 1000) company page */

// GET /fortune_1000_company_info/:company_name
// Returns information about a specific company in Fortune 1000 list 
const fortune_1000_company_info = async (req, res) => {
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
};


/* Routes for general company page */

// GET /fortune_1000_companies
// Returns the Fortune 1000 companies by current rank with optional filters for sector or city and state
const fortune_1000_companies = async (req, res) => {
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
};


// GET /top_fortune_1000_cities
// Returns cities with the most Fortune 1000 companies
const top_fortune_1000_cities = async (req, res) => {
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
};

// GET /most-improved-companies
// Returns companies that have the most significant rank improvement
const most_improved_companies = async (req, res) => {
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
};

// GET /most_improved_sectors
// Returns the top 5 sectors with the most average rank improvement
const most_improved_sectors = async (req, res) => {
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
};


/* Routes for Market Explorer page */

// GET /lcol_cities_by_sector
// Returns the top 5 cities with the lowest cost of living index where top employers are in the specified sector
const lcol_cities_by_sector = async (req, res) => {
    const { sector } = req.query;  // Extract sector from query parameters

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
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Server error occurred while fetching top cities for the sector');
    }
};


// GET /top_startup_cities
// Returns top 10 cities with the highest number of startups (new companies in past 5 years) 
// and their cost of living and popular industries
const top_startup_cities = async (req, res) => {
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
};

// GET /low_home_price_cities_by_index
// Returns top 5 cities with the lowest average real estate prices and user-selected cost of living index
const low_home_price_cities_by_index = async (req, res) => {
    const indexChoice = req.query.indexChoice;  // This will get the index from a query parameter

    // Map user input to actual database columns securely
    const validIndexes = {
        'Cost of Living Index': 'cost_of_living_index',
        'Rent Index': 'rent_index',
        'Groceries Index': 'groceries_index',
        'Restaurant Price Index': 'restaurant_price_index',
        'Local Purchasing Power Index': 'local_purchasing_power_index'
    };

    const selected_index = validIndexes[indexChoice] 

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
};

module.exports = {
    city_fortune_1000_companies,
    city_company_stats,
    city_col_stats,
    city_rel_stats,
    city_company_rank,
    fortune_1000_company_info,
    fortune_1000_companies,
    top_fortune_1000_cities,
    most_improved_companies,
    most_improved_sectors,
    lcol_cities_by_sector,
    top_startup_cities,
    low_home_price_cities_by_index
};

