// API helpers for Visual Crossing
// Docs: https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/

export function unitGroupFor(unit){
  return unit === 'us' ? 'us' : 'metric';
}

export async function fetchWeather(location, unitGroup, apiKey){
  const loc = encodeURIComponent(location);
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`;
  const resp = await fetch(url);
  if(!resp.ok){
    if(resp.status === 400 || resp.status === 404){
      throw new Error('Ciudad no encontrada');
    }
    throw new Error('Error de red');
  }
  return await resp.json();
}

export function processWeather(json){
  const city = json?.resolvedAddress || json?.address || '—';
  const c = json?.currentConditions || {};
  const temp = c.temp; // según unidad seleccionada
  const humidity = c.humidity;
  const icon = c.icon; // e.g., 'rain','snow','clear-day','partly-cloudy-day'
  const description = c.conditions || c.icon || '—';
  const iconUrlStr = iconUrl(icon);
  return { city, temp, humidity, icon, description, iconUrl: iconUrlStr };
}

// Build a minimal icon URL using Visual Crossing icon names via simple CDN mapping
export function iconUrl(icon){
  // fallback mapping to basic emoji-like SVGs from a small public set (placeholder)
  const map = {
    'clear-day':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-sunny.svg',
    'clear-night':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-night-clear.svg',
    'rain':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain.svg',
    'snow':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-snow.svg',
    'sleet':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-sleet.svg',
    'wind':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-strong-wind.svg',
    'fog':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-fog.svg',
    'cloudy':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-cloudy.svg',
    'partly-cloudy-day':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-cloudy.svg',
    'partly-cloudy-night':'https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-night-alt-cloudy.svg'
  };
  return map[icon] || map['cloudy'];
}
