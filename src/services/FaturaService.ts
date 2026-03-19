import { Fatura, Consumidor, Leitura, Pagamento } from '../models';
import { Op } from 'sequelize';
import { DEFAULTS, STATUS_FATURA, MENSAGENS_ERRO } from '../utils/constantes';
import { calcularValoresFatura } from '../utils/helpers';
import sequelize from '../config/database';

class FaturaService {
  async gerarDeLeitura(leituraId: number) {
    const leitura = await Leitura.findByPk(leituraId, {
      include: ['consumidor']
    });
    if (!leitura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Leitura'));
    if (leitura.faturada) throw new Error('Leitura já faturada');

    const consumidor = leitura.consumidor;
    if (!consumidor) throw new Error('Consumidor não encontrado');

    const { subtotal, valorImposto, valorTotal } = calcularValoresFatura(
      leitura.consumo,
      DEFAULTS.CONSUMO_MINIMO,
      DEFAULTS.VALOR_MINIMO,
      DEFAULTS.PRECO_UNITARIO,
      DEFAULTS.TAXA_IVA
    );

    const fatura = await Fatura.create({
      consumidorId: consumidor.id,
      leituraId: leitura.id,
      consumo: leitura.consumo,
      consumoMinimo: DEFAULTS.CONSUMO_MINIMO,
      valorMinimo: DEFAULTS.VALOR_MINIMO,
      precoUnitario: DEFAULTS.PRECO_UNITARIO,
      subtotal,
      valorImposto,
      valorTotal,
      valorPago: 0,
      saldoDevedor: valorTotal,
      status: STATUS_FATURA.PENDENTE
    });

    await leitura.update({ faturada: true });

    return fatura.reload({ include: ['consumidor', 'leitura'] });
  }

  async gerarManual(consumidorId: number, leituraAtual: number, dataLeitura?: string) {
    const consumidor = await Consumidor.findByPk(consumidorId);
    if (!consumidor) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor'));

    const leitura = await Leitura.create({
      consumidorId,
      leituraAtual,
      dataLeitura: dataLeitura || new Date().toISOString().split('T')[0],
      tipoLeitura: 'REAL',
      faturada: false
    });

    return this.gerarDeLeitura(leitura.id);
  }

  async listar(pagina: number = 1, limite: number = 10, status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await Fatura.findAndCountAll({
      where,
      include: ['consumidor', 'leitura'],
      order: [['dataEmissao', 'DESC']],
      limit: limite,
      offset: (pagina - 1) * limite,
      distinct: true
    });

    return {
      dados: rows,
      total: count,
      pagina,
      limite
    };
  }

  async buscarPorId(id: number) {
    const fatura = await Fatura.findByPk(id, {
      include: ['consumidor', 'leitura', 'pagamentos']
    });
    if (!fatura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Fatura'));
    return fatura;
  }

  async buscarPorNumero(numeroFatura: string) {
    const fatura = await Fatura.findOne({
      where: { numeroFatura },
      include: ['consumidor', 'leitura', 'pagamentos']
    });
    if (!fatura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Fatura'));
    return fatura;
  }

  async buscarPorConsumidor(consumidorId: number) {
    return Fatura.findAll({
      where: { consumidorId },
      include: ['leitura'],
      order: [['dataEmissao', 'DESC']]
    });
  }

  async buscarPorStatus(status: string) {
    return Fatura.findAll({
      where: { status },
      include: ['consumidor']
    });
  }

  async buscarVencidas() {
    const hoje = new Date().toISOString().split('T')[0];
    return Fatura.findAll({
      where: {
        dataVencimento: { [Op.lt]: hoje },
        status: { [Op.ne]: STATUS_FATURA.PAGA }
      },
      include: ['consumidor']
    });
  }

  async atualizarStatus(id: number, status: string) {
    const fatura = await Fatura.findByPk(id);
    if (!fatura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Fatura'));
    await fatura.update({ status });
    return fatura;
  }

  async resumo() {
    const totais = await Fatura.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade'],
        [sequelize.fn('SUM', sequelize.col('saldoDevedor')), 'totalSaldoDevedor'],
        [sequelize.fn('SUM', sequelize.col('valorTotal')), 'totalValor']
      ],
      group: ['status']
    });

    const resultado: any = {};
    totais.forEach((item: any) => {
      resultado[item.status] = {
        quantidade: parseInt(item.getDataValue('quantidade')),
        totalSaldoDevedor: parseFloat(item.getDataValue('totalSaldoDevedor')) || 0,
        totalValor: parseFloat(item.getDataValue('totalValor')) || 0
      };
    });
    return resultado;
  }
}

export default new FaturaService();