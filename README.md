# Clima — Weather App (Visual Crossing)

Aplicación sencilla en HTML, CSS y JavaScript (ES Modules) que consulta la API de **Visual Crossing Weather** para mostrar el clima actual por ciudad. Permite alternar entre °C y °F y cambia el tema visual según el clima.

## Requisitos previos
- Una API key de Visual Crossing. Puedes pasarla como parámetro en la URL `?key=TU_API_KEY` o guardarla en el navegador:

```js
localStorage.setItem('vc_key','TU_API_KEY')
```

## Uso
- Escribe una ciudad y pulsa "Buscar".
- Cambia de °C a °F con el interruptor.
- Si no hay API key, verás un mensaje indicando cómo agregarla.

### GIF opcional (Giphy)
- Activa el interruptor "GIF" para mostrar un GIF relacionado con el clima.
- Provee tu API key de Giphy con `?giphy=TU_API_KEY` o guarda en el navegador:

```js
localStorage.setItem('giphy_key','TU_API_KEY')
```

## Estructura
```
Clima/
├── index.html
├── style.css
├── script.js         # entry (type=module)
└── src/
    ├── api.js        # fetchWeather(), processWeather(), helpers
    ├── ui.js         # render, loading, error, theming
    └── gif.js        # (opcional) integración con Giphy
```

## Notas
- La app usa `fetch()` y `async/await` con `try/catch`.
- El endpoint usado es `timeline`: `/VisualCrossingWebServices/rest/services/timeline/{location}?unitGroup={metric|us}&key=...&contentType=json`.
- Los datos mostrados: ciudad, temperatura, descripción, humedad e ícono (mapeado a SVGs públicos).
## Deploy
Este repositorio incluye un workflow de GitHub Actions que despliega automáticamente a **GitHub Pages** al hacer push a `main`. Ve a Settings → Pages para ver la URL una vez ejecutado el workflow.
