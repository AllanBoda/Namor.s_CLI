// Em client/src/components/ProjectDetails.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MetricsChart from './MetricsChart'; // <-- 1. IMPORTA O GRÁFICO

function ProjectDetails({ projectName, onBackClick }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/projects/${projectName}`)
      .then(response => response.ok ? response.json() : Promise.reject('Falha ao buscar detalhes.'))
      .then(data => setHistory(data.history))
      .catch(err => setError(err.message));
  }, [projectName]);

  return (
    <div>
      <button onClick={onBackClick}>&larr; Voltar para a lista de projetos</button>
      <h2>Histórico de Análises: {projectName}</h2>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      
      {/* --- 2. RENDERIZA O GRÁFICO AQUI --- */}
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <h3>Evolução de Linhas de Código (LOC)</h3>
        <MetricsChart history={history} />
      </div>
      
      <h3>Dados Brutos</h3>
      {history.length > 0 ? (
        history.map(metric => (
          <div key={metric.created_at} style={{ border: '1px solid #444', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
            <p><strong>Tipo de Análise:</strong> {metric.analysis_type}</p>
            <p><strong>Data:</strong> {new Date(metric.created_at).toLocaleString()}</p>
            <pre style={{ backgroundColor: '#222', padding: '10px', whiteSpace: 'pre-wrap' }}>
              <code>{JSON.stringify(metric.data, null, 2)}</code>
            </pre>
          </div>
        ))
      ) : (
        !error && <p>Carregando histórico...</p>
      )}
    </div>
  );
}

ProjectDetails.propTypes = {
  projectName: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired,
};

export default ProjectDetails;