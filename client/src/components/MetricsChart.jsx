// Em client/src/components/MetricsChart.jsx

import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MetricsChart({ history }) {
  // --- INÍCIO DA CORREÇÃO ---
  const chartData = history
    .filter(metric => metric.analysis_type === 'loc_analysis') // 1. Filtra apenas pelo tipo de análise
    .map(metric => {
      try {
        // 2. Tenta converter o texto de 'data' em um objeto JavaScript
        const parsedData = JSON.parse(metric.data); 
        
        // 3. Retorna o objeto no formato que o gráfico espera
        return {
          date: new Date(metric.created_at).toLocaleDateString(),
          'Linhas de Código': parsedData.loc, // Acessa a propriedade .loc do objeto convertido
        };
      } catch (e) {
        // Se a conversão falhar (ex: JSON mal formatado), ignora este ponto de dados
        console.warn("Não foi possível parsear o dado da métrica:", metric.data);
        return null;
      }
    })
    .filter(point => point && typeof point['Linhas de Código'] === 'number') // 4. Remove pontos nulos ou sem a métrica 'loc'
    .reverse(); // Inverte para mostrar a evolução cronológica
  // --- FIM DA CORREÇÃO ---

  if (chartData.length < 2) { // Precisa de pelo menos 2 pontos para uma linha
    return <p>Não há dados suficientes de "Linhas de Código" para exibir um gráfico de evolução.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Linhas de Código" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

MetricsChart.propTypes = {
  history: PropTypes.array.isRequired,
};

export default MetricsChart;