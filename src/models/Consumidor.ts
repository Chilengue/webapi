import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BeforeCreate, Default, Unique } from 'sequelize-typescript';
import Usuario from './Usuario';
import Leitura from './Leitura';
import Fatura from './Fatura';

@Table({
  tableName: 'consumidores',
  timestamps: true,
  underscored: true
})
export default class Consumidor extends Model {
  @Column({ type: DataType.STRING(250), allowNull: false, field: 'nome_completo' })
  nomeCompleto!: string;

  @Unique
  @Column({ type: DataType.STRING(12), allowNull: false })
  identificacao!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  nacionalidade!: string;

  @Column({ type: DataType.STRING(100), allowNull: false, field: 'naturalidade' })
  naturalidade!: string;

  @Column({ type: DataType.STRING(30), allowNull: false, field: 'estado_civil' })
  estadoCivil!: string;

  @Column({ type: DataType.DATEONLY, field: 'data_nascimento' })
  dataNascimento!: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  telefone!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  bairro!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  rua!: string;

  @Column({ type: DataType.STRING(10), allowNull: false })
  genero!: string;

  @Unique
  @Column({ type: DataType.STRING(30), allowNull: false, field: 'codigo_fatura' })
  codigoFatura!: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  ativo!: boolean;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, field: 'usuario_id' })
  usuarioId!: number;

  @BelongsTo(() => Usuario)
  usuario!: Usuario;

  @HasMany(() => Leitura)
  leituras!: Leitura[];

  @HasMany(() => Fatura)
  faturas!: Fatura[];

  @BeforeCreate
  static gerarCodigoFatura(consumidor: Consumidor) {
    if (!consumidor.codigoFatura) {
      consumidor.codigoFatura = `FAT-${new Date().getFullYear()}-${Date.now()}`;
    }
  }
}