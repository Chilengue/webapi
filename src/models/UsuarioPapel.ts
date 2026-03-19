import { Table, Column, Model, ForeignKey, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import Usuario from './Usuario';
import Papel from './Papel';

@Table({
  tableName: 'usuario_papeis',
  timestamps: false,
  underscored: true
})
export default class UsuarioPapel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'usuario_id' })
  usuarioId!: number;

  @ForeignKey(() => Papel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'papel_id' })
  papelId!: number;
}