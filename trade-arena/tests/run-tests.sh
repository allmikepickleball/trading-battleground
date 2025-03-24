#!/bin/bash

# Trade Arena Platform Test Script
# This script runs all tests for the Trade Arena platform

echo "=== Trade Arena Platform Test Script ==="
echo "Starting tests at $(date)"
echo ""

# Create test directories if they don't exist
mkdir -p ./tests/screenshots
mkdir -p ./tests/reports

# Install test dependencies if needed
echo "Checking test dependencies..."
npm list puppeteer || npm install --save-dev puppeteer
npm list jest || npm install --save-dev jest

# Run functional tests
echo ""
echo "=== Running Functional Tests ==="
node ./tests/functional-tests.js | tee ./tests/reports/functional-tests.log
echo ""

# Run end-to-end tests if server is running
echo "=== Running End-to-End Tests ==="
if curl -s http://localhost:3000 > /dev/null; then
  node ./tests/e2e-tests.js | tee ./tests/reports/e2e-tests.log
else
  echo "Server is not running at http://localhost:3000. Skipping E2E tests."
  echo "To run E2E tests, start the server with 'npm start' and run this script again."
fi
echo ""

# Check for any errors in the logs
echo "=== Test Results Summary ==="
if grep -q "failed" ./tests/reports/functional-tests.log; then
  echo "❌ Some functional tests failed. Check ./tests/reports/functional-tests.log for details."
else
  echo "✅ All functional tests passed."
fi

if [ -f ./tests/reports/e2e-tests.log ]; then
  if grep -q "failed" ./tests/reports/e2e-tests.log; then
    echo "❌ Some end-to-end tests failed. Check ./tests/reports/e2e-tests.log for details."
  else
    echo "✅ All end-to-end tests passed."
  fi
fi

echo ""
echo "Tests completed at $(date)"
echo "=== End of Test Script ==="
