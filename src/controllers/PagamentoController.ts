import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import PagamentoService from '../services/PagamentoService';

class PagamentoController {
  async processar(req: Request, res: Response): Promise<Response> {
    try {
      const caixaId = req.usuarioId!;
      const dados = { ...req.body, caixaId };
      const pagamento = await PagamentoService.processar(dados);
      return res.status(StatusCodes.CREATED).json(pagamento);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;
      const resultado = await PagamentoService.listar(pagina, limite);
      return res.status(StatusCodes.OK).json(resultado);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const pagamento = await PagamentoService.buscarPorId(Number(id));
      return res.status(StatusCodes.OK).json(pagamento);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async showPorFatura(req: Request, res: Response): Promise<Response> {
    try {
      const { faturaId } = req.params;
      const pagamentos = await PagamentoService.buscarPorFatura(Number(faturaId));
      return res.status(StatusCodes.OK).json(pagamentos);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async estornar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const caixaId = req.usuarioId!;
      const { motivo } = req.body;
      const pagamento = await PagamentoService.estornar(Number(id), caixaId, motivo);
      return res.status(StatusCodes.OK).json(pagamento);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }
}

export default new PagamentoController();