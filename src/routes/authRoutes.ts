import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.registrar);
router.get('/me', authMiddleware, AuthController.me);
router.get('/perfil', authMiddleware, AuthController.perfil);
router.post('/alterar-senha', authMiddleware, AuthController.alterarSenha);

export default router;