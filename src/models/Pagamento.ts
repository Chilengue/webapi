import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate, Default } from 'sequelize-typescript';
import Fatura from './Fatura';
import Usuario from './Usuario';

@Table({
  tableName: 'pagamentos',
  timestamps: true,
  underscored: true
})
export default class Pagamento extends Model {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true, field: 'numero_pagamento' })
  numeroPagamento!: string;

  @ForeignKey(() => Fatura)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'fatura_id' })
  faturaId!: number;

  @BelongsTo(() => Fatura)
  fatura!: Fatura;

  @Column({ type: DataType.DATE, allowNull: false, field: 'data_pagamento' })
  dataPagamento!: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  valor!: number;

  @Column({ type: DataType.STRING(20), allowNull: false, field: 'metodo_pagamento' })
  metodoPagamento!: string; // DINHEIRO, MULTICAIXA, TRANSFERENCIA, CHEQUE

  @Column({ type: DataType.STRING(100), field: 'numero_referencia' })
  numeroReferencia!: string;

  @Column({ type: DataType.STRING(50), field: 'numero_recibo' })
  numeroRecibo!: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'caixa_id' })
  caixaId!: number;

  @BelongsTo(() => Usuario, 'caixaId')
  caixa!: Usuario;

  @Column({ type: DataType.TEXT })
  observacoes!: string;

  @Default('CONCLUIDO')
  @Column({ type: DataType.STRING(20), allowNull: false })
  status!: string; // CONCLUIDO, ESTORNADO, CANCELADO

  @BeforeCreate
  static gerarNumero(pagamento: Pagamento) {
    pagamento.numeroPagamento = `PAG-${Date.now()}`;
    pagamento.numeroRecibo = `REC-${Date.now()}`;
    pagamento.dataPagamento = new Date();
  }
}