import { env } from './config/env';
import { connectDb } from './config/db';
import { createApp } from './app';

async function main() {
  await connectDb();
  console.log('MongoDB connected');

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
