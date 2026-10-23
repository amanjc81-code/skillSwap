import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

// Copy to 404.html for any fallback routing
fs.writeFileSync(path.join(distDir, '404.html'), htmlContent, 'utf-8');

// Route list
const routes = [
  'onboarding',
  'signup',
  'login',
  'dashboard',
  'match',
  'profile',
  'swap-request',
  'requests',
  'chat',
  'schedule-session',
  'sessions',
  'rating',
  'create-circle',
  'circle-suggestions',
  'circle-details',
  'circle-chat',
  'circle-sessions',
  'notifications',
  'settings'
];

routes.forEach((route) => {
  const routeFolder = path.join(distDir, route);
  if (!fs.existsSync(routeFolder)) {
    fs.mkdirSync(routeFolder, { recursive: true });
  }
  fs.writeFileSync(path.join(routeFolder, 'index.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(distDir, `${route}.html`), htmlContent, 'utf-8');
});

console.log(`[copy-routes] Generated production SPA fallbacks for ${routes.length} routes in dist/`);
