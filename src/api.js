const express = require('express');
const redis = require('redis');
const mysql = require('mysql2/promise');
const cors = require('cors');

// --- 1. Inicialização e Configuração ---
const app = express();
app.use(cors());
app.use(express.json());

// Conexão com Redis
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Erro de Conexão com o Redis:', err));
(async () => {
    await redisClient.connect();
    console.log('✅ API conectada ao Redis.');
})();


// --- MUDANÇA 1: CRIANDO O POOL DE CONEXÕES COM O MYSQL ---
// O pool é criado uma única vez quando o servidor inicia.
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pac6',
  waitForConnections: true,
  connectionLimit: 10, // Limite de conexões simultâneas
  queueLimit: 0
};
const pool = mysql.createPool(dbConfig);
console.log('✅ Pool de conexões com MySQL criado.');


// --- 2. Endpoints da API (Agora usando o Pool) ---

// POST /api/metrics
app.post('/api/metrics', async (req, res) => {
  // Esta rota não muda, pois ela só interage com o Redis
  console.log('Requisição recebida em /api/metrics');
  try {
    const { projectName, analysisType, data } = req.body;
    if (!projectName || !analysisType || !data) {
      return res.status(400).json({ error: 'Os campos projectName, analysisType e data são obrigatórios.' });
    }
    const job = { projectName, analysisType, data, receivedAt: new Date().toISOString() };
    await redisClient.lPush('metrics_queue', JSON.stringify(job));
    console.log('Job enfileirado com sucesso:', job.projectName);
    res.status(202).json({ message: 'Análise recebida e enfileirada para processamento.' });
  } catch (error) {
    console.error('Falha ao processar a requisição e enfileirar o job:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    // --- MUDANÇA 2: Usamos o pool diretamente. Não precisa mais criar/fechar conexão.
    const [rows] = await pool.execute(
      'SELECT id, name, last_metric_at FROM projects ORDER BY last_metric_at DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});


// GET /api/projects/:projectName
app.get('/api/projects/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    console.log(`Buscando histórico para o projeto: ${projectName}`);

    // --- MUDANÇA 3: Usamos o pool aqui também.
    const [projectRows] = await pool.execute('SELECT id FROM projects WHERE name = ?', [projectName]);

    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    const projectId = projectRows[0].id;

    const [metricsRows] = await pool.execute(
      'SELECT analysis_type, data, created_at FROM metrics WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
    
    res.status(200).json({
      projectName: projectName,
      history: metricsRows
    });
  } catch (error) {
    console.error('Erro ao buscar dados do projeto:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
  // Note que não há mais o bloco 'finally', pois o pool gerencia as conexões.
});


// --- 3. Inicialização do Servidor ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});