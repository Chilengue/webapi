import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Usuario from './Usuario';

@Table({
  tableName: 'auditoria',
  timestamps: true,
  underscored: true
})
export default class Auditoria extends Model {
  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, field: 'usuario_id' })
  usuarioId!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  acao!: string; // CRIAR, ATUALIZAR, EXCLUIR

  @Column({ type: DataType.STRING(50), allowNull: false, field: 'entidade' })
  entidade!: string; // Consumidor, Fatura, etc.

  @Column({ type: DataType.INTEGER, field: 'entidade_id' })
  entidadeId!: number;

  @Column({ type: DataType.JSONB, field: 'valores_antigos' })
  valoresAntigos!: object;

  @Column({ type: DataType.JSONB, field: 'valores_novos' })
  valoresNovos!: object;

  @Column({ type: DataType.STRING(45), field: 'endereco_ip' })
  enderecoIp!: string;
}