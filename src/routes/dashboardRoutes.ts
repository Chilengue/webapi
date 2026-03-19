import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Acessível por ADMIN, CAIXA e MEDIADOR (talvez apenas ADMIN e CAIXA, mas deixei MEDIADOR também)
router.get('/resumo', authorizeRoles('ADMIN', 'CAIXA', 'MEDIADOR'), DashboardController.resumo);
router.get('/receita/metodo', authorizeRoles('ADMIN', 'CAIXA'), DashboardController.receitaPorMetodo);
router.get('/receita/mensal/:ano', authorizeRoles('ADMIN', 'CAIXA'), DashboardController.receitaMensal);

export default router;