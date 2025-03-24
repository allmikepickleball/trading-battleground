const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// @route   GET /api/stocks/:symbol
// @desc    Get stock data
// @access  Public
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1d', range = '1mo' } = req.query;
    
    // Validate symbol
    if (!symbol || !/^[A-Za-z0-9.]{1,10}$/.test(symbol)) {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }
    
    // Check if we have recent data cached
    const dataFile = path.join(dataDir, `${symbol.toLowerCase()}_data.json`);
    let useCache = false;
    
    if (fs.existsSync(dataFile)) {
      const stats = fs.statSync(dataFile);
      const fileAge = (new Date() - stats.mtime) / 1000 / 60; // Age in minutes
      
      // Use cache if file is less than 15 minutes old
      if (fileAge < 15) {
        useCache = true;
      }
    }
    
    if (useCache) {
      // Read from cache
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return res.json(data);
    } else {
      // Fetch fresh data using Python script
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '../utils/yahooFinance.py'),
        symbol,
        interval,
        range
      ]);
      
      let pythonError = '';
      
      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}: ${pythonError}`);
          return res.status(500).json({ message: 'Failed to fetch stock data' });
        }
        
        // Read the generated file
        if (fs.existsSync(dataFile)) {
          const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
          return res.json(data);
        } else {
          return res.status(500).json({ message: 'Failed to generate stock data file' });
        }
      });
    }
  } catch (error) {
    console.error('Stock data error:', error);
    res.status(500).json({ message: 'Server error while fetching stock data' });
  }
});

// @route   GET /api/stocks/search/:query
// @desc    Search for stocks
// @access  Public
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    
    // Validate query
    if (!query || query.length < 1) {
      return res.status(400).json({ message: 'Invalid search query' });
    }
    
    // This would typically call an API to search for stocks
    // For now, we'll return a mock response with common stocks
    const mockResults = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
      { symbol: 'META', name: 'Meta Platforms, Inc.', exchange: 'NASDAQ' },
      { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
      { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE' }
    ].filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ results: mockResults });
  } catch (error) {
    console.error('Stock search error:', error);
    res.status(500).json({ message: 'Server error while searching for stocks' });
  }
});

// @route   GET /api/stocks/popular
// @desc    Get popular stocks
// @access  Public
router.get('/popular', (req, res) => {
  try {
    // Return a list of popular stocks
    const popularStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
      { symbol: 'META', name: 'Meta Platforms, Inc.', exchange: 'NASDAQ' }
    ];
    
    res.json({ results: popularStocks });
  } catch (error) {
    console.error('Popular stocks error:', error);
    res.status(500).json({ message: 'Server error while fetching popular stocks' });
  }
});

module.exports = router;
