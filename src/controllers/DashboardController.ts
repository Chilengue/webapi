import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import DashboardService from '../services/DashboardService';

class DashboardController {
  async resumo(req: Request, res: Response): Promise<Response> {
    try {
      const dados = await DashboardService.resumo();
      return res.status(StatusCodes.OK).json(dados);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async receitaPorMetodo(req: Request, res: Response): Promise<Response> {
    try {
      const { dataInicio, dataFim } = req.query;
      if (!dataInicio || !dataFim) {
        return res.status(StatusCodes.BAD_REQUEST).json({ erro: 'dataInicio e dataFim são obrigatórios' });
      }
      const dados = await DashboardService.receitaPorMetodoPagamento(dataInicio as string, dataFim as string);
      return res.status(StatusCodes.OK).json(dados);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async receitaMensal(req: Request, res: Response): Promise<Response> {
    try {
      const { ano } = req.params;
      const dados = await DashboardService.receitaMensal(Number(ano));
      return res.status(StatusCodes.OK).json(dados);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }
}

export default new DashboardController();