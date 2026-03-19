import jwt from 'jsonwebtoken';
import { Usuario, Papel } from '../models';
import authConfig from '../config/auth';
import { compararSenha, hashSenha } from '../utils/helpers';
import { MENSAGENS_ERRO } from '../utils/constantes';

class AuthService {
  async autenticar(nomeUsuario: string, senha: string) {
    const usuario = await Usuario.findOne({
      where: { nomeUsuario },
      include: [Papel]
    });

    if (!usuario) throw new Error(MENSAGENS_ERRO.CREDENCIAIS_INVALIDAS);

    const senhaValida = await compararSenha(senha, usuario.senha);
    if (!senhaValida) throw new Error(MENSAGENS_ERRO.CREDENCIAIS_INVALIDAS);

    const payload = {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      papeis: usuario.papeis?.map(p => p.nome) || []
    };

    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: authConfig.expiresIn
    } as any);

    const usuarioSemSenha = { ...usuario.toJSON(), senha: undefined };
    return { usuario: usuarioSemSenha, token };
  }

  async buscarPorId(id: number) {
    const usuario = await Usuario.findByPk(id, {
      include: [Papel],
      attributes: { exclude: ['senha'] }
    });
    if (!usuario) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário'));
    return usuario;
  }

  // Registro público de usuário
  async criarUsuario(dados: { nome: string; nomeUsuario: string; senha: string }) {
    const { nome, nomeUsuario, senha } = dados;

    // Verificar duplicidade por nomeUsuario
    const usuarioExistente = await Usuario.findOne({ where: { nomeUsuario } });
    if (usuarioExistente) {
      throw new Error(MENSAGENS_ERRO.DUPLICADO('nome de usuário'));
    }

    // Criar usuário (senha será hasheada pelo hook @BeforeCreate)
    const novoUsuario = await Usuario.create({
      nome,
      nomeUsuario,
      senha
    });

    // Associar papel padrão 'USER'
    const papelPadrao = await Papel.findOne({ where: { nome: 'USER' } });
    if (!papelPadrao) {
      throw new Error('Papel padrão USER não encontrado. Execute a seed.');
    }
    await novoUsuario.$add('papeis', papelPadrao);

    // Recarregar com associações e remover senha
    const usuarioCriado = await Usuario.findByPk(novoUsuario.id, {
      include: [Papel],
      attributes: { exclude: ['senha'] }
    });

    return usuarioCriado;
  }

  async buscarPerfilCompleto(id: number) {
    // Se precisar de mais associações, inclua aqui
    return this.buscarPorId(id);
  }

  async alterarSenha(id: number, senhaAtual: string, novaSenha: string) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário'));

    const senhaValida = await compararSenha(senhaAtual, usuario.senha);
    if (!senhaValida) throw new Error('Senha atual incorreta');

    usuario.senha = await hashSenha(novaSenha);
    await usuario.save();
  }
}

export default new AuthService();