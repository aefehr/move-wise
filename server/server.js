const express = require('express');
const cors = require('cors');


// Routes import
const cityRoutes = require('./routes/cityRoutes');  // Ensure path is correct
const companyRoutes = require('./routes/companyRoutes'); // Ensure path is correct
const marketExplorerRoutes = require('./routes/marketExplorerRoutes'); // Ensure path is correct

const app = express();
const PORT = 8000;

// Security headers
// app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });

// app.use(limiter);

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is not right!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
});

module.exports = app;
