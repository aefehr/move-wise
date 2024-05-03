const express = require('express');
const cors = require('cors');


// Routes import
const cityRoutes = require('./routes/cityRoutes');  // Ensure path is correct
const companyRoutes = require('./routes/companyRoutes'); // Ensure path is correct
const marketExplorerRoutes = require('./routes/marketExplorerRoutes'); // Ensure path is correct

const app = express();
const PORT = 8000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Consider specifying allowed origins in production for security
}));
app.use(express.json());

// Use cityRoutes for city-related API endpoints
app.use('/api/cities', cityRoutes);

// Use companyRoutes for company-related API endpoints
app.use('/api/companies', companyRoutes);

// Use marketExplorerRoutes for market explorer-related API endpoints
app.use('/api/market', marketExplorerRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
});

module.exports = app;
