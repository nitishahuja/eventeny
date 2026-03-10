import { createApp } from './app.js';

export function startServer() {
  const port = process.env.PORT || 4000;
  const app = createApp();

  app.listen(port, () => {
    console.log(`Backend API listening on http://localhost:${port}`);
  });
}

