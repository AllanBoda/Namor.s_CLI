// Em src/cron.js

const cron = require('node-cron');
const mysql = require('mysql2/promise');

console.log('✅ Serviço de agendamento (cron) iniciado.');

// Usamos a mesma configuração de Pool que o api.js
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pac6', // Verifique se o nome do banco está correto
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
const pool = mysql.createPool(dbConfig);

// Função que faz a limpeza dos projetos inativos
async function cleanupInactiveProjects() {
  console.log(`[${new Date().toISOString()}] Executando tarefa de limpeza de projetos inativos...`);
  try {
    // A consulta SQL para deletar projetos cuja última métrica foi recebida há mais de 7 dias.
    const [deleteResult] = await pool.execute(
      'DELETE FROM projects WHERE last_metric_at < NOW() - INTERVAL 7 DAY'
    );

    if (deleteResult.affectedRows > 0) {
      console.log(`🧹 Limpeza concluída. ${deleteResult.affectedRows} projeto(s) inativo(s) foram removidos.`);
    } else {
      console.log('✨ Nenhum projeto inativo para remover.');
    }
  } catch (error) {
    console.error('❌ Erro ao executar a tarefa de limpeza:', error);
  }
}

// --- Agendamento da Tarefa ---
// A string '0 2 * * *' significa "Execute à 0 minuto da 2ª hora, todos os dias".
// Ou seja, todo dia às 2 da manhã.
// Formato: (minuto hora dia-do-mês mês dia-da-semana)
cron.schedule('0 2 * * *', cleanupInactiveProjects, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

console.log('⏰ Tarefa de limpeza agendada para rodar todos os dias às 02:00.');

// Para fins de teste, você pode usar a linha abaixo para rodar a cada minuto
// Lembre-se de comentar ou remover a linha de cima se usar esta.

/*
cron.schedule('* * * * *', cleanupInactiveProjects);
console.log('⏰ MODO DE TESTE: Tarefa de limpeza agendada para rodar a cada minuto.');
*/