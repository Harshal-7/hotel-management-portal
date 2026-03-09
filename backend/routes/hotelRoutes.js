import express from 'express';
import * as hotelController from '../controllers/hotelController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', hotelController.list);
router.get('/:id', hotelController.getById);
router.post('/', hotelController.create);
router.put('/:id', hotelController.update);
router.delete('/:id', hotelController.remove);

export default router;
