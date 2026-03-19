import { Leitura, Consumidor, Usuario } from '../models';
import { Op } from 'sequelize';
import { MENSAGENS_ERRO } from '../utils/constantes';

class LeituraService {
  async criar(dados: any) {
    const consumidor = await Consumidor.findByPk(dados.consumidorId);
    if (!consumidor) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor'));

    if (dados.leituristaId) {
      const leiturista = await Usuario.findByPk(dados.leituristaId);
      if (!leiturista) throw new Error('Leiturista não encontrado');
    }

    const ultimaLeitura = await Leitura.findOne({
      where: { consumidorId: dados.consumidorId },
      order: [['dataLeitura', 'DESC']]
    });

    if (ultimaLeitura && new Date(dados.dataLeitura) <= new Date(ultimaLeitura.dataLeitura)) {
      throw new Error('Data da leitura deve ser posterior à última leitura');
    }

    const leitura = await Leitura.create(dados);
    return leitura.reload({ include: ['consumidor', 'leiturista'] });
  }

  // Renomeado de listarPorConsumidor para buscarPorConsumidor (padrão do controller)
  async buscarPorConsumidor(consumidorId: number) {
    return Leitura.findAll({
      where: { consumidorId },
      include: ['consumidor', 'leiturista'],
      order: [['dataLeitura', 'DESC']]
    });
  }

  async buscarUltimaPorConsumidor(consumidorId: number) {
    const leitura = await Leitura.findOne({
      where: { consumidorId },
      order: [['dataLeitura', 'DESC']]
    });
    if (!leitura) throw new Error('Nenhuma leitura encontrada para este consumidor');
    return leitura;
  }

  async buscarPorPeriodo(dataInicio: string, dataFim: string) {
    return Leitura.findAll({
      where: {
        dataLeitura: { [Op.between]: [dataInicio, dataFim] }
      },
      include: ['consumidor', 'leiturista'],
      order: [['dataLeitura', 'DESC']]
    });
  }

  // Renomeado de listarNaoFaturadas para buscarNaoFaturadas (padrão do controller)
  async buscarNaoFaturadas() {
    return Leitura.findAll({
      where: { faturada: false },
      include: ['consumidor']
    });
  }

  async buscarPorId(id: number) {
    const leitura = await Leitura.findByPk(id, {
      include: ['consumidor', 'leiturista']
    });
    if (!leitura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Leitura'));
    return leitura;
  }

  async atualizar(id: number, dados: any) {
    const leitura = await Leitura.findByPk(id);
    if (!leitura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Leitura'));
    if (leitura.faturada) throw new Error('Não é possível atualizar uma leitura já faturada');

    if (dados.leituraAtual && dados.leituraAtual !== leitura.leituraAtual) {
      const leituraAnterior = await Leitura.findOne({
        where: {
          consumidorId: leitura.consumidorId,
          dataLeitura: { [Op.lt]: leitura.dataLeitura }
        },
        order: [['dataLeitura', 'DESC']]
      });
      if (leituraAnterior && dados.leituraAtual < leituraAnterior.leituraAtual) {
        throw new Error(MENSAGENS_ERRO.LEITURA_INVALIDA);
      }
      dados.leituraAnterior = leituraAnterior ? leituraAnterior.leituraAtual : 0;
      dados.consumo = dados.leituraAtual - dados.leituraAnterior;
    }

    await leitura.update(dados);
    return leitura.reload({ include: ['consumidor', 'leiturista'] });
  }

  async excluir(id: number) {
    const leitura = await Leitura.findByPk(id);
    if (!leitura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Leitura'));
    if (leitura.faturada) throw new Error('Não é possível excluir uma leitura já faturada');
    await leitura.destroy();
  }

  async marcarComoFaturadas(ids: number[]) {
    await Leitura.update(
      { faturada: true },
      { where: { id: ids } }
    );
  }
}

export default new LeituraService();