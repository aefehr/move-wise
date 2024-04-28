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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
});

module.exports = app;
