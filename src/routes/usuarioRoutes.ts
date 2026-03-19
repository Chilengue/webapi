import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../validations/usuarioValidation';

const router = Router();

// Todas as rotas de usuário são acessíveis apenas por ADMIN
router.get('/', authorizeRoles('ADMIN'), UsuarioController.index);
router.get('/buscar', authorizeRoles('ADMIN'), UsuarioController.buscarPorNomeUsuario);
router.get('/:id', authorizeRoles('ADMIN'), UsuarioController.show);
router.post('/', authorizeRoles('ADMIN'), validate(criarUsuarioSchema), UsuarioController.store);
router.put('/:id', authorizeRoles('ADMIN'), validate(atualizarUsuarioSchema), UsuarioController.update);
router.delete('/:id', authorizeRoles('ADMIN'), UsuarioController.delete);

export default router;