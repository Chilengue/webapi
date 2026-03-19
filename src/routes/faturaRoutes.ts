import { Router } from 'express';
import FaturaController from '../controllers/FaturaController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { gerarFaturaSchema, atualizarFaturaSchema } from '../validations/faturaValidation';

const router = Router();

// Rotas de leitura (acessíveis por ADMIN, CAIXA e CONSUMIDOR para suas próprias faturas)
router.get('/', authorizeRoles('ADMIN', 'CAIXA'), FaturaController.index);
router.get('/pendentes', authorizeRoles('ADMIN', 'CAIXA'), FaturaController.pendentes);
router.get('/vencidas', authorizeRoles('ADMIN', 'CAIXA'), FaturaController.vencidas);
router.get('/:id', authorizeRoles('ADMIN', 'CAIXA', 'CONSUMIDOR'), FaturaController.show);
router.get('/numero/:numero', authorizeRoles('ADMIN', 'CAIXA', 'CONSUMIDOR'), FaturaController.showPorNumero);
router.get('/consumidor/:consumidorId', authorizeRoles('ADMIN', 'CAIXA', 'CONSUMIDOR'), FaturaController.showPorConsumidor);

// Geração de faturas (ADMIN ou CAIXA)
router.post('/gerar/:consumidorId', authorizeRoles('ADMIN', 'CAIXA'), validate(gerarFaturaSchema), FaturaController.gerarManual);
router.post('/gerar-mensal', authorizeRoles('ADMIN'), FaturaController.gerarMensal);

// Atualização (apenas ADMIN)
router.patch('/:id', authorizeRoles('ADMIN'), validate(atualizarFaturaSchema), FaturaController.update);

export default router;