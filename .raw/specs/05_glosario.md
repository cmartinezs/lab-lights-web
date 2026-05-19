# Luces del Laboratorio — Glosario Compartido

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Responsabilidad:** Compartida  
**Repos destino:** `lab-lights-web` y `lab-lights-api`

---

## Glosario

| Término | Definición |
|---|---|
| **Sala** | Celda individual del tablero. Tiene estado E (encendida) o A (apagada). |
| **Tablero** | La cuadrícula completa de salas. Definido por dimensiones N×M. |
| **Inversión** | Cambio de estado de una sala: E→A o A→E. |
| **Adyacente** | Sala que comparte un borde ortogonal (no diagonal) con otra sala. |
| **Seed** | Valor inicial usado para generar aleatoriamente el estado del tablero. Permite reproducir la misma configuración. |
| **Movimiento** | Acción de seleccionar una sala (activa la inversión sobre ella y sus adyacentes). |
| **Power-up** | Bonus consumible que modifica temporalmente las condiciones de la partida. |
| **Continuación** | Acción de gastar monedas o un consumible tras perder para extender tiempo o movimientos desde el mismo estado. |
| **Reordenar luces** | Asistencia que redistribuye las luces encendidas/apagadas manteniendo la cantidad actual de encendidas. |
| **Hito** | Objetivo medible de progreso local u online que otorga recompensa al completarse. |
| **Iniciales** | Los 3 caracteres alfanuméricos que identifican a un jugador en el ranking local. |
| **XP** | Puntos de experiencia que acumula el jugador entre partidas para subir de nivel. |
| **Monedas** | Divisa del juego usada para canjear power-ups. |
| **Prestige** | Nivel más allá del máximo funcional; otorga solo beneficios cosméticos. |
| **Perturbación** | En modo Chaos: inversión aleatoria del estado de una sala activada por el sistema. |
| **Solución óptima** | Secuencia de movimientos de mínima longitud que resuelve el tablero. |
| **Wrap-around** | Variante de adyacencia donde las salas del borde izquierdo son adyacentes a las del borde derecho (y arriba con abajo). No activo por defecto. |
| **CQRS** | Patrón que separa comandos de escritura y consultas de lectura para escalar y validar cada lado de forma independiente. |
| **Arquitectura Hexagonal** | Estilo de arquitectura donde el dominio queda aislado de frameworks, base de datos, UI y transporte mediante puertos y adaptadores. |
| **DDD** | Domain-Driven Design: modelado del software alrededor del lenguaje y reglas del dominio. |
| **Gherkin** | Formato Given/When/Then para describir escenarios de comportamiento y aceptación. |
| **Idempotencia** | Propiedad que permite repetir una operación sin producir efectos duplicados. |
| **Stale-while-revalidate** | Estrategia de cache que muestra datos existentes mientras obtiene una versión actualizada en segundo plano. |
| **Circuit breaker** | Patrón que corta temporalmente llamadas a una dependencia degradada para evitar cascadas de fallos. |
