import app from '../app';
import sequelize from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORTA = parseInt(process.env.PORT || '3000', 10);

async function iniciarServidor() {
  try {
    // Testa conexão com o banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso.');

    // Sincroniza modelos com o banco (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('✅ Banco de dados sincronizado (force).');
    } else {
      // Em produção, recomenda-se usar migrations
      console.log('🔒 Modo produção: sincronização automática desativada.');
    }

    app.listen(PORTA, () => {
      console.log(`🚀 Servidor rodando na porta ${PORTA}`);
      console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido, fechando servidor...');
  sequelize.close().then(() => {
    console.log('🔌 Conexão com banco de dados fechada.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido, fechando servidor...');
  sequelize.close().then(() => {
    console.log('🔌 Conexão com banco de dados fechada.');
    process.exit(0);
  });
});

iniciarServidor();