import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'funcionarios',
  timestamps: true,
  underscored: true
})
export default class Funcionario extends Model {
  @Column({ type: DataType.STRING(250), allowNull: false, field: 'nome_completo' })
  nomeCompleto!: string;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
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
}