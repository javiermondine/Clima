// Clima - Visual Crossing API - Vanilla JS (ES Modules)
// Pasa tu API key via ?key=TU_API_KEY o guárdala en localStorage.setItem('vc_key','TU_API_KEY')

import { fetchWeather, processWeather, unitGroupFor, iconUrl } from './src/api.js';
import { renderLoading, renderError, renderWeather, setTheme, getUnitSymbol } from './src/ui.js';
import { getGifForConditions, getGiphyKey } from './src/gif.js';

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
    state.lastWeatherData = data;
    renderWeather(data, getUnitSymbol(state.unit));
    setTheme(data.icon, data.description);

    // Opcional: GIF del clima si está habilitado
    await maybeRenderGif(data);
  } catch (err) {
    renderError(err.message || 'No se pudo obtener el clima');
  }
}

async function maybeRenderGif(weatherData){
  const wrap = document.getElementById('gifWrap');
  const img = document.getElementById('gif');
  if(!wrap || !img) return;
  if(!state.enableGiphy){
    wrap.hidden = true;
    img.src = '';
    return;
  }
  const gk = getGiphyKey();
  if(!gk){
    // si no hay key, desactivar visualmente
    wrap.hidden = true;
    img.src = '';
    return;
  }
  const url = await getGifForConditions(weatherData.icon, weatherData.description, gk);
  if(url){
    img.src = url;
    wrap.hidden = false;
  } else {
    wrap.hidden = true;
    img.src = '';
  }
}

function wireEvents() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('location-input');
  const toggle = document.getElementById('unit-toggle');
  const gifToggle = document.getElementById('gif-toggle');

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

  if (gifToggle) {
    // estado inicial desde preferencia previa (si se quisiera persistir)
    state.enableGiphy = gifToggle.checked;
    gifToggle.addEventListener('change', async () => {
      state.enableGiphy = gifToggle.checked;
      // Si ya hay datos en pantalla, actualizar sólo el GIF
      if (state.lastWeatherData) await maybeRenderGif(state.lastWeatherData);
    });
  }
}

// Init
wireEvents();
// Opcional: consulta inicial
// handleSearch('Buenos Aires');
