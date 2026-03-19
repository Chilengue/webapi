import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LeituraService from '../services/LeituraService';

class LeituraController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const leitura = await LeituraService.criar(req.body);
      return res.status(StatusCodes.CREATED).json(leitura);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async showPorConsumidor(req: Request, res: Response): Promise<Response> {
    try {
      const { consumidorId } = req.params;
      const leituras = await LeituraService.buscarPorConsumidor(Number(consumidorId));
      return res.status(StatusCodes.OK).json(leituras);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async ultima(req: Request, res: Response): Promise<Response> {
    try {
      const { consumidorId } = req.params;
      const leitura = await LeituraService.buscarUltimaPorConsumidor(Number(consumidorId));
      return res.status(StatusCodes.OK).json(leitura);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async naoFaturadas(req: Request, res: Response): Promise<Response> {
    try {
      const leituras = await LeituraService.buscarNaoFaturadas();
      return res.status(StatusCodes.OK).json(leituras);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  // Método show adicionado para buscar por ID
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const leitura = await LeituraService.buscarPorId(Number(id));
      return res.status(StatusCodes.OK).json(leitura);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const leitura = await LeituraService.atualizar(Number(id), req.body);
      return res.status(StatusCodes.OK).json(leitura);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await LeituraService.excluir(Number(id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }
}

export default new LeituraController();