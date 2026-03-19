import { Table, Column, Model, DataType, BelongsToMany, HasOne, BeforeCreate, BeforeUpdate, Unique, Default, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import Papel from './Papel';
import UsuarioPapel from './UsuarioPapel';
import Consumidor from './Consumidor';

@Table({
  tableName: 'usuarios',
  timestamps: false,
  underscored: true
})
export default class Usuario extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  nome!: string;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false, field: 'nome_usuario' })
  nomeUsuario!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  senha!: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'data_criacao', allowNull: false })
  dataCriacao!: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'data_atualizacao', allowNull: false })
  dataAtualizacao!: Date;

  @BelongsToMany(() => Papel, () => UsuarioPapel)
  papeis!: Papel[];

  @HasOne(() => Consumidor)
  consumidor!: Consumidor;

  @BeforeCreate
  static async hashSenha(usuario: Usuario) {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
  }

  @BeforeUpdate
  static async atualizarTimestamp(usuario: Usuario) {
    usuario.dataAtualizacao = new Date();
  }
}