const redis = require('redis');
const mysql = require('mysql2/promise');

console.log('✅ Serviço de agendamento (cron) iniciado.');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pac6',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
const pool = mysql.createPool(dbConfig);

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Erro de Conexão com o Redis:', err));


async function main() {
  try {
    await redisClient.connect();
    const connection = await pool.getConnection();
    connection.release();
    console.log('✅ Worker conectado ao Redis e ao pool do MySQL. Aguardando jobs...');
  } catch (error) {
    console.error('❌ Falha ao conectar com Redis ou MySQL.', error);
    return;
  }

  while (true) {
    let connection;
    try {
      const result = await redisClient.brPop('metrics_queue', 0);
      const job = JSON.parse(result.element);

      if (!job.projectName || !job.analysisType || !job.data) {
        console.error('❌ Job inválido recebido do Redis. Job descartado:', job);
        continue;
      }
      
      console.log('▶️ Job recebido. Processando para o projeto:', job.projectName);

      connection = await pool.getConnection();
      await connection.beginTransaction();

      let [rows] = await connection.execute('SELECT id FROM projects WHERE name = ?', [job.projectName]);
      
      let projectId;
      if (rows.length === 0) {
        const [insertResult] = await connection.execute('INSERT INTO projects (name) VALUES (?)', [job.projectName]);
        projectId = insertResult.insertId;
        console.log(`   - Projeto "${job.projectName}" não encontrado. Criado com ID: ${projectId}`);
      } else {
        projectId = rows[0].id;
      }

      await connection.execute('UPDATE projects SET last_metric_at = NOW() WHERE id = ?', [projectId]);
      
      // --- INÍCIO DA CORREÇÃO ---
      // Convertemos o objeto para string JSON aqui para compatibilidade com o .execute()
      const dataString = JSON.stringify(job.data);
      
      await connection.execute(
        'INSERT INTO metrics (project_id, analysis_type, data) VALUES (?, ?, ?)',
        [projectId, job.analysisType, dataString] // Passamos a string em vez do objeto
      );
      // --- FIM DA CORREÇÃO ---
      
      await connection.commit();
      console.log(`   - ✅ Métrica "${job.analysisType}" salva com sucesso.`);

    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`❌ Erro ao processar o job. Causa: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }
}

main();