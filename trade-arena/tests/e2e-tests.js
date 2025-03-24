// End-to-end tests for Trade Arena platform
const puppeteer = require('puppeteer');

const e2eTests = {
  // Setup browser and page
  setup: async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    return { browser, page };
  },
  
  // Teardown browser
  teardown: async (browser) => {
    await browser.close();
  },
  
  // Test user flow: registration, login, create trade, view leaderboard
  testUserFlow: async () => {
    console.log('Testing user flow...');
    const { browser, page } = await e2eTests.setup();
    
    try {
      // Visit homepage
      await page.goto('http://localhost:3000');
      await page.waitForSelector('header');
      
      // Go to registration page
      await page.click('a[href="/register"]');
      await page.waitForSelector('form');
      
      // Fill registration form
      const username = 'testuser' + Date.now();
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', 'Password123!');
      await page.type('input[name="displayName"]', 'Test User');
      await page.click('button[type="submit"]');
      
      // Should redirect to login page
      await page.waitForSelector('form');
      
      // Login
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await page.waitForSelector('.dashboard-container');
      
      // Go to trade log
      await page.click('a[href="/trade-log"]');
      await page.waitForSelector('.trade-log-container');
      
      // Create a trade
      await page.click('button:contains("Add Trade")');
      await page.waitForSelector('form');
      await page.select('select[name="tradeType"]', 'buy');
      await page.select('select[name="assetType"]', 'stock');
      await page.type('input[name="symbol"]', 'AAPL');
      await page.type('input[name="entryPrice"]', '150.25');
      await page.type('input[name="exitPrice"]', '155.75');
      await page.type('input[name="quantity"]', '10');
      await page.type('input[name="stopLoss"]', '145.00');
      await page.type('input[name="takeProfit"]', '160.00');
      await page.type('textarea[name="notes"]', 'Test trade for Apple stock');
      await page.click('button[type="submit"]');
      
      // Should show trade in list
      await page.waitForSelector('.trade-item');
      
      // Go to leaderboard
      await page.click('a[href="/leaderboard"]');
      await page.waitForSelector('.leaderboard-container');
      
      // Check different timeframes
      await page.click('button:contains("Weekly")');
      await page.waitForSelector('.leaderboard-table');
      await page.click('button:contains("Monthly")');
      await page.waitForSelector('.leaderboard-table');
      await page.click('button:contains("All-time")');
      await page.waitForSelector('.leaderboard-table');
      
      // Go to message board
      await page.click('a[href="/message-board"]');
      await page.waitForSelector('.message-board-container');
      
      // Post a message
      await page.type('textarea[name="messageContent"]', 'This is a test message');
      await page.click('button:contains("Post")');
      
      // Should show message in list
      await page.waitForSelector('.message-item');
      
      // Go to journal
      await page.click('a[href="/journal"]');
      await page.waitForSelector('.journal-container');
      
      // Create journal entry
      await page.click('button:contains("New Entry")');
      await page.waitForSelector('form');
      await page.type('textarea[name="content"]', 'This is a test journal entry');
      await page.click('button[type="submit"]');
      
      // Should show entry in list
      await page.waitForSelector('.journal-entry');
      
      // Go to market data
      await page.click('a[href="/market-data"]');
      await page.waitForSelector('.market-data-container');
      
      // Search for a stock
      await page.type('input[placeholder="Search for stocks..."]', 'AAPL');
      await page.waitForSelector('.search-results');
      await page.click('.search-result-item');
      
      // Should show stock chart
      await page.waitForSelector('.chart-container');
      
      // Logout
      await page.click('button:contains("Logout")');
      
      // Should redirect to homepage
      await page.waitForSelector('a[href="/login"]');
      
      console.log('User flow test completed successfully');
    } catch (error) {
      console.error('User flow test failed:', error);
    } finally {
      await e2eTests.teardown(browser);
    }
  },
  
  // Test admin flow: login, view users, adjust ranking
  testAdminFlow: async () => {
    console.log('Testing admin flow...');
    const { browser, page } = await e2eTests.setup();
    
    try {
      // Visit admin login page
      await page.goto('http://localhost:3000/admin/login');
      await page.waitForSelector('form');
      
      // Login as admin
      await page.type('input[name="username"]', 'admin');
      await page.type('input[name="password"]', 'AdminPassword123!');
      await page.click('button[type="submit"]');
      
      // Should redirect to admin dashboard
      await page.waitForSelector('.admin-dashboard-container');
      
      // Check stats
      await page.waitForSelector('.stats-container');
      
      // View users tab
      await page.click('button:contains("Users")');
      await page.waitForSelector('table');
      
      // Edit a user
      await page.click('button:contains("Edit")');
      await page.waitForSelector('form');
      await page.click('button:contains("Cancel")');
      
      // View rankings tab
      await page.click('button:contains("Rankings")');
      await page.waitForSelector('table');
      
      // Adjust a ranking
      await page.click('button:contains("Adjust")');
      await page.waitForSelector('form');
      await page.click('button:contains("Cancel")');
      
      // Logout
      await page.click('button:contains("Logout")');
      
      // Should redirect to admin login page
      await page.waitForSelector('form');
      
      console.log('Admin flow test completed successfully');
    } catch (error) {
      console.error('Admin flow test failed:', error);
    } finally {
      await e2eTests.teardown(browser);
    }
  },
  
  // Test responsive design
  testResponsiveDesign: async () => {
    console.log('Testing responsive design...');
    
    // Define viewport sizes to test
    const viewports = [
      { width: 375, height: 667, name: 'Mobile (iPhone 8)' },
      { width: 414, height: 896, name: 'Mobile (iPhone 11)' },
      { width: 768, height: 1024, name: 'Tablet (iPad)' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 1280, height: 800, name: 'Laptop' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    // Define pages to test
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/login', name: 'Login Page' },
      { url: '/register', name: 'Register Page' },
      { url: '/leaderboard', name: 'Leaderboard Page' },
      { url: '/message-board', name: 'Message Board Page' },
      { url: '/market-data', name: 'Market Data Page' }
    ];
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      for (const viewport of viewports) {
        console.log(`Testing on ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        const page = await browser.newPage();
        await page.setViewport({
          width: viewport.width,
          height: viewport.height
        });
        
        for (const pageToTest of pages) {
          console.log(`  Testing ${pageToTest.name} (${pageToTest.url})`);
          
          await page.goto(`http://localhost:3000${pageToTest.url}`);
          await page.waitForSelector('body');
          
          // Take a screenshot for visual verification
          await page.screenshot({
            path: `./tests/screenshots/${viewport.name.replace(/\s+/g, '-').toLowerCase()}-${pageToTest.name.replace(/\s+/g, '-').toLowerCase()}.png`
          });
          
          // Check for any layout issues (horizontal scrollbar)
          const hasHorizontalScrollbar = await page.evaluate(() => {
            return document.body.scrollWidth > window.innerWidth;
          });
          
          if (hasHorizontalScrollbar) {
            console.warn(`    WARNING: Horizontal scrollbar detected on ${pageToTest.name} at ${viewport.name} size`);
          }
        }
        
        await page.close();
      }
      
      console.log('Responsive design tests completed');
    } catch (error) {
      console.error('Responsive design test failed:', error);
    } finally {
      await browser.close();
    }
  },
  
  // Run all tests
  runAllTests: async () => {
    console.log('Running all end-to-end tests for Trade Arena platform...');
    
    // Create screenshots directory if it doesn't exist
    const fs = require('fs');
    const dir = './tests/screenshots';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await e2eTests.testUserFlow();
    await e2eTests.testAdminFlow();
    await e2eTests.testResponsiveDesign();
    
    console.log('All end-to-end tests completed');
  }
};

// Export test functions
module.exports = e2eTests;

// Run all tests if executed directly
if (require.main === module) {
  e2eTests.runAllTests();
}
