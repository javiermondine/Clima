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
## Deploy (GitHub Pages + Secrets)
El workflow despliega automáticamente a **GitHub Pages** y genera un `config.js` con las claves leídas de Secrets del repo.

1. En GitHub, ve a Settings → Secrets and variables → Actions → New repository secret.
2. Crea estos secrets:
    - `VC_KEY` = tu API key de Visual Crossing
    - `GIPHY_KEY` = tu API key de Giphy (opcional)
3. Al hacer push a `main`, el workflow creará `config.js` con:
    ```js
    window.CONFIG = { vc_key: '...', giphy_key: '...' };
    ```
4. La app leerá primero `window.CONFIG`, y si no está, caerá a `?key=`/`?giphy=` o `localStorage`.

Importante: en una app 100% cliente las claves expuestas siguen siendo visibles en el navegador. Este método evita guardarlas en el repositorio, pero si necesitas ocultarlas del cliente final, usa un proxy/función serverless para hacer las llamadas en el servidor y no exponer las claves en el frontend.
