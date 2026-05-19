# Luces del Laboratorio - Pre-roadmap de Lanzamientos Incrementales

**Versión:** 0.1  
**Fecha:** Mayo 2026  
**Estado:** Draft de planificación  
**Alcance:** Visualizar releases funcionales desde MVP hasta Endgame  

---

## Propósito

Este documento propone una secuencia incremental de lanzamientos para construir **Luces del Laboratorio** sin intentar implementar toda la especificación de una vez. Cada release debe entregar una versión jugable, testeable y validable, agregando complejidad solo cuando la base anterior esté estable.

El roadmap no define fechas ni compromisos cerrados. Define cortes funcionales, dependencias y criterios de salida para orientar planificación, priorización y slicing técnico entre `lab-lights-web` y `lab-lights-api`.

---

## Principios del roadmap

- Cada release debe dejar el juego en un estado usable, aunque tenga contenido limitado.
- El MVP debe validar el loop central: iniciar partida, jugar, ganar/perder, puntuar, guardar progreso local y repetir.
- La complejidad online se incorpora después de estabilizar dominio, UI, scoring y persistencia local.
- Los modos avanzados se agregan cuando el motor de tablero, eventos, replay y validación ya estén probados.
- Las features competitivas requieren trazabilidad, idempotencia, validación y separación clara entre ranked/casual.
- La UI se construye mobile first, desde componentes pequeños reutilizables hacia pantallas completas.
- La calidad mínima de cada release incluye lint, typecheck, tests unitarios relevantes y smoke/e2e del flujo principal.

---

## Visión por etapas

| Etapa | Nombre | Objetivo |
|---|---|---|
| R0 | Fundación técnica | Preparar arquitectura, tooling y base visual sin prometer gameplay completo |
| R1 | MVP local | Entregar el juego Classic 3x3 completamente jugable en local |
| R2 | MVP+ local | Agregar ranking local, perfil local, persistencia y experiencia pulida |
| R3 | Variantes base | Expandir a Classic+, dimensiones y restricciones simples |
| R4 | Economía local | Incorporar monedas, power-ups básicos, continuaciones y tienda local |
| R5 | Online core | Agregar cuenta, backend Go, validación de partidas y ranking online inicial |
| R6 | Sincronización y resiliencia | Offline-online, cola de eventos, recompensas online e idempotencia completa |
| R7 | Modos avanzados | Chaos, Mirror, Chain Reaction y Puzzle con UX propia |
| R8 | Daily y live ops | Daily Challenge, temporadas ligeras, recompensas recurrentes y contenido operable |
| R9 | Endgame | Sistema completo, balance, progresión extendida, polish y operación estable |

---

## R0 - Fundación técnica

**Objetivo:** preparar una base mantenible para avanzar rápido sin deuda estructural temprana.

### Alcance frontend

- React + TypeScript + Vite.
- Tailwind CSS configurado con tokens base de color, spacing, tipografía, radios, sombras y breakpoints.
- Anime.js instalado y encapsulado en helpers/hooks para secuencias de UI.
- Jerarquía de componentes definida: `Layout`, `Page`, `Section`, `Component`, `MicroComponent`, `NanoComponent`.
- Estructura por features y capas: `domain`, `application`, `ui`, `infra`.
- Look and feel inicial: laboratorio arcade retro, tablero como foco, estados visuales claros.
- Rutas mínimas: inicio/menú, partida placeholder, ranking placeholder, configuración placeholder.
- Pre-commit con formato/lint rápido.

### Alcance backend

- Sin backend funcional obligatorio.
- Repositorio `lab-lights-api` puede iniciar solo con estructura, healthcheck y convenciones si se trabaja en paralelo.

### Criterios de salida

- La app levanta localmente.
- Hay sistema visual base y componentes atómicos iniciales.
- CI mínimo preparado o documentado.
- Existe una pantalla navegable que valida responsive mobile/desktop.

---

## R1 - MVP local

**Objetivo:** validar que el juego base sea divertido, legible y repetible sin depender de servidor.

### Alcance funcional

- Modo Classic 3x3.
- Generación de tablero inicial aleatorio con seed local.
- Acción base Lights-Out: invertir celda y adyacentes ortogonales.
- Condición de victoria: todas las luces apagadas.
- Contador de movimientos.
- Temporizador informativo sin límite.
- Pantalla de resultado con victoria, movimientos, tiempo y puntaje simple.
- Reiniciar partida, jugar de nuevo y volver al menú.

### Alcance técnico

- Dominio puro testeado: tablero, adyacencias, inversión, victoria y seed.
- UI mobile first para partida.
- Animación de click de celda e inversión visual con Anime.js o CSS según corresponda.
- Estado en memoria con estructura preparada para replay/eventos.

### Fuera de alcance

- Ranking local persistente.
- Monedas.
- Power-ups.
- Backend.
- Login.

### Criterios de salida

- Un usuario puede abrir la app, jugar Classic 3x3, ganar y repetir.
- Unit tests cubren reglas del tablero.
- Smoke/e2e cubre iniciar partida y completar victoria controlada.

---

## R2 - MVP+ local

**Objetivo:** convertir el MVP en una experiencia local persistente y presentable.

### Alcance funcional

- Ranking local Top 10 por Classic 3x3.
- Ingreso de iniciales arcade de 3 caracteres.
- Perfil local mínimo con iniciales por defecto.
- Persistencia en IndexedDB para perfil, partidas y ranking local.
- Configuración visual mínima: sonido on/off, reducir animaciones, tema base y modo daltónico.
- Pantalla de ranking local.
- Pantalla de estadísticas locales básicas: partidas, victorias, mejor puntaje, mejor tiempo.

### Alcance visual

- Look and feel laboratorio arcade aplicado a menú, partida, resultado y ranking.
- Tablero responsive: excelente en mobile, bien compuesto en desktop.
- Estados vacíos y de error locales.

### Criterios de salida

- El progreso local sobrevive a recarga/cierre.
- El jugador puede registrar iniciales si entra al ranking.
- La app ya puede probarse como demo local cerrada.

---

## R3 - Variantes base

**Objetivo:** expandir rejugabilidad con reglas adicionales de baja complejidad técnica.

### Alcance funcional

- Dimensional visible: tableros 3x3 a 10x10.
- Time Attack con cálculo de tiempo base por tamaño.
- Move Limit con cálculo de movimientos por tamaño.
- Selección de modo y configuración antes de iniciar partida.
- Puntaje completo base: tamaño, tiempo, movimientos y victoria.
- Marcado de partidas por modo/configuración en historial local.

### Alcance técnico

- Motor de partida parametrizable por modo.
- Pruebas para límites de tiempo/movimientos.
- Componentes de configuración reutilizables.
- Layout desktop mejorado para configuración y resultados.

### Criterios de salida

- Classic, Dimensional, Time Attack y Move Limit son jugables localmente.
- Rankings locales separan modo y configuración relevante.
- La UI no se rompe entre 3x3 y 10x10 en mobile/desktop.

---

## R4 - Economía local

**Objetivo:** agregar progresión y ayudas sin comprometer la integridad competitiva futura.

### Alcance funcional

- Monedas locales ganadas por victoria, derrota y nuevo récord local.
- Tienda local inicial.
- Power-ups básicos:
  - `+30s` para Time Attack.
  - `+5 movimientos` para Move Limit.
  - `Deshacer`.
  - `Reordenar luces` en modos visibles.
- Continuación local tras derrota por tiempo/movimientos con penalización.
- Marcas claras en resultado: power-ups, continuaciones y reordenamientos usados.
- Mejoras permanentes locales iniciales:
  - modo daltónico gratis.
  - temas de color.
  - indicador de adyacencias.

### Alcance técnico

- Ledger local simple o historial de transacciones local.
- Registro de eventos de partida suficiente para validación futura.
- Reglas de elegibilidad ranked/casual modeladas aunque solo exista ranking local.

### Criterios de salida

- El jugador gana/gasta monedas localmente.
- Las ayudas alteran puntaje y elegibilidad de forma visible.
- No hay doble cobro local por recarga o repetición accidental.

---

## R5 - Online core

**Objetivo:** introducir backend y competencia online con un alcance pequeño y validable.

### Alcance backend

- API Go versionada `/v1`.
- Supabase PostgreSQL y auth.
- Perfil online mínimo.
- Endpoints iniciales:
  - crear/finalizar partida.
  - enviar score.
  - leer ranking.
  - leer perfil propio.
- Ranking online Classic 3x3 global.
- Validación anti-cheat básica reproduciendo seed y movimientos.
- OpenAPI publicado y cliente/tipos generados para frontend.

### Alcance frontend

- Login/registro.
- Vinculación de perfil local a cuenta online.
- Envío de puntaje elegible Classic 3x3.
- Pantalla de ranking online global.
- Estados de envío: pendiente, validado, rechazado.

### Fuera de alcance

- Daily Challenge.
- Rankings para todos los modos.
- Sincronización offline completa.
- Hitos online complejos.

### Criterios de salida

- Un usuario registrado puede enviar un puntaje Classic 3x3 validado.
- El ranking online muestra Top 100.
- El frontend no escribe directamente en tablas sensibles.
- CI valida contrato OpenAPI y smoke e2e contra staging/mock contractual.

---

## R6 - Sincronización y resiliencia

**Objetivo:** hacer confiable la transición entre juego local, offline y online.

### Alcance funcional

- Cola offline para partidas completadas y comandos sincronizables.
- Sincronización posterior al recuperar conexión.
- Historial online de partidas.
- Recompensas online iniciales:
  - primer puntaje online validado.
  - superar mejor marca personal online.
- Reclamación de recompensas con idempotencia.
- Estados claros: offline, sincronizando, fallido, rechazado y desactualizado.

### Alcance backend

- `command_id` en comandos críticos.
- Ledger transaccional de monedas online.
- `reward_claims` idempotentes.
- Proyecciones básicas de perfil/ranking.
- Rate limiting inicial.

### Criterios de salida

- Una partida jugada offline con cuenta puede sincronizarse después.
- Reintentos no duplican monedas ni recompensas.
- Errores de validación se explican sin perder progreso local.

---

## R7 - Modos avanzados

**Objetivo:** ampliar profundidad con modos que cambian la estrategia del juego.

### Alcance funcional

- Blind.
- Mirror.
- Chaos.
- Chain Reaction.
- Puzzle practice con banco inicial reducido.
- Rankings locales separados para cada modo.
- Power-ups específicos:
  - revelar salas en Blind.
  - vista previa en Blind.
  - pausa caos en Chaos.
  - auto-solve paso en Classic/Puzzle.

### Alcance técnico

- Motor de reglas extensible por modo.
- Eventos diferenciados entre movimiento del jugador y efectos del sistema.
- Animaciones específicas para perturbación, espejo y cadena.
- Tests de paridad si alguna regla competitiva existe en TypeScript y Go.

### Criterios de salida

- Cada modo avanzado tiene tutorial/entrada suficiente para entender su regla diferencial.
- Los eventos quedan registrados para replay/validación.
- La UI mantiene legibilidad aunque el modo agregue complejidad visual.

---

## R8 - Daily y live ops

**Objetivo:** agregar retención diaria y contenido recurrente sin depender de intervención manual constante.

### Alcance funcional

- Daily Challenge online con seed por fecha.
- Una participación competitiva por usuario por día.
- Ranking diario.
- Racha diaria.
- Recompensas por Daily completado.
- Vista semanal de rankings.
- Primeras temporadas ligeras con insignias/cosméticos.
- Configuración remota para parámetros no críticos: catálogo, temas, textos de evento y flags.

### Alcance backend

- Estado Daily por usuario/fecha.
- Proyecciones de ranking diario/semanal.
- Validación de disponibilidad y elegibilidad.
- Herramientas mínimas para seed/configuración del día.

### Criterios de salida

- El Daily es reproducible, validable y justo para todos los usuarios.
- El jugador entiende si su partida cuenta o no para ranking online.
- Las recompensas recurrentes no rompen la economía.

---

## R9 - Endgame

**Objetivo:** completar la visión del producto con profundidad, balance, operación estable y polish.

### Alcance funcional

- Banco amplio de Puzzle: al menos 100 puzzles por dificultad.
- Progresión de niveles hasta prestige cosmético.
- Logros locales y online completos.
- Tienda completa de power-ups, mejoras permanentes y temas.
- Rankings por modo/configuración relevante.
- Ranking semanal, global y filtros futuros como amigos si el producto lo justifica.
- Replays o solución post-partida para práctica/puzzle no ranked.
- Accesibilidad consolidada: teclado, foco, contraste, daltónico, reduced motion y alternativas no dependientes de color.
- Balance iterado de puntuación, monedas, costos, penalizaciones y cooldowns.

### Alcance técnico/operacional

- Observabilidad completa: logs estructurados, métricas, trazas en comandos críticos.
- Backups, restore probado y migraciones controladas.
- Materialized views/proyecciones optimizadas para rankings y perfil.
- Hardening anti-cheat.
- Playwright e2e completo en staging.
- Quality gates estables y SonarQube.
- Documentación de operación, rollback y soporte.

### Criterios de salida

- El producto soporta uso recurrente y competitivo sin intervenciones manuales frecuentes.
- El sistema puede operar en producción con monitoreo, rollback y datos auditables.
- La experiencia visual y de motion está pulida en mobile y desktop.
- Las reglas competitivas son reproducibles y defendibles.

---

## Dependencias críticas

| Dependencia | Bloquea |
|---|---|
| Dominio de tablero puro y testeado | Todos los modos y validación backend |
| Modelo de eventos de partida | Replay, anti-cheat, sincronización y rankings online |
| Persistencia local IndexedDB | Ranking local, offline, perfil local y cola de sincronización |
| OpenAPI versionado | Integración web/api estable |
| Idempotencia de comandos | Economía, recompensas, sincronización y retries |
| Sistema visual/tokens Tailwind | Consistencia UI y velocidad de construcción de pantallas |
| Estrategia de animación/reduced motion | Polish sin comprometer accesibilidad |

---

## Riesgos y decisiones tempranas

- **Resolver tableros aleatorios:** definir si todo tablero generado debe ser resoluble desde R1 o si la garantía entra en R3/R4. Para experiencia competitiva, conviene garantizar solvencia antes de rankings online.
- **Paridad TS/Go:** decidir cuánto dominio se duplica entre frontend y backend. Si se duplica, se necesitan fixtures y pruebas de paridad.
- **Economía local vs online:** evitar que monedas locales se transformen en ventaja online sin una migración controlada.
- **Power-ups y ranked:** modelar elegibilidad desde R4 para no rehacer score/ranking en R5.
- **Daily Challenge:** requiere servidor autoritativo; no conviene implementarlo antes de Online core.
- **Look and feel:** validar temprano que el estilo laboratorio arcade no afecte legibilidad del tablero.

---

## Corte recomendado para primer MVP público

El primer MVP público debería corresponder al final de **R2** o **R3**, según objetivo:

| Corte | Recomendado si |
|---|---|
| R2 | Se quiere validar diversión, UX local y retención básica con bajo costo backend |
| R3 | Se quiere validar rejugabilidad y variedad de modos antes de invertir en online |

Para una demo técnica interna, R1 es suficiente. Para una beta competitiva, el mínimo recomendado es R5.

---

## Lectura rápida de incremento de valor

| Release | Valor principal para jugador |
|---|---|
| R1 | Ya se puede jugar |
| R2 | El progreso local importa |
| R3 | Hay variedad y desafío |
| R4 | Hay progresión y ayudas |
| R5 | Hay competencia online |
| R6 | La cuenta y el offline son confiables |
| R7 | El juego tiene profundidad real |
| R8 | Hay razones para volver cada día |
| R9 | El producto está completo y operable |

---

*Fin del pre-roadmap - v0.1*
