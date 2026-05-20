# Luces del Laboratorio — Especificación Frontend Web

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Responsabilidad:** Frontend  
**Repo destino:** `lab-lights-web`

---

## Propósito

Este documento contiene únicamente responsabilidades del frontend: experiencia de usuario, pantallas, React/Vite, estado local, cache cliente, offline, accesibilidad y pruebas frontend. Las reglas competitivas autoritativas, economía y persistencia transaccional pertenecen al backend.

---

## Flujo de pantallas

### Diagrama de flujo principal

```
[Inicio / Splash]
      ↓
[Menú principal]
  ├── [Jugar]
  │     ├── [Selección de modo]
  │     │     ├── [Classic] → [Partida] → [Resultado / Continuar si derrota] → [Ingreso iniciales si top 10]
  │     │     ├── [Classic+] → [Selección variante] → [Configuración (tamaño, etc.)] → [Partida]
  │     │     ├── [Dimensional] → [Configuración] → [Partida]
  │     │     ├── [Chaos / Mirror / Chain] → [Partida]
  │     │     ├── [Puzzle] → [Selección puzzle] → [Partida]
  │     │     └── [Daily Challenge] → [Partida]
  │     └── [Continuar partida guardada] (si existe)
  ├── [Rankings]
  │     ├── [Local]
  │     └── [Online] (requiere conexión)
  ├── [Tienda]
  │     ├── [Power-ups de partida]
  │     └── [Mejoras permanentes / Temas]
  ├── [Perfil]
  │     ├── [Estadísticas]
  │     ├── [Logros]
  │     ├── [Recompensas]
  │     └── [Login / Registro] (para modo online)
  └── [Configuración]
        ├── [Audio (música, efectos)]
        ├── [Visual (temas, daltónico)]
        └── [Datos y privacidad]
```

### Pantalla de partida

La pantalla de partida debe mostrar en todo momento:
- El tablero de salas con su estado actual.
- Contador de movimientos realizados.
- Contador de salas encendidas restantes.
- Temporizador (si aplica al modo).
- Contador de movimientos restantes (si aplica).
- Botón de pausa.
- Acceso rápido a power-ups disponibles.
- Botón de reordenar luces en modos visibles donde esté permitido.

### Pantalla de resultado

Al finalizar cada partida:
- Animación de victoria o derrota (estilo arcade).
- Puntaje final con desglose de multiplicadores.
- Monedas ganadas en esta partida.
- Recompensas por hitos desbloqueadas.
- Comparación con mejor puntaje personal en ese modo.
- Marcas claras de ayudas usadas: power-ups, continuaciones, reordenamiento.
- Si entra al ranking local: flujo de ingreso de iniciales (teclado arcade).
- Opciones: Jugar de nuevo · Cambiar modo · Menú principal.

### Pantalla de continuación

Cuando el jugador pierde por tiempo o movimientos:
- Mostrar estado final del tablero.
- Mostrar causa de derrota.
- Ofrecer continuación si el modo lo permite y el jugador tiene monedas/power-up suficiente.
- Mostrar impacto en ranking y puntaje antes de confirmar.
- Opciones: Continuar · Reintentar mismo seed · Nuevo tablero · Ver solución (práctica) · Menú.

### Ingreso de iniciales (estilo arcade)

- Interfaz de selección de caracteres estilo arcade: selector de columna única o rueda de letras.
- 3 posiciones para iniciales A–Z (y opcionalmente 0–9).
- Sonido de confirmación al seleccionar cada letra.
- El nombre ingresado persiste como "predeterminado" para la próxima vez que entre al ranking.

---

## Perfil, ranking y persistencia local

### Modo local sin registro

- El jugador ingresa **iniciales de 3 caracteres** (A-Z, estilo arcade) al registrar un puntaje en el ranking local.
- No se requiere cuenta.
- Los datos locales se almacenan en el dispositivo.
- El dispositivo puede tener múltiples perfiles locales con distintas iniciales.
- Las monedas locales, power-ups permanentes locales y rankings locales se asocian al perfil local.
- Al vincular un perfil local a una cuenta online, el frontend debe iniciar flujo de migración/sincronización con backend.

### Datos locales

Los datos locales de web deben almacenarse preferentemente en IndexedDB. `localStorage` debe reservarse para preferencias simples y no críticas.

**Estructura mínima de datos locales:**

```
perfiles[]
  - id: string
  - iniciales: string(3)
  - monedas: integer
  - power_ups_permanentes: map<string, boolean>
  - fecha_creacion: datetime

partidas[]
  - id: string
  - perfil_id: string
  - modo: enum
  - tamaño: string
  - puntaje: integer
  - movimientos: integer
  - tiempo_segundos: integer
  - power_ups_usados: string[]
  - continuaciones_usadas: integer
  - reordenamientos_usados: integer
  - fecha: datetime
  - seed: string
  - eventos_validacion: object[]
  - victoria: boolean
  - sync_status: pending | synced | rejected

rankings_locales[]
  - modo: string
  - tamaño: string
  - iniciales: string(3)
  - puntaje: integer
  - fecha: datetime
  - perfil_id: string
```

### Responsabilidades fuera de alcance frontend

- El frontend no valida puntajes online como autoridad final.
- El frontend no confirma recompensas online sin respuesta del backend.
- El frontend no escribe directamente en tablas sensibles de Supabase.
- El frontend no calcula saldos online como fuente de verdad.

---

## Frontend React + Vite

Buenas prácticas:
- Usar TypeScript estricto (`strict: true`).
- Usar Tailwind CSS como sistema principal de estilos, con tokens definidos para color, spacing, tipografía, sombras, radios, breakpoints y estados.
- Usar Anime.js para animaciones de tablero, transiciones de pantalla, feedback de victoria/derrota y microinteracciones relevantes.
- Mantener la lógica pura del tablero fuera de componentes React.
- Separar componentes de presentación, hooks de estado y servicios de infraestructura.
- Organizar UI por jerarquía explícita de componentes: `Layout`, `Page`, `Section`, `Component`, `MicroComponent`, `NanoComponent`.
- Organizar cada feature por capas internas cuando crezca en complejidad: `domain`, `application`, `ui` e `infra`.
- Diseñar pantallas desde lo particular a lo general: primero unidades pequeñas reutilizables y parametrizables, luego composición de secciones, páginas y layouts.
- Aplicar mobile first: la experiencia base se diseña para pantallas pequeñas y luego se expande para desktop sin perder calidad visual ni densidad útil.
- Usar estado local para partida en curso; sincronizar al backend solo eventos relevantes.
- Evitar renders innecesarios en el tablero usando memoización, keys estables y componentes pequeños.
- Representar el tablero con estructuras inmutables o cambios controlados para facilitar undo/replay.
- Persistir progreso offline en IndexedDB cuando sea necesario; `localStorage` solo para preferencias simples.
- Manejar accesibilidad: teclado, foco visible, contraste, reducción de animaciones y modo daltónico.
- Mantener assets de audio/visual optimizados y cargados bajo demanda.
- Internacionalizar todos los textos visibles con `react-i18next`. Ningún texto de interfaz debe estar hardcodeado en componentes; todos deben referenciarse mediante claves de locale.

Jerarquía de componentes:

| Nivel | Responsabilidad |
|---|---|
| `Layout` | Estructura global, providers visuales, navegación principal y regiones persistentes |
| `Page` | Pantalla enrutable completa y composición de secciones |
| `Section` | Bloque funcional dentro de una página, con intención de UX clara |
| `Component` | Unidad reutilizable de interfaz con comportamiento propio acotado |
| `MicroComponent` | Pieza pequeña de composición, estado visual o interacción simple |
| `NanoComponent` | Elemento atómico de UI: iconos, labels, badges, counters, slots o celdas simples |

Los componentes no deben saltarse capas por conveniencia cuando eso esconda responsabilidades. Una `Page` compone `Section`; una `Section` compone `Component`; y los niveles micro/nano deben mantenerse libres de reglas de negocio.

El diseño de pantallas debe partir por los elementos más específicos y reutilizables (`NanoComponent`, `MicroComponent`, `Component`) definiendo props, variantes, estados y límites de composición. Luego deben ensamblarse `Section`, `Page` y `Layout` con parametrización suficiente para evitar duplicar pantallas similares. La reutilización no debe forzar componentes genéricos difíciles de entender: cada abstracción debe representar una variación real del producto.

El enfoque responsive es mobile first:
- Definir primero la composición mínima usable para móviles.
- Escalar a tablet y desktop con breakpoints explícitos de Tailwind.
- En desktop, aprovechar el espacio para mejorar jerarquía, lectura y contexto, no solo estirar la UI móvil.
- Mantener el tablero como foco visual en todos los tamaños.
- Validar que controles, contadores, botones y texto no se solapen ni queden sobredimensionados en desktop.

Estructura sugerida:

```
src/
  app/                  # Bootstrap, rutas, providers
  game/
    domain/             # Board, move, score, seed, rules
    application/        # Use cases: startGame, applyMove, usePowerUp
    ui/                 # Componentes React
    infra/              # API client, storage local
  profile/
    domain/
    application/
    ui/
    infra/
  rankings/
    domain/
    application/
    ui/
    infra/
  shared/
```

Las capas por feature deben aplicarse primero en features con lógica propia (`game`, `profile`, `rankings`, `shop`, `settings`). `shared/` debe reservarse para infraestructura, componentes y utilidades realmente transversales, evitando convertirlo en un contenedor genérico de lógica de producto.

## Dirección visual, gráfica y motion

### Look and feel

La dirección visual del juego debe ser **laboratorio arcade retro**: interfaces de gabinete arcade noventero mezcladas con tableros eléctricos, luces de laboratorio, paneles de control, CRT sutil y feedback luminoso. Debe sentirse táctil, energético y competitivo, pero la lectura del puzzle siempre tiene prioridad sobre la ornamentación.

Principios visuales:
- Fondo oscuro técnico con contraste alto, sin saturar toda la pantalla con un solo color.
- Tablero como foco principal: celdas grandes, estados inequívocos y feedback inmediato al interactuar.
- Luz encendida con brillo controlado, halo, borde activo y sonido corto; luz apagada con volumen visual menor, sin confundirse con deshabilitada.
- Estética retro con moderación: scanlines, glow, pixel font o monoespaciada solo donde no afecte legibilidad.
- UI de soporte compacta: contadores, temporizador, power-ups y pausa deben ser escaneables durante la partida.
- Temas desbloqueables sobre una base común: CRT verde, ámbar, plasma, neón frío, alto contraste y daltónico.

### Estrategia gráfica

La implementación visual debe priorizar HTML semántico, CSS/Tailwind y SVG sobre imágenes rasterizadas para mantener nitidez, accesibilidad, theming y bajo peso.

| Recurso | Uso recomendado |
|---|---|
| HTML + Tailwind/CSS | Layout, tablero, paneles, botones, estados, responsive, glow, scanlines y efectos simples |
| SVG | Iconos, indicadores, símbolos de power-ups, patrones vectoriales y estados escalables |
| PNG/WebP | Texturas ligeras, fondos específicos, mockups de gabinete, overlays o assets con detalle pictórico |
| Sprites | Efectos frame-by-frame puntuales: chispas, explosión de victoria, moneda, glitch o power-up especial |
| GIF | Evitar en runtime del juego; usar solo en documentación o prototipos por peso y control limitado |
| CSS animations | Estados repetitivos simples: pulso de luz, parpadeo, shimmer, scanline |
| Anime.js | Secuencias coordinadas, cascadas del tablero, transiciones de resultado, combos y efectos de recompensa |

Decisión base:
- El tablero y la UI principal deben construirse con HTML + Tailwind/CSS, no como una imagen completa.
- Las celdas pueden usar CSS/SVG para representar luces, halos, bordes, símbolos y estados accesibles.
- Los sprites o PNG/WebP solo se agregan cuando aporten textura, personalidad o efectos que serían costosos de lograr con CSS/SVG.
- Todos los assets deben tener variantes optimizadas, tamaño acotado, carga diferida si no son críticos y fallback visual.
- Las animaciones deben respetar `prefers-reduced-motion` y tener una alternativa estática.

### Motion design

Anime.js debe usarse con intención, no como dependencia para cada hover simple:
- Transición de inicio de partida: encendido secuencial rápido del tablero.
- Click de celda: inversión con escala breve, flash controlado y propagación visual a adyacentes.
- Victoria: barrido luminoso, conteo de puntaje y entrada de recompensas.
- Derrota: apagón breve, shake leve del panel y estado final claro.
- Power-ups: animación diferenciada por tipo, sin ocultar el resultado real del movimiento.

Las animaciones no deben bloquear input más de lo necesario. En tablero competitivo, la respuesta visual debe iniciar en menos de 100 ms después de la interacción.

## Uso eventual de Next.js

Si se adopta Next.js:
- Usarlo para páginas públicas, cuenta, rankings web, blog o panel administrativo.
- Mantener el juego como módulo cliente aislado.
- No acoplar reglas de juego a Server Components.
- Evitar lógica de dominio en handlers de rutas; delegar a casos de uso.
- Usar caché y revalidación solo para lecturas públicas, nunca para saldo de monedas o validación de partidas.

---

## Resiliencia y cache frontend

- Mantener la partida en curso en memoria y persistir snapshots/eventos en IndexedDB para recuperación tras recarga, cierre inesperado o pérdida de conexión.
- Implementar cola offline para eventos sincronizables: partidas completadas, recompensas locales pendientes y preferencias.
- Usar reintentos con backoff exponencial y jitter para comandos sincronizables.
- Evitar reintentar automáticamente comandos no idempotentes sin `command_id`.
- Cachear lecturas no críticas: rankings, perfil público, catálogo de power-ups, configuración remota y Daily Challenge metadata.
- Usar estrategia stale-while-revalidate para lecturas de UI donde una versión levemente antigua sea aceptable.
- Mostrar estados claros: offline, sincronizando, sincronización fallida, datos desactualizados.
- Nunca permitir que cache local otorgue monedas, ranking online o recompensas online sin confirmación del servidor.
- Servir assets estáticos con hash de contenido y cache largo.
- Cachear HTML con TTL corto o revalidación para permitir releases rápidos.
- Precargar solo assets críticos; cargar audio, temas y efectos secundarios bajo demanda.
- Mantener fallback visual si un asset no carga.


---

## Internacionalización (i18n)

- Usar `react-i18next` como librería de i18n.
- Locale inicial: `es` (español). La arquitectura debe permitir agregar locales adicionales sin modificar componentes.
- Los archivos de traducciones se organizan por feature bajo `src/shared/i18n/locales/es/`, con un archivo JSON por dominio: `common.json`, `game.json`, `profile.json`, `rankings.json`, `shop.json`, `settings.json`.
- Ningún texto visible al usuario debe estar hardcodeado en componentes; todos deben usar claves de locale vía el hook `useTranslation`.
- Los valores dinámicos (puntajes, tiempos, monedas) se formatean con los helpers de `react-i18next` o `Intl`.
- Los textos de accesibilidad (`aria-label`, `alt`, `title`) también deben usar claves de locale.
- Evitar importar la instancia `i18n` directamente en componentes; `useTranslation` es la interfaz estándar.

---

## Testing frontend

- Unit tests con Vitest para reglas puras del cliente, hooks y utilidades.
- Component tests con Testing Library para UI crítica: tablero, resultado, continuación, recompensas y rankings.
- Tests de persistencia offline con IndexedDB fake o entorno equivalente.
- Playwright e2e para iniciar partida, ganar, perder, continuar, reordenar luces, login, ranking online y sincronización posterior.
- Los e2e deben correr contra backend de staging o mock contractual antes de release.


---

## CI mínimo frontend (`lab-lights-web`)

- Hooks de pre-commit para formato, lint rápido y validaciones locales que eviten commits rotos.
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- Playwright e2e contra backend de staging o mock contractual antes de release.
- Análisis SonarQube.
- Validación de cliente/tipos generados desde OpenAPI publicado por `lab-lights-api`.
