import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BeforeCreate, BeforeUpdate, Default } from 'sequelize-typescript';
import Consumidor from './Consumidor';
import Leitura from './Leitura';
import Pagamento from './Pagamento';

@Table({
  tableName: 'faturas',
  timestamps: true,
  underscored: true
})
export default class Fatura extends Model {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true, field: 'numero_fatura' })
  numeroFatura!: string;

  @ForeignKey(() => Consumidor)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'consumidor_id' })
  consumidorId!: number;

  @BelongsTo(() => Consumidor)
  consumidor!: Consumidor;

  @ForeignKey(() => Leitura)
  @Column({ type: DataType.INTEGER, field: 'leitura_id' })
  leituraId!: number;

  @BelongsTo(() => Leitura)
  leitura!: Leitura;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'data_emissao' })
  dataEmissao!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'data_vencimento' })
  dataVencimento!: string;

  @Column({ type: DataType.DATEONLY, field: 'data_pagamento' })
  dataPagamento!: string;

  @Column({ type: DataType.STRING(7), allowNull: false, field: 'mes_referencia' })
  mesReferencia!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  consumo!: number;

  @Default(5)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'consumo_minimo' })
  consumoMinimo!: number;

  @Default(350.00)
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'valor_minimo' })
  valorMinimo!: number;

  @Default(70.00)
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'preco_unitario' })
  precoUnitario!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  subtotal!: number;

  @Column({ type: DataType.DECIMAL(10, 2), field: 'valor_imposto' })
  valorImposto!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'valor_total' })
  valorTotal!: number;

  @Default(0)
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'valor_pago' })
  valorPago!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'saldo_devedor' })
  saldoDevedor!: number;

  @Default('PENDENTE')
  @Column({ type: DataType.STRING(20), allowNull: false })
  status!: string; // PENDENTE, PAGA, VENCIDA, CANCELADA

  @Column({ type: DataType.STRING(20), field: 'metodo_pagamento' })
  metodoPagamento!: string;

  @Column({ type: DataType.STRING(100), field: 'numero_referencia' })
  numeroReferencia!: string;

  @HasMany(() => Pagamento)
  pagamentos!: Pagamento[];

  @BeforeCreate
  static async gerarNumero(fatura: Fatura) {
    const count = await Fatura.count();
    fatura.numeroFatura = `FAT-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    fatura.dataEmissao = new Date().toISOString().split('T')[0];
    fatura.dataVencimento = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fatura.mesReferencia = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    fatura.calcularValores();
  }

  @BeforeUpdate
  static recalcular(fatura: Fatura) {
    fatura.calcularValores();
  }

  private calcularValores() {
    if (this.consumo <= this.consumoMinimo) {
      this.subtotal = this.valorMinimo;
    } else {
      const extra = this.consumo - this.consumoMinimo;
      this.subtotal = this.valorMinimo + extra * this.precoUnitario;
    }
    this.valorImposto = this.subtotal * 0.0; // IVA 17%
    this.valorTotal = this.subtotal + this.valorImposto;
    this.saldoDevedor = this.valorTotal - this.valorPago;
    if (this.saldoDevedor <= 0) {
      this.status = 'PAGA';
    } else if (new Date(this.dataVencimento) < new Date() && this.status !== 'PAGA') {
      this.status = 'VENCIDA';
    }
  }
}