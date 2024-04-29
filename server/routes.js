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


  
  module.exports = {
    city_fortune_1000_companies,
    fortune_1000_company_info,
    top_fortune_1000_cities,
    most_improved_companies
  };

