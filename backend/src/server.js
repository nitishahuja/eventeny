import { createApp } from './app.js';

export function startServer() {
  const port = process.env.PORT || 4000;
  const app = createApp();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend API listening on 0.0.0.0:${port}`);
  });
}

// If this file is executed directly (e.g. `node src/server.js`), start the server.
const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isDirectRun) {
  startServer();
}

