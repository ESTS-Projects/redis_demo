const API_PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

import express from 'express';
import { createClient } from 'redis';

(async () => {
  const app = express();
  const client = createClient({ url: REDIS_URL });

  client.on("error", (err) => {
    console.log("Error " + err);
  });

  app.get('/', async (req, res) => {
    try {
      const count = await client.incr('counter');
      res.send(`Counter: ${count}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error incrementing counter');
    }
  });

  app.listen(API_PORT, async () => {
    await client.connect();
    console.log(`App listening on port ${API_PORT}`);
  });
})();



