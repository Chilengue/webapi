import { Router } from 'express';
import authRoutes from './authRoutes';
import consumidorRoutes from './consumidorRoutes';
import funcionarioRoutes from './funcionarioRoutes';
import faturaRoutes from './faturaRoutes';
import leituraRoutes from './leituraRoutes';
import pagamentoRoutes from './pagamentoRoutes';
import dashboardRoutes from './dashboardRoutes';
import usuarioRoutes from './usuarioRoutes';          // <-- importe aqui
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/consumidores', authMiddleware, consumidorRoutes);
router.use('/funcionarios', authMiddleware, funcionarioRoutes);
router.use('/faturas', authMiddleware, faturaRoutes);
router.use('/leituras', authMiddleware, leituraRoutes);
router.use('/pagamentos', authMiddleware, pagamentoRoutes);
router.use('/dashboard', authMiddleware, dashboardRoutes);
router.use('/usuarios', authMiddleware, usuarioRoutes);  // <-- adicione esta linha

export default router;