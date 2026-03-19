import { Router } from 'express';
import PagamentoController from '../controllers/PagamentoController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { processarPagamentoSchema } from '../validations/pagamentoValidation';

const router = Router();

// Rotas de leitura (acessíveis por ADMIN, CAIXA e CONSUMIDOR para suas próprias faturas)
router.get('/', authorizeRoles('ADMIN', 'CAIXA'), PagamentoController.index);
router.get('/fatura/:faturaId', authorizeRoles('ADMIN', 'CAIXA', 'CONSUMIDOR'), PagamentoController.showPorFatura);
router.get('/:id', authorizeRoles('ADMIN', 'CAIXA', 'CONSUMIDOR'), PagamentoController.show);

// Processar pagamento (ADMIN ou CAIXA)
router.post('/', authorizeRoles('ADMIN', 'CAIXA'), validate(processarPagamentoSchema), PagamentoController.processar);

// Estorno (apenas ADMIN)
router.post('/:id/estornar', authorizeRoles('ADMIN'), PagamentoController.estornar);

export default router;