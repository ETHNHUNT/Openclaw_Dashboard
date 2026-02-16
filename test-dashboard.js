// test-dashboard.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  console.log('Testing OpenClaw Dashboard...');

  // 1. Navigate to dashboard (assuming running locally on default Vite port or deployed)
  // Let's assume we start it first.
  const DASHBOARD_URL = 'http://localhost:5173'; // Default Vite dev port
  
  try {
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle2' });
    console.log('✅ Dashboard loaded');
  } catch (e) {
    console.error('❌ Dashboard load failed:', e.message);
    process.exit(1);
  }

  // 2. Check for key components
  const selectors = [
    'h2', // Section headers
    'input[placeholder="Search tasks..."]', // Task search
    'button', // Buttons
  ];

  for (const selector of selectors) {
    const el = await page.$(selector);
    if (el) {
      console.log(`✅ Element found: ${selector}`);
    } else {
      console.error(`❌ Element missing: ${selector}`);
    }
  }

  // 3. Test Task Creation
  // Click "NEW TASK" button (assuming text content or aria-label)
  // This might be tricky without specific test IDs, but let's try finding by text.
  
  // 4. Verify API calls (mock or check network tab logic if possible)
  // Puppeteer can intercept requests.
  
  await browser.close();
})();
