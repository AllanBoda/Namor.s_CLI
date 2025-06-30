// Em client/src/App.jsx
import { useState, useEffect } from 'react';
import ProjectDetails from './components/ProjectDetails.jsx'; // <-- 1. Importa o novo componente
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  
  // --- MUDANÇA: Novo estado para controlar o projeto selecionado ---
  const [selectedProject, setSelectedProject] = useState(null);

  // Busca a lista de projetos (continua igual)
  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(response => response.ok ? response.json() : Promise.reject('Não foi possível buscar os dados.'))
      .then(data => setProjects(data))
      .catch(err => {
        setError(err);
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);

  // --- MUDANÇA: Funções para lidar com o clique ---
  const handleProjectClick = (projectName) => {
    setSelectedProject(projectName);
  };

  const handleBackClick = () => {
    setSelectedProject(null); // Limpa a seleção para voltar à lista
  };

  // --- MUDANÇA: Lógica de renderização condicional ---
  if (selectedProject) {
    // Se um projeto está selecionado, mostra a tela de detalhes
    return (
      <ProjectDetails 
        projectName={selectedProject} 
        onBackClick={handleBackClick} 
      />
    );
  }

  // Se nenhum projeto está selecionado, mostra a lista principal
  return (
    <>
      <h1>Dashboard de Qualidade de Código</h1>
      <h2>Projetos Analisados</h2>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      <ul className="project-list">
        {projects.length > 0 ? (
          projects.map(project => (
            // Adiciona o evento onClick para chamar a função
            <li key={project.id} onClick={() => handleProjectClick(project.name)}>
              <strong>{project.name}</strong>
              <br></br>
              <span>Última análise: {new Date(project.last_metric_at).toLocaleString()}</span>
            </li>
          ))
        ) : (
          !error && <p>Nenhum projeto encontrado.</p>
        )}
      </ul>
      {/* Você pode remover a imagem do gato ou mantê-la aqui, como preferir :) */}
    </>
  );
}

export default App;