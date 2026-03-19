import { Funcionario } from '../models';
import { MENSAGENS_ERRO } from '../utils/constantes';

class FuncionarioService {
  async criar(dados: any) {
    // Pode adicionar validação de unicidade se necessário
    return Funcionario.create(dados);
  }

  async listar() {
    return Funcionario.findAll({ order: [['createdAt', 'DESC']] });
  }

  async buscarPorId(id: number) {
    const funcionario = await Funcionario.findByPk(id);
    if (!funcionario) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Funcionário'));
    return funcionario;
  }

  async atualizar(id: number, dados: any) {
    const funcionario = await Funcionario.findByPk(id);
    if (!funcionario) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Funcionário'));
    return funcionario.update(dados);
  }

  async excluir(id: number) {
    const funcionario = await Funcionario.findByPk(id);
    if (!funcionario) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Funcionário'));
    await funcionario.destroy(); // exclusão física
  }
}

export default new FuncionarioService();