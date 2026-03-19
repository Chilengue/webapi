import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FaturaService from '../services/FaturaService';

class FaturaController {
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;
      const status = req.query.status as string;
      const resultado = await FaturaService.listar(pagina, limite, status);
      return res.status(StatusCodes.OK).json(resultado);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const fatura = await FaturaService.buscarPorId(Number(id));
      return res.status(StatusCodes.OK).json(fatura);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async showPorNumero(req: Request, res: Response): Promise<Response> {
    try {
      const { numero } = req.params;
      const fatura = await FaturaService.buscarPorNumero(numero);
      return res.status(StatusCodes.OK).json(fatura);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async showPorConsumidor(req: Request, res: Response): Promise<Response> {
    try {
      const { consumidorId } = req.params;
      const faturas = await FaturaService.buscarPorConsumidor(Number(consumidorId));
      return res.status(StatusCodes.OK).json(faturas);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async pendentes(req: Request, res: Response): Promise<Response> {
    try {
      const faturas = await FaturaService.buscarPorStatus('PENDENTE');
      return res.status(StatusCodes.OK).json(faturas);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async vencidas(req: Request, res: Response): Promise<Response> {
    try {
      const faturas = await FaturaService.buscarVencidas();
      return res.status(StatusCodes.OK).json(faturas);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async gerarManual(req: Request, res: Response): Promise<Response> {
    try {
      const { consumidorId } = req.params;
      const { leituraAtual, dataLeitura } = req.body;
      const fatura = await FaturaService.gerarManual(Number(consumidorId), leituraAtual, dataLeitura);
      return res.status(StatusCodes.CREATED).json(fatura);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async gerarMensal(req: Request, res: Response): Promise<Response> {
    try {
      // Este método seria implementado com lógica agendada ou manual
      // Por enquanto, apenas uma resposta simulada
      return res.status(StatusCodes.OK).json({ mensagem: 'Geração mensal de faturas iniciada' });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const fatura = await FaturaService.atualizarStatus(Number(id), status);
      return res.status(StatusCodes.OK).json(fatura);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }
}

export default new FaturaController();