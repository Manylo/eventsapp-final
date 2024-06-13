import { ChargilyClient } from '@chargily/chargily-pay';

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_SECRET_KEY!,
  mode: 'test', // Change to 'live' for production
});

export default client;
