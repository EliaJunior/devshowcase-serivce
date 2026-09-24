import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 DevShowcase Service running on http://localhost:${env.PORT}`);
});

export default server;
