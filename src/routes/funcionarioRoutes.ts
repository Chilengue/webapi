import { Router } from 'express';
import FuncionarioController from '../controllers/FuncionarioController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { criarFuncionarioSchema, atualizarFuncionarioSchema } from '../validations/funcionarioValidation';

const router = Router();

// Apenas ADMIN pode gerenciar funcionários
router.get('/', authorizeRoles('ADMIN'), FuncionarioController.index);
router.get('/:id', authorizeRoles('ADMIN'), FuncionarioController.show);
router.post('/', authorizeRoles('ADMIN'), validate(criarFuncionarioSchema), FuncionarioController.store);
router.put('/:id', authorizeRoles('ADMIN'), validate(atualizarFuncionarioSchema), FuncionarioController.update);
router.delete('/:id', authorizeRoles('ADMIN'), FuncionarioController.delete);

export default router;