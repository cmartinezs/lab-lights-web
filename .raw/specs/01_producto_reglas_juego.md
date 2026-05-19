# Luces del Laboratorio — Especificación de Producto y Reglas de Juego

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Responsabilidad:** Compartida entre frontend y backend  
**Repos destino:** `lab-lights-web` y `lab-lights-api`

---

## Propósito

Este documento define el comportamiento funcional del juego: reglas, modos, puntuación, economía, ayudas, progresión, rankings a nivel de producto y balance. Debe ser usado por ambos repositorios porque frontend y backend deben coincidir en experiencia, reglas visibles y validación de resultados.

---

## Resumen ejecutivo

**Luces del Laboratorio** es un puzzle game de tipo *Lights-Out* donde el objetivo es apagar todas las luces de un piso de salas. Al activar una sala, se invierte su estado y el de todas sus adyacentes (arriba, abajo, izquierda, derecha). El juego ofrece múltiples modos de desafío, una economía de monedas con power-ups canjeables, y rankings locales y online con estética de arcade de los años noventa.

### Pilares de diseño

- **Accesibilidad inmediata:** partida en menos de 10 segundos desde abrir la app.
- **Alta rejugabilidad:** modos de dificultad creciente, tableros aleatorios y rankings competitivos.
- **Estética arcade retro:** identidad visual inspirada en los gabinetes de arcade de los 90s (CRT scanlines, fuentes pixeladas, efectos de sonido chiptune).
- **Look and feel laboratorio arcade:** combinar terminales de laboratorio, luces fluorescentes, paneles eléctricos, neón controlado y feedback visual claro para que el tablero se lea rápido sin perder carácter.
- **Agnóstico de plataforma:** la especificación no asume tecnología. Puede implementarse como app móvil, web, desktop o consola.

---

## Mecánica base del juego

### El tablero

- El tablero es una cuadrícula de **N×M** salas (celdas).
- El tamaño mínimo es **3×3**; el máximo es **10×10**.
- Cada sala tiene exactamente dos estados: **Encendida (E)** o **Apagada (A)**.
- El estado inicial de cada sala se asigna de forma **aleatoria** al comenzar cada partida.
- Excepción: modos específicos pueden dictar el estado inicial (ver sección 3).

### Acción de juego

Cuando el jugador selecciona una sala `(fila, columna)`:

1. Se invierte el estado de esa sala.
2. Se invierte el estado de cada sala adyacente ortogonal (arriba, abajo, izquierda, derecha).
3. Las diagonales **no** se ven afectadas.
4. Las salas en los bordes del tablero no tienen adyacentes fuera del tablero (no hay wrap-around salvo en modos especiales).

```
Ejemplo en tablero 3×3, sala seleccionada = (1,1) [centro]:
Afecta: (0,1) arriba · (2,1) abajo · (1,0) izquierda · (1,2) derecha · (1,1) misma

Ejemplo sala (0,0) [esquina superior izquierda]:
Afecta: (0,1) derecha · (1,0) abajo · (0,0) misma
```

### Condición de victoria

La partida termina cuando **todas las salas están apagadas** (estado A).

### Condición de derrota

La partida puede terminar por derrota en los siguientes casos (según modo de juego):
- Se agotó el límite de movimientos sin apagar todas las luces.
- Se agotó el tiempo límite sin apagar todas las luces.

En modos sin límite no hay derrota: el jugador puede continuar indefinidamente.

---

## Modos de juego

### Classic

El modo base. Sin restricciones de tiempo ni movimientos.

| Parámetro | Valor |
|---|---|
| Tamaño del tablero | 3×3 (fijo) |
| Tiempo límite | Ninguno |
| Límite de movimientos | Ninguno |
| Estado inicial | Aleatorio |
| Estado del tablero visible | Sí |

**Métricas registradas:**
- Movimientos totales realizados.
- Tiempo total transcurrido (desde primer movimiento hasta victoria).
- Puntuación calculada (ver sección 4).

**Propósito:** Modo de entrada. Permite aprender la mecánica sin presión. Sirve de referencia para comparar con otros modos.

---

### Classic+

Versión del Classic con una restricción adicional activa. El jugador elige cuál antes de empezar.

#### Blind (A ciegas)

El tablero **no muestra el estado de las salas** en ningún momento. Solo se muestra la numeración/posición de cada sala. Tras cada movimiento se informa únicamente el conteo: cuántas salas encendidas quedan.

| Parámetro | Valor |
|---|---|
| Tamaño | 3×3 a 10×10 |
| Tiempo límite | Ninguno |
| Límite de movimientos | Ninguno |
| Estado visible | No (solo conteo) |

**Complejidad cognitiva:** Alta. El jugador debe construir un mapa mental del tablero.

---

#### Time Attack (Con tiempo límite)

El jugador debe resolver el tablero antes de que el temporizador llegue a cero.

| Parámetro | Valor |
|---|---|
| Tamaño | 3×3 a 10×10 |
| Tiempo base 3×3 | 120 segundos |
| Tiempo base por cada celda adicional | +8 segundos por celda sobre 9 |
| Límite de movimientos | Ninguno |
| Estado visible | Sí |

**Fórmula de tiempo base:**
```
tiempo_base = 120 + max(0, (N*M - 9)) * 8
```

**El tiempo restante al ganar** contribuye al puntaje (ver sección 4).

---

#### Move Limit (Con límite de movimientos)

El jugador tiene un número máximo de movimientos para resolver el tablero.

| Parámetro | Valor |
|---|---|
| Tamaño | 3×3 a 10×10 |
| Movimientos base 3×3 | 20 |
| Movimientos por cada celda adicional | +2 por celda sobre 9 |
| Tiempo límite | Ninguno |
| Estado visible | Sí |

**Fórmula de límite de movimientos:**
```
movimientos_limite = 20 + max(0, (N*M - 9)) * 2
```

Cada movimiento restante al ganar contribuye al puntaje.

---

#### Dimensional (Cambio de dimensiones)

El modo que desbloquea tableros de tamaño variable. El jugador elige las dimensiones antes de comenzar.

| Parámetro | Valor |
|---|---|
| Tamaño mínimo | 3×3 |
| Tamaño máximo | 10×10 |
| Tiempo límite | Opcional (el jugador activa o no) |
| Límite de movimientos | Opcional (el jugador activa o no) |
| Estado visible | Sí |

Permite combinar dimensiones con otras restricciones. El puntaje se escala con el tamaño del tablero.

---

### Modos adicionales

#### Chaos

El estado del tablero **cambia aleatoriamente** cada cierto intervalo de tiempo: una sala aleatoria se invierte (con efecto cascada sobre sus adyacentes), como si alguien estuviera tocando las luces al mismo tiempo que el jugador.

| Parámetro | Valor |
|---|---|
| Tamaño | 3×3 a 7×7 |
| Intervalo de perturbación | 5–15 segundos (aleatorio dentro del rango) |
| Tiempo límite | Ninguno |
| Límite de movimientos | Ninguno |
| Estado visible | Sí |

**Mecánica de perturbación:** Cuando ocurre una perturbación, se notifica al jugador visualmente y/o con sonido. Los movimientos del jugador y las perturbaciones se distinguen en pantalla.

---

#### Mirror

El tablero tiene **simetría especular activa**: cada movimiento del jugador también ejecuta su movimiento simétrico (horizontal, vertical o ambos, según variante elegida).

| Parámetro | Valor |
|---|---|
| Tamaño | Tableros de dimensión impar: 3×3, 5×5, 7×7, 9×9 |
| Eje de simetría | Horizontal / Vertical / Ambos (elegido antes de la partida) |
| Tiempo límite | Ninguno |
| Límite de movimientos | Ninguno |
| Estado visible | Sí |

**Ejemplo eje horizontal:** El jugador toca sala (1,0). El sistema también toca automáticamente sala (1,N-1). Ambas con efecto cascada propio.

**Implicación estratégica:** Cada movimiento afecta el doble (o cuádruple) de salas. Las soluciones del Classic no aplican directamente.

---

#### Chain Reaction

Las salas no solo invierten su estado: al activarse una sala, si tras la inversión queda encendida, **propaga la activación** a sus adyacentes en cadena (un nivel de profundidad). Si queda apagada, no propaga.

| Parámetro | Valor |
|---|---|
| Tamaño | 3×3 a 6×6 |
| Profundidad de cadena | 1 nivel |
| Tiempo límite | Ninguno |
| Límite de movimientos | Recomendado (aumenta tensión) |
| Estado visible | Sí, con animación de cadena |

**Complejidad:** Muy alta. Las cascadas son difíciles de predecir y la estrategia del Classic es completamente inaplicable.

---

#### Puzzle

En lugar de estado aleatorio, el tablero carga un **puzzle prediseñado** con solución conocida (y un número mínimo de movimientos). El objetivo es resolverlo en el mínimo de pasos posible.

| Parámetro | Valor |
|---|---|
| Tamaño | Varía por puzzle (3×3 a 10×10) |
| Puzzles disponibles | Banco de al menos 100 puzzles agrupados por dificultad |
| Dificultad | Fácil / Medio / Difícil / Experto |
| Tiempo límite | Ninguno (opcional en variante ranked) |
| Movimientos mínimos | Conocidos y mostrados al ganar |

**Ranking de puzzles:** Se registra si el jugador igualó o superó el mínimo de movimientos teórico.

---

#### Daily Challenge

Un puzzle único generado diariamente (igual para todos los jugadores, en base a una seed de fecha). Disponible una vez por día, por usuario.

| Parámetro | Valor |
|---|---|
| Tamaño | Varía por día (3×3 a 8×8) |
| Disponibilidad | Una partida por usuario por día |
| Modo | Classic con temporizador activo |
| Ranking | Global (todos compiten en el mismo puzzle) |
| Reward | Monedas bonus por completarlo |

---

### Resumen de modos

| Modo | Tablero | Tiempo | Movs | Visibilidad | Dificultad |
|---|---|---|---|---|---|
| Classic | 3×3 | ∞ | ∞ | Sí | ★ |
| Classic+ Blind | 3×3–10×10 | ∞ | ∞ | No | ★★★ |
| Classic+ Time Attack | 3×3–10×10 | Límite | ∞ | Sí | ★★ |
| Classic+ Move Limit | 3×3–10×10 | ∞ | Límite | Sí | ★★ |
| Dimensional | 3×3–10×10 | Opt. | Opt. | Sí | ★★ |
| Chaos | 3×3–7×7 | ∞ | ∞ | Sí | ★★★ |
| Mirror | Impar ≤9×9 | ∞ | ∞ | Sí | ★★★ |
| Chain Reaction | 3×3–6×6 | ∞ | Opt. | Sí | ★★★★ |
| Puzzle | Variable | ∞/Opt. | ∞ | Sí | ★–★★★★ |
| Daily Challenge | Variable | Activo | ∞ | Sí | ★★–★★★ |

---

## Sistema de puntuación

### Fórmula base

La puntuación se calcula al finalizar cada partida ganada:

```
puntaje_base = (celdas_totales × 100) / movimientos_realizados
```

### Multiplicadores

Los multiplicadores se aplican sobre el puntaje base de forma acumulativa:

| Factor | Condición | Multiplicador |
|---|---|---|
| Tiempo restante | (solo Time Attack) tiempo_restante > 50% del tiempo base | ×1.5 |
| Tiempo restante | (solo Time Attack) tiempo_restante > 20% del tiempo base | ×1.2 |
| Movimientos restantes | (solo Move Limit) movs_restantes > 30% del límite | ×1.4 |
| Blind | Modo Blind activo | ×2.0 |
| Tablero grande | N×M ≥ 7×7 | ×1.5 |
| Tablero grande | N×M ≥ 5×5 | ×1.2 |
| Sin power-ups | Partida completada sin usar ningún power-up | ×1.3 |
| Primer intento | Primera partida del día (Daily Challenge) | ×1.5 |
| Solución óptima | Puzzle resuelto en mínimo de movimientos | ×2.0 |

**Ejemplo:**
```
Tablero 5×5, Mode Attack, 25 movimientos realizados, 45 segundos restantes de 120:
puntaje_base = (25 × 100) / 25 = 100
× 1.5 (tablero ≥5×5)
× 1.2 (tiempo restante > 20%)
= puntaje_final = 180
```

### Monedas ganadas

```
monedas = floor(puntaje_final / 50)
```

Las monedas se acumulan independientemente del resultado del ranking.

### Partidas perdidas (derrota)

Las partidas perdidas otorgan monedas de consolación:
```
monedas_consolacion = floor(celdas_apagadas_al_terminar / celdas_totales × 10)
```

---

## Sistema de rankings y leaderboards

### Ranking local

- Almacenado en el dispositivo del jugador.
- Permite registrar hasta **10 entradas por modo de juego**.
- Cada entrada registra: iniciales del jugador (3 caracteres, al estilo arcade), puntaje, fecha, configuración de la partida (tamaño de tablero, restricciones activas, power-ups usados).
- Las iniciales se ingresan mediante teclado virtual estilo arcade (selección de letra por letra).
- Solo entran al ranking local las partidas que superen el puntaje mínimo del Top 10 actual.
- El ranking local es **persistente entre sesiones** y no requiere conexión a internet.

### Ranking online

- Requiere usuario registrado.
- Servidor centralizado recibe y valida puntajes.
- El cliente envía al servidor: user_id, modo, tamaño, puntaje, movimientos, tiempo, seed del tablero, power-ups usados, continuaciones usadas, reordenamientos usados, hash de verificación.
- El servidor puede **rechazar** puntajes que no pasen la validación (ver sección 5.4).

### Estructura de rankings

Hay un ranking separado por cada combinación significativa de modo y configuración:

| Ranking | Descripción |
|---|---|
| Classic · Global | Todos los tamaños, sin restricciones |
| Classic · 3×3 | Solo tableros 3×3 |
| Classic+ · Blind | Modo ciego, cualquier tamaño |
| Classic+ · Time Attack · 3×3 | Time Attack en 3×3 |
| Classic+ · Time Attack · NxM | Un ranking por tamaño de tablero |
| Classic+ · Move Limit · NxM | Un ranking por tamaño |
| Chaos · Global | Cualquier tamaño |
| Mirror · Horizontal/Vertical/Ambos | Un ranking por eje |
| Chain Reaction · Global | Cualquier tamaño |
| Daily Challenge | Un ranking por fecha |
| Puzzle · NombrePuzzle | Un ranking por puzzle individual |
| All-Time | Puntaje más alto histórico, todos los modos |

### Validación de puntajes (anti-cheat básico)

- La seed del tablero inicial se registra junto al puntaje.
- El servidor puede reproducir la partida con la misma seed para verificar que los movimientos sean coherentes con el resultado.
- Puntajes con tiempo imposiblemente corto (< umbral mínimo calculado por tamaño) son rechazados automáticamente.
- Los power-ups usados se descuentan del multiplicador esperado; una discrepancia invalida el puntaje.
- Las continuaciones y reordenamientos usados deben coincidir con el tipo de ranking al que se intenta enviar la partida.

### Visibilidad del ranking

- **Vista local:** muestra el ranking del dispositivo, destacando las entradas del usuario actual.
- **Vista online global:** Top 100 por modo.
- **Vista semanal:** Top 20 de la semana, se resetea cada lunes.
- **Vista de amigos:** (futuro) filtro para ver solo usuarios seguidos.

---

## Sistema de monedas y economía

### Fuentes de monedas

| Fuente | Monedas | Condición |
|---|---|---|
| Victoria en partida | `floor(puntaje / 50)` | Partida ganada |
| Derrota | `floor(% apagadas × 10)` | Partida perdida |
| Daily Challenge | +50 bonus | Completar el desafío del día |
| Racha diaria | +20 por día consecutivo (máx. +140 por semana) | 7 días seguidos |
| Primera victoria del día | +30 | Una vez por día por modo |
| Nuevo récord personal | +25 | Superar propio high score |
| Nuevo récord en ranking local | +50 | Entrar al Top 10 local |
| Nuevo récord en ranking online | +100 | Entrar al Top 100 online |
| Ver anuncio (opcional) | +15 | Solo en versiones freemium |

### Saldo máximo

El saldo de monedas no tiene tope. Sin embargo, los power-ups más potentes tienen un **cooldown** que limita su uso frecuente.

### Monedas no son transferibles

Las monedas son por perfil/dispositivo. No se pueden transferir entre usuarios ni comprar con dinero real (en la versión base de esta especificación).

---

## Tienda de bonus (Power-ups)

### Power-ups de partida

Se activan al inicio de la partida o durante ella. Solo pueden usarse una vez por partida por tipo (salvo indicación contraria).

| Power-up | Costo | Efecto | Disponible en modos |
|---|---|---|---|
| **+30s** | 30 monedas | Agrega 30 segundos al temporizador | Time Attack |
| **+60s** | 55 monedas | Agrega 60 segundos al temporizador | Time Attack |
| **+5 movimientos** | 25 monedas | Agrega 5 movimientos al límite | Move Limit |
| **+10 movimientos** | 45 monedas | Agrega 10 movimientos al límite | Move Limit |
| **Sugerencia de sala** | 40 monedas | Muestra la sala que, al activarse, apaga la mayor cantidad de luces en ese momento | Todos |
| **Revelar 3 salas** | 35 monedas | En modo Blind: revela el estado de 3 salas aleatorias durante 3 segundos | Blind |
| **Pausa caos** | 50 monedas | En modo Chaos: suspende las perturbaciones aleatorias por 20 segundos | Chaos |
| **Vista previa** | 60 monedas | Muestra el tablero completo durante 5 segundos antes de la primera jugada | Blind |
| **Deshacer** | 20 monedas | Revierte el último movimiento (máximo 3 veces por partida) | Todos |
| **Auto-solve paso** | 80 monedas | El sistema ejecuta automáticamente un movimiento óptimo | Classic, Puzzle |
| **Reordenar luces** | 30 monedas | Aleatoriza cuáles salas están encendidas/apagadas manteniendo la cantidad actual de encendidas | Modos visibles |
| **Última chispa** | 70 monedas | Power-up consumible de continuación tras derrota: +15s o +3 movimientos según modo | Time Attack, Move Limit |

### Notas sobre power-ups y puntaje

El uso de cualquier power-up **desactiva el multiplicador "sin power-ups" (×1.3)** y aplica un descuento sobre el puntaje final:

| Power-ups usados en la partida | Descuento sobre puntaje |
|---|---|
| 1 | -10% |
| 2 | -20% |
| 3 o más | -35% |

Los power-ups siguen teniendo valor porque permiten completar partidas que de otro modo resultarían en derrota (y completar da más monedas que perder).

Los power-ups que alteran información o estado del tablero deben registrarse en el historial de partida para rankings, replay y validación anti-cheat. Esto incluye: sugerencias, revelaciones, auto-solve, deshacer y reordenar luces.

### Power-ups permanentes (desbloqueables)

Se compran una sola vez y otorgan beneficios pasivos permanentes.

| Mejora | Costo | Efecto |
|---|---|---|
| **Contador de salas encendidas** | 100 monedas | Muestra el conteo de salas encendidas en tiempo real (estético en algunos modos) |
| **Historial de movimientos** | 150 monedas | Muestra los últimos 5 movimientos realizados |
| **Indicador de adyacencias** | 200 monedas | Al pasar el cursor/dedo sobre una sala, resalta sus adyacentes |
| **Modo daltónico** | Gratis | Activa paleta de colores accesible |
| **Temas de color** | 75–200 monedas | Cambia la paleta visual del tablero (CRT verde, ámbar, plasma, etc.) |

---

## Continuaciones y rescate de partidas

### Objetivo

Al perder una partida por tiempo o movimientos, el jugador puede gastar monedas o consumir un power-up de continuación para seguir jugando desde el mismo estado. La mecánica reduce frustración en partidas largas, pero debe proteger rankings y evitar ventajas pay-to-win.

### Reglas generales de continuación

- Solo se ofrece continuación en derrotas por límite de tiempo o límite de movimientos.
- No se ofrece continuación en Daily Challenge competitivo, salvo en una variante "práctica" que no entra al ranking online.
- Cada partida permite un máximo de **1 continuación estándar**.
- Una segunda continuación solo puede existir en eventos especiales o modo casual, y siempre marca la partida como **no ranked**.
- Continuar no reinicia el tablero, el seed ni los movimientos realizados.
- La pantalla de derrota debe mostrar claramente el costo, el efecto y si la partida seguirá siendo válida para ranking.

### Tipos de continuación

| Continuación | Costo | Efecto | Ranking local | Ranking online |
|---|---|---|---|---|
| **Tiempo extra corto** | 50 monedas | +30 segundos | Válido con penalización | No válido para Top competitivo |
| **Tiempo extra largo** | 90 monedas | +60 segundos | Casual / separado | No válido |
| **Movimientos extra corto** | 45 monedas | +5 movimientos | Válido con penalización | No válido para Top competitivo |
| **Movimientos extra largo** | 80 monedas | +10 movimientos | Casual / separado | No válido |
| **Última chispa** | Power-up consumible | Convierte derrota en 1 oportunidad: +15s o +3 movimientos según modo | Válido con penalización | No válido para Top competitivo |

### Penalización de puntaje por continuar

Si una partida continúa tras una derrota, el puntaje final se calcula normalmente y luego aplica una penalización:

| Continuaciones usadas | Penalización |
|---|---|
| 1 | -40% |
| 2 o más | Partida no ranked |

La partida también pierde automáticamente el multiplicador "sin power-ups".

### Separación de rankings

Para mantener competencia justa:
- Los rankings online principales solo aceptan partidas sin continuación.
- Los rankings locales pueden mostrar partidas con continuación, pero deben marcarlas con icono/etiqueta "CONTINUE".
- Opcionalmente puede existir un ranking separado "Casual" donde sí se aceptan continuaciones y ayudas.

---

## Asistencia anti-atasco

### Reordenar luces manteniendo cantidad

En modos con tablero visible, el jugador puede solicitar una randomización del estado del tablero cuando siente que quedó atascado. La acción mantiene la cantidad exacta de salas encendidas, pero redistribuye cuáles están encendidas y cuáles apagadas.

**Ejemplo:** si quedan 7 luces encendidas en un tablero 5×5, tras reordenar seguirán quedando 7 luces encendidas, pero en posiciones distintas.

### Modos disponibles

Disponible en:
- Classic.
- Time Attack.
- Move Limit.
- Dimensional visible.
- Chaos.
- Mirror.
- Chain Reaction.
- Puzzle en práctica.

No disponible en:
- Blind, porque el tablero no es visible.
- Daily Challenge competitivo.
- Puzzle ranked, salvo que el puzzle permita explícitamente ayudas casuales.

### Costos y límites

- Gratis una vez por partida en Classic 3×3 durante el tutorial o primeras sesiones.
- Luego cuesta **30 monedas** como power-up "Reordenar luces".
- Máximo **2 usos por partida**.
- En Time Attack no pausa el temporizador.
- En Move Limit no consume movimiento, pero sí cuenta como asistencia.

### Impacto en puntaje y validación

- Cuenta como power-up usado.
- Desactiva el multiplicador "sin power-ups".
- Aplica el descuento normal por cantidad de power-ups usados.
- En rankings online principales, las partidas con reordenamiento deben ir a ranking casual o ser rechazadas.
- El historial de partida debe registrar el momento exacto, cantidad de luces encendidas antes/después y seed derivada usada para el reordenamiento.

### Restricción de solvencia

Si el modo requiere tableros garantizados como resolubles, el reordenamiento debe generar una configuración resoluble. La forma recomendada es construir el nuevo estado aplicando una secuencia pseudoaleatoria de movimientos desde un tablero apagado hasta obtener la misma cantidad de luces encendidas, con límite de intentos y seed reproducible.

---

## Progresión, hitos y recompensas

### Niveles de jugador

El jugador acumula XP con cada partida. El XP determina su nivel, que desbloquea contenido:

| Nivel | XP requerido (acumulado) | Desbloqueo |
|---|---|---|
| 1 | 0 | Classic 3×3 |
| 2 | 500 | Classic+ Time Attack |
| 3 | 1.500 | Classic+ Move Limit |
| 4 | 3.000 | Tableros 4×4 y 5×5 |
| 5 | 6.000 | Classic+ Blind |
| 6 | 10.000 | Modo Mirror |
| 7 | 15.000 | Tableros 6×6 y 7×7 |
| 8 | 22.000 | Modo Chaos |
| 9 | 30.000 | Tableros 8×8 y 9×9 |
| 10 | 40.000 | Modo Chain Reaction |
| 11 | 55.000 | Tablero 10×10 |
| 12+ | +20.000 por nivel | Prestige (solo cosméticos) |

**XP por partida:**
```
xp = floor(puntaje_final × 0.1) + (victoria ? 50 : 10)
```

### Logros

Los logros son hitos permanentes que otorgan monedas al desbloquearse.

| Categoría | Ejemplo de logro | Recompensa |
|---|---|---|
| Primera vez | Primera partida ganada | 50 monedas |
| Velocidad | Ganar Classic 3×3 en menos de 30 segundos | 100 monedas |
| Eficiencia | Ganar con menos de 10 movimientos (3×3) | 150 monedas |
| Purista | Ganar 10 partidas seguidas sin power-ups | 200 monedas |
| Dimensiones | Ganar en tablero 10×10 | 300 monedas |
| Ciego | Ganar en modo Blind (cualquier tamaño) | 200 monedas |
| Caótico | Ganar en modo Chaos con 3+ perturbaciones ocurridas | 250 monedas |
| Coleccionista | Desbloquear todos los temas de color | 100 monedas |
| Diario | Completar 30 Daily Challenges | 500 monedas |
| Maratón | Jugar 100 partidas en total | 200 monedas |

### Hitos locales

Los hitos locales se calculan y pagan en el dispositivo. Están orientados a progreso personal, retención y dominio gradual.

| Hito local | Recompensa | Frecuencia |
|---|---|---|
| Primera victoria del día | 30 monedas | Diaria |
| 3 victorias en el día | 50 monedas | Diaria |
| 10 partidas jugadas | 40 monedas | Una vez por perfil |
| 25 / 50 / 100 victorias totales | 100 / 200 / 400 monedas | Una vez por perfil |
| Primer 5×5 completado | 100 monedas | Una vez por perfil |
| Primer 7×7 completado | 200 monedas | Una vez por perfil |
| Racha de 7 días | 250 monedas + tema cosmético | Semanal |
| Completar una partida sin ayudas tras usar ayudas en la anterior | 75 monedas | Repetible, máximo 1/día |

### Hitos online

Los hitos online requieren cuenta y validación del servidor. Sus recompensas no deben crear ventaja competitiva permanente.

| Hito online | Recompensa | Condición |
|---|---|---|
| Primer puntaje online validado | 100 monedas | Una vez por cuenta |
| Top 100 semanal en cualquier modo | 200 monedas + insignia semanal | Una vez por semana |
| Top 10 semanal | 400 monedas + marco cosmético temporal | Una vez por semana |
| Completar Daily Challenge 7 días seguidos | 350 monedas | Validado online |
| Ganar contra tu mejor marca personal online | 75 monedas | Máximo 1/día |
| Participar en 5 rankings distintos | 250 monedas | Una vez por cuenta |

### Reclamación de recompensas

- Las recompensas por hitos se muestran en una pantalla de "Recompensas" dentro del perfil.
- Las recompensas locales pueden reclamarse inmediatamente.
- Las recompensas online se reclaman tras confirmación del servidor.
- Cada recompensa debe registrarse con idempotencia (`reward_id`) para impedir doble cobro.
- Si el jugador juega offline y luego sincroniza, el servidor valida y concede solo recompensas online elegibles.

### Cadencia recomendada

Para evitar fatiga de recompensas:
- Mostrar máximo 3 recompensas pendientes de forma prominente.
- Agrupar recompensas menores en un resumen.
- Evitar pop-ups invasivos durante partida.
- Reservar animaciones grandes para nivel, logro importante o entrada a ranking.

---

## Consideraciones de balance y juego justo

### No pay-to-win

- Las monedas no se compran con dinero real en la versión base.
- Si existiera monetización futura, debe limitarse a cosméticos, temas, música, skins de tablero o eliminación de anuncios.
- Ninguna compra externa debe mejorar puntajes, probabilidades de victoria o acceso a rankings competitivos.
- Los power-ups pueden ayudar a completar partidas, pero siempre reducen puntaje o separan la partida del ranking competitivo.

### Separación entre competitivo y casual

El juego debe distinguir claramente:
- **Ranked:** sin continuaciones, sin reordenamiento, con power-ups limitados o penalizados según tabla.
- **Casual:** permite ayudas, continuaciones y reintentos con recompensas reducidas.
- **Práctica:** permite experimentar sin afectar estadísticas competitivas.

### Diseño de dificultad

- Los tableros aleatorios deben ser resolubles si el modo promete solución.
- El tutorial debe enseñar con tableros pequeños y soluciones demostrables.
- Los primeros tableros deben evitar configuraciones con demasiadas luces encendidas o patrones visualmente caóticos.
- La dificultad debe escalar por tamaño, restricciones, visibilidad y variante mecánica, no solo por azar.

### Calidad de vida esperada

Inspirado en juegos de puzzle similares:
- Botón de deshacer accesible, con límites claros.
- Vista de historial de movimientos.
- Reiniciar partida desde el mismo seed.
- Reintentar con tablero nuevo.
- Mostrar mejor marca personal en la configuración actual.
- Mostrar solución/replay después de rendirse en modo práctica o puzzle no ranked.
- Soporte para paleta daltónica, reducción de parpadeos y control de intensidad CRT.

### Eventos y temporadas

Opcionalmente, el juego puede tener temporadas semanales o mensuales:
- Rankings temporales con recompensas cosméticas.
- Puzzles temáticos.
- Objetivos comunitarios no competitivos.
- Recompensas de participación moderadas.

Las temporadas no deben resetear progreso base ni bloquear modos principales.

### Antifraude y transparencia

- Toda asistencia debe quedar visible en el resumen de resultado.
- Los rankings deben indicar si una marca fue conseguida sin ayudas.
- El servidor debe validar seed, movimientos, tiempos, power-ups, continuaciones y reordenamientos.
- Si una partida no califica para ranking online, la UI debe explicarlo antes de que el jugador gaste monedas.

---
