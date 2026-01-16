
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoot from './App.tsx';

/**
 * Função para extrair o componente de forma segura.
 * Em ambientes ESM puros (como o que estamos usando), o import pode retornar 
 * o módulo de formas diferentes dependendo do navegador/WebView.
 */
const getAppComponent = (module: any) => {
  if (typeof module === 'function') return module;
  if (module && typeof module.default === 'function') return module.default;
  // Fallback para bundles mais complexos
  if (module && module.default && typeof module.default.default === 'function') return module.default.default;
  return null;
};

const App = getAppComponent(AppRoot);

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    if (!App) {
      console.error("KwaiTube: Falha ao identificar componente principal.", AppRoot);
      throw new Error("O arquivo App.tsx não exportou um componente válido. Verifique se existe 'export default App' no final do arquivo.");
    }

    const root = ReactDOM.createRoot(rootElement);
    
    // Usamos React.createElement para garantir que o React receba uma estrutura válida
    root.render(
      <React.StrictMode>
        <React.Suspense fallback={<div className="bg-black h-screen flex items-center justify-center text-orange-500 font-black italic animate-pulse">KwaiTube...</div>}>
          {React.createElement(App)}
        </React.Suspense>
      </React.StrictMode>
    );
    
    console.log("KwaiTube: Interface iniciada com sucesso.");
  } catch (err: any) {
    console.error("KwaiTube Erro Fatal:", err);
    const overlay = document.getElementById('error-overlay');
    if (overlay) {
      overlay.style.display = 'block';
      overlay.innerHTML = `
        <div style="padding: 30px; background: #000; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: sans-serif;">
          <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
          <h2 style="color: #ff5000; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px;">ERRO DE CARREGAMENTO</h2>
          <p style="color: #888; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">${err.message}</p>
          <div style="background: #111; padding: 15px; border-radius: 12px; font-size: 10px; color: #555; width: 100%; overflow: auto; max-height: 200px; text-align: left; border: 1px solid #222; font-family: monospace;">
            ${err.stack || 'Sem rastreamento disponível'}
          </div>
          <button onclick="location.reload()" style="margin-top: 30px; background: #ff5000; color: white; border: none; padding: 18px; border-radius: 15px; font-weight: bold; width: 100%; font-size: 16px; box-shadow: 0 10px 30px rgba(255,80,0,0.3); active:scale-95;">RECARREGAR APP</button>
        </div>
      `;
    }
  }
}
