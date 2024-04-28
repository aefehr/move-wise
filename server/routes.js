const mysql = require('mysql2/promise');
const config = require('./config.json'); 

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

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
  
  module.exports = {
    city_fortune_1000_companies
  };

