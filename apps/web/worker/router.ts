import {
  IttyRouter,
  type RequestHandler as IRequestHandler,
  type IRequest,
} from 'itty-router';
import { getCategoryRankings } from './rankings/get-category-rankings';
import { addCategoryRanking } from './rankings/add-category-ranking';

const router = IttyRouter();

router.get('/api/rankings/:category', getCategoryRankings);
router.post('/api/rankings/:category/scores', addCategoryRanking);

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router; // see note below

export type RequestHandler = IRequestHandler<IRequest, [Cloudflare.Env]>;
