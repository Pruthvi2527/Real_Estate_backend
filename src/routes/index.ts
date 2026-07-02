import { Router } from 'express';
import { sendOk } from '../utils/response';

const router = Router();

router.get('/health', (_req, res) => {
  sendOk(res, 'Server is running');
});

export default router;
