import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import {
  Usuario, Papel, UsuarioPapel, Consumidor, Funcionario,
  Leitura, Fatura, Pagamento, Auditoria
} from '../models';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',

  models: [
    Usuario, Papel, UsuarioPapel, Consumidor,
    Funcionario, Leitura, Fatura, Pagamento, Auditoria
  ],

  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;