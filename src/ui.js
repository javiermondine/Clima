// UI helpers
export function renderLoading(message='Cargando...'){
  const status = document.getElementById('status');
  const panel = document.getElementById('weather');
  status.textContent = message;
  status.classList.remove('error');
  status.hidden = false;
  panel.hidden = true;
}

export function renderError(message='Ocurrió un error'){
  const status = document.getElementById('status');
  const panel = document.getElementById('weather');
  status.textContent = message;
  status.classList.add('error');
  status.hidden = false;
  panel.hidden = true;
}

export function renderWeather(data, unitSymbol='°C'){
  const status = document.getElementById('status');
  const panel = document.getElementById('weather');
  const city = document.getElementById('city');
  const temp = document.getElementById('temp');
  const unit = document.getElementById('unit-symbol');
  const desc = document.getElementById('desc');
  const hum = document.getElementById('hum');
  const icon = document.getElementById('icon');

  city.textContent = data.city;
  temp.textContent = Math.round(data.temp);
  unit.textContent = unitSymbol;
  desc.textContent = data.description;
  hum.textContent = Math.round(data.humidity ?? 0);
  icon.src = data.iconUrl;

  status.hidden = true;
  panel.hidden = false;
}

export function setTheme(icon, description=''){
  const body = document.body;
  body.classList.remove('sunny','rain','cloudy','snow','fog');
  const key = (icon||'').toLowerCase();
  if(key.includes('rain')) body.classList.add('rain');
  else if(key.includes('snow')) body.classList.add('snow');
  else if(key.includes('fog')) body.classList.add('fog');
  else if(key.includes('cloud')) body.classList.add('cloudy');
  else body.classList.add('sunny');
}

export function getUnitSymbol(unit){
  return unit === 'us' ? '°F' : '°C';
}
