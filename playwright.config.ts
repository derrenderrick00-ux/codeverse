import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const suppliedBrowser=process.env.CODEVERSE_CHROMIUM_PATH;
if(suppliedBrowser&&!existsSync(suppliedBrowser))throw new Error(`Chromium executable not found: ${suppliedBrowser}. Unset CODEVERSE_CHROMIUM_PATH and run: npx playwright install chromium`);
export default defineConfig({
 testDir:'./e2e',timeout:30000,
 use:{baseURL:'http://127.0.0.1:5173',trace:'retain-on-failure',screenshot:'only-on-failure',
  ...(suppliedBrowser?{launchOptions:{executablePath:suppliedBrowser}}:{})},
 projects:[{name:'chromium',use:{browserName:'chromium'}}],
 webServer:{command:'npm run dev',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:60000}
});
