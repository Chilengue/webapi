import { Router } from 'express';
import ConsumidorController from '../controllers/ConsumidorController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { criarConsumidorSchema, atualizarConsumidorSchema } from '../validations/consumidorValidation'

const router = Router();

// Rotas de leitura
router.get('/', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR'), ConsumidorController.index);
router.get('/:id', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR', 'CONSUMIDOR'), ConsumidorController.show);
router.get('/codigo/:codigoFatura', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR', 'CONSUMIDOR'), ConsumidorController.showPorCodigoFatura);

// Rotas de escrita
router.post('/', authorizeRoles('ADMIN', 'MEDIADOR'), validate(criarConsumidorSchema), ConsumidorController.store);
router.put('/:id', authorizeRoles('ADMIN', 'MEDIADOR'), validate(atualizarConsumidorSchema), ConsumidorController.update);
router.delete('/:id', authorizeRoles('ADMIN'), ConsumidorController.delete);

// Ação específica: resetar senha
router.post('/:codigoFatura/reset-senha', authorizeRoles('ADMIN', 'CAIXA'), ConsumidorController.resetSenha);

export default router; 

