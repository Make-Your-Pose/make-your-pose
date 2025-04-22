import { IttyRouter } from 'itty-router';

const router = IttyRouter();

router.get('/api/', () => Response.json({ name: 'Hello World!' }));

export default router; // see note below
