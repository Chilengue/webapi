import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/AuthService';

interface RegistrarRequest {
  nome?: string;
  nomeCompleto?: string;
  nomeUsuario: string;
  senha: string;
}

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { nomeUsuario, senha } = req.body;
      const resultado = await AuthService.autenticar(nomeUsuario, senha);
      return res.status(StatusCodes.OK).json(resultado);
    } catch (error: any) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ erro: error.message });
    }
  }

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const usuarioId = req.usuarioId!;
      const usuario = await AuthService.buscarPorId(usuarioId);
      return res.status(StatusCodes.OK).json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async registrar(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body as RegistrarRequest;
      const { nomeUsuario, senha } = body;
      const nome = body.nome || body.nomeCompleto;

      if (!nome || !nomeUsuario || !senha) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          erro: 'Campos obrigatórios: nome (ou nomeCompleto), nomeUsuario e senha'
        });
      }

      const novoUsuario = await AuthService.criarUsuario({
        nome,
        nomeUsuario,
        senha
      });

      return res.status(StatusCodes.CREATED).json(novoUsuario);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async perfil(req: Request, res: Response): Promise<Response> {
    try {
      const usuarioId = req.usuarioId!;
      const usuario = await AuthService.buscarPerfilCompleto(usuarioId);
      return res.status(StatusCodes.OK).json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async alterarSenha(req: Request, res: Response): Promise<Response> {
    try {
      const usuarioId = req.usuarioId!;
      const { senhaAtual, novaSenha } = req.body;
      await AuthService.alterarSenha(usuarioId, senhaAtual, novaSenha);
      return res.status(StatusCodes.OK).json({ mensagem: 'Senha alterada com sucesso' });
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }
}

export default new AuthController();