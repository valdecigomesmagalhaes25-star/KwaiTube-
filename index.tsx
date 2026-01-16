
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppModule from './App.tsx';

// Garante que estamos pegando o componente, seja via default export ou módulo direto
const App = (AppModule as any).default || AppModule;

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    // Verifica se App é uma função válida (componente React)
    if (typeof App !== 'function') {
      throw new Error("O componente App não foi carregado corretamente. Verifique as exportações.");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <React.Suspense fallback={<div className="bg-black h-screen flex items-center justify-center text-orange-500 font-bold">Carregando Interface...</div>}>
          <App />
        </React.Suspense>
      </React.StrictMode>
    );
    console.log("KwaiTube: React montado com sucesso.");
  } catch (err: any) {
    console.error("Erro Crítico no React:", err);
    const overlay = document.getElementById('error-overlay');
    if (overlay) {
      overlay.style.display = 'block';
      overlay.innerHTML = `
        <h2 style="color: white;">Falha na Renderização</h2>
        <p>${err.message}</p>
        <pre style="font-size: 10px; color: #777;">${err.stack}</pre>
      `;
    }
  }
} else {
  console.error("Elemento #root não encontrado no DOM.");
}
