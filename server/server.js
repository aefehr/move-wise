const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 8000; 

app.use(cors({
  origin: '*', 
}));
app.use(express.json()); 

app.get('/city_fortune_1000_companies/:city/:state', routes.city_fortune_1000_companies);
app.get('/city_company_stats/:city/:state', routes.city_company_stats);

app.get('/fortune_1000_company_info/:company_name', routes.fortune_1000_company_info);

app.get('/fortune_1000_companies', routes.fortune_1000_companies);
app.get('/top_fortune_1000_cities', routes.top_fortune_1000_cities);
app.get('/most_improved_companies', routes.most_improved_companies);
app.get('/most_improved_sectors', routes.most_improved_sectors);

app.get('/lcol_cities_by_sector', routes.lcol_cities_by_sector);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
});

module.exports = app;
