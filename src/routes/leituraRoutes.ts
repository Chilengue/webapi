import { Router } from 'express';
import LeituraController from '../controllers/LeituraController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { criarLeituraSchema, atualizarLeituraSchema } from '../validations/leituraValidation';

const router = Router();

router.get('/consumidor/:consumidorId', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR', 'CONSUMIDOR'), LeituraController.showPorConsumidor);
router.get('/consumidor/:consumidorId/ultima', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR', 'CONSUMIDOR'), LeituraController.ultima);
router.get('/nao-faturadas', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR'), LeituraController.naoFaturadas);
router.get('/:id', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR'), LeituraController.show);

router.post('/', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR'), validate(criarLeituraSchema), LeituraController.store);
router.put('/:id', authorizeRoles('ADMIN'), validate(atualizarLeituraSchema), LeituraController.update);
router.delete('/:id', authorizeRoles('ADMIN'), LeituraController.delete);

export default router;