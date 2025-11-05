// Clima - Visual Crossing API - Vanilla JS (ES Modules)
// Pasa tu API key via ?key=TU_API_KEY o guárdala en localStorage.setItem('vc_key','TU_API_KEY')

import { fetchWeather, processWeather, unitGroupFor, iconUrl } from './src/api.js';
import { renderLoading, renderError, renderWeather, setTheme, getUnitSymbol } from './src/ui.js';

const state = {
  unit: 'metric', // 'metric' (°C) o 'us' (°F)
  lastQuery: null,
  enableGiphy: false,
};

function getApiKey() {
  const qs = new URLSearchParams(location.search).get('key');
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('vc_key') : null;
  return qs || stored || '';
}

async function handleSearch(query) {
  const key = getApiKey();
  if (!key) {
    renderError('Agrega tu API key de Visual Crossing: ?key=TU_API_KEY o guarda en localStorage');
    return;
  }
  state.lastQuery = query;
  renderLoading(`Cargando pronóstico para "${query}"...`);
  try {
    const raw = await fetchWeather(query, unitGroupFor(state.unit), key);
    const data = processWeather(raw);
    renderWeather(data, getUnitSymbol(state.unit));
    setTheme(data.icon, data.description);
  } catch (err) {
    renderError(err.message || 'No se pudo obtener el clima');
  }
}

function wireEvents() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('location-input');
  const toggle = document.getElementById('unit-toggle');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return renderError('Escribe una ciudad');
    handleSearch(q);
  });

  toggle.addEventListener('change', () => {
    state.unit = toggle.checked ? 'us' : 'metric';
    // si ya buscamos algo, reconsultar con la nueva unidad
    if (state.lastQuery) handleSearch(state.lastQuery);
    // cambiar símbolo sin recargar (si ya hay datos)
    const unitEl = document.getElementById('unit-symbol');
    if (unitEl) unitEl.textContent = getUnitSymbol(state.unit);
  });
}

// Init
wireEvents();
// Opcional: consulta inicial
// handleSearch('Buenos Aires');
