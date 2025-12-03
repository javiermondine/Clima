// Giphy integration helpers (optional)
// Provide your API key via ?giphy=TU_API_KEY or localStorage.setItem('giphy_key','TU_API_KEY')

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function getGiphyKey() {
  // Prioridad: window.CONFIG -> ?giphy= -> localStorage
  const cfg = typeof window !== 'undefined' ? (window.CONFIG || {}) : {};
  const fromCfg = cfg.giphy_key || '';
  const qs = new URLSearchParams(location.search).get('giphy');
  const stored = typeof localStorage !== 'undefined' ? read('giphy_key') : null;
  return fromCfg || qs || stored || '';
}

export function mapToQuery(icon = '', description = '') {
  const d = `${icon} ${description}`.toLowerCase();
  if (d.includes('thunder') || d.includes('storm')) return 'thunderstorm weather';
  if (d.includes('rain') || d.includes('drizzle')) return 'rain weather';
  if (d.includes('snow') || d.includes('sleet')) return 'snow weather';
  if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return 'foggy weather';
  if (d.includes('cloud')) return 'cloudy sky';
  if (d.includes('clear') || d.includes('sun')) return 'sunny sky';
  return 'weather sky';
}

export async function fetchWeatherGif(query, apiKey) {
  try {
    const url = new URL('https://api.giphy.com/v1/gifs/search');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '1');
    url.searchParams.set('rating', 'g');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Error al obtener GIF');
    const json = await res.json();
    const gif = json?.data?.[0];
    const images = gif?.images || {};
    return (
      images?.downsized_medium?.url ||
      images?.fixed_height?.url ||
      images?.original?.url ||
      null
    );
  } catch {
    return null;
  }
}

async function fetchTranslateGif(query, apiKey) {
  try {
    const url = new URL('https://api.giphy.com/v1/gifs/translate');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('s', query);
    url.searchParams.set('weirdness', '1');
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const json = await res.json();
    const images = json?.data?.images || {};
    return (
      images?.downsized_medium?.url ||
      images?.fixed_height?.url ||
      images?.original?.url ||
      null
    );
  } catch {
    return null;
  }
}

export async function getGifForConditions(icon, description, apiKey) {
  if (!apiKey) return null;
  const q = mapToQuery(icon, description);
  try {
    let url = await fetchWeatherGif(q, apiKey);
    if (url) return url;
    // Fallback 1: translate endpoint con la misma consulta
    url = await fetchTranslateGif(q, apiKey);
    if (url) return url;
    // Fallback 2: consulta genérica
    url = await fetchTranslateGif('weather', apiKey);
    return url;
  } catch {
    return null;
  }
}
