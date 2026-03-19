import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate, Default } from 'sequelize-typescript';
import Consumidor from './Consumidor';
import Usuario from './Usuario';

@Table({
  tableName: 'leituras',
  timestamps: true,
  underscored: true
})
export default class Leitura extends Model {
  @ForeignKey(() => Consumidor)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'consumidor_id' })
  consumidorId!: number;

  @BelongsTo(() => Consumidor)
  consumidor!: Consumidor;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'data_leitura' })
  dataLeitura!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'leitura_atual' })
  leituraAtual!: number;

  @Column({ type: DataType.INTEGER, field: 'leitura_anterior' })
  leituraAnterior!: number;

  @Column({ type: DataType.INTEGER })
  consumo!: number;

  @Column({ type: DataType.STRING(20), field: 'tipo_leitura', defaultValue: 'REAL' })
  tipoLeitura!: string; // REAL, ESTIMADA

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, field: 'leiturista_id' })
  leituristaId!: number;

  @BelongsTo(() => Usuario, 'leituristaId')
  leiturista!: Usuario;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'faturada' })
  faturada!: boolean;

  @BeforeCreate
  static async calcularConsumo(leitura: Leitura) {
    if (!leitura.leituraAnterior) {
      const ultimaLeitura = await Leitura.findOne({
        where: { consumidorId: leitura.consumidorId },
        order: [['dataLeitura', 'DESC']]
      });
      leitura.leituraAnterior = ultimaLeitura ? ultimaLeitura.leituraAtual : 0;
    }
    leitura.consumo = leitura.leituraAtual - leitura.leituraAnterior;
  }
}